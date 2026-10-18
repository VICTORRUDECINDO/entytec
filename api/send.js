/**
 * Entytec Serverless API - Secure Email & Leads Dispatcher
 * Runs as a Vercel Serverless Function (Node.js runtime).
 *
 * Keeps all sensitive keys (EmailJS, Google Sheets) server-side,
 * shielding them from browser inspection and stopping spam bots.
 */

// Simple in-memory rate limiting map for basic flood control per IP
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6;

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const record = ipRateMap.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    ipRateMap.set(ip, { startTime: now, count: 1 });
    return false;
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  return false;
}

// Cleanup stale rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRateMap.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      ipRateMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref?.();

module.exports = async function handler(req, res) {
  // CORS & Preflight handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // Parse body if stringified
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const {
      type = 'contact',
      name = '',
      email = '',
      subject = '',
      message = '',
      intent = '',
      platforms = '',
      _hp_security_check = '', // Honeypot trap field
      _form_ts = null // Render timestamp for bot detection
    } = body;

    // 1. HONEYPOT TRAP:
    // If a spam bot filled this field (which is completely hidden from real users),
    // silently pretend success so the bot assumes it worked and stops retrying.
    if (_hp_security_check && _hp_security_check.trim() !== '') {
      console.warn('🛡️ Bot trapped by honeypot field:', { email, trapVal: _hp_security_check });
      return res.status(200).json({ success: true, message: 'Message processed successfully.' });
    }

    // 2. TIME-TRAP CHECK:
    // Humans need at least 1.2s to interact with and submit a form.
    // Automated scripts submit instantly (< 1200ms).
    if (_form_ts) {
      const elapsedMs = Date.now() - Number(_form_ts);
      if (elapsedMs > 0 && elapsedMs < 1200) {
        console.warn('🛡️ Bot trapped by fast submission time (< 1.2s):', { elapsedMs, email });
        return res.status(200).json({ success: true, message: 'Message processed successfully.' });
      }
    }

    // 3. RATE LIMITING PER CLIENT IP:
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before sending another message.'
      });
    }

    // 4. VALIDATE ESSENTIAL INPUTS:
    const cleanEmail = (email || '').trim();
    const cleanName = (name || '').trim();
    const cleanSubject = (subject || '').trim();
    const cleanMessage = (message || '').trim();
    const cleanIntent = (intent || 'General Inquiry').trim();
    const cleanPlatforms = (platforms || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    // Sanitize string lengths to prevent massive payload abuse
    if (cleanName.length > 150 || cleanEmail.length > 150 || cleanMessage.length > 5000) {
      return res.status(400).json({ success: false, error: 'Payload exceeds allowed limits.' });
    }

    // 5. SERVER ENVIRONMENT CONFIGURATION
    // Stored securely in Vercel Environment Variables.
    const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_d043mt3';
    const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'BISgrx9Em1Ja8r6LK';
    const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '';
    const EMAILJS_CONTACT_TEMPLATE = process.env.EMAILJS_CONTACT_TEMPLATE || 'template_u139egk';
    const EMAILJS_NEWSLETTER_TEMPLATE = process.env.EMAILJS_NEWSLETTER_TEMPLATE || 'template_u139egk';
    const EMAILJS_SUBSCRIBE_TEMPLATE = process.env.EMAILJS_SUBSCRIBE_TEMPLATE || 'template_u139egk';
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwe_iPJsnTR1ZnT5v0pMgrLqPqnD2ZvyGSxToN59F6dgL4TApQgqQtXY4wQ5S63w5x2IQ/exec';

    const nowFormatted = new Date().toLocaleString('en-US', { timeZone: 'America/Santo_Domingo' });

    // 6. DISPATCH ACCORDING TO FORM TYPE
    let emailPromise = null;
    let sheetsPromise = null;

    if (type === 'contact') {
      if (!cleanName || !cleanMessage) {
        return res.status(400).json({ success: false, error: 'Name and message are required.' });
      }

      const templateParams = {
        name: cleanName,
        from_name: cleanName,
        email: cleanEmail,
        from_email: cleanEmail,
        reply_to: cleanEmail,
        to_email: 'info@entytec.com',
        subject: cleanSubject || 'General Inquiry',
        message: cleanMessage,
        intent: cleanIntent || 'Contact',
        date: nowFormatted
      };

      emailPromise = sendEmailJS(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, templateParams);
    } else if (type === 'playtester') {
      const templateParams = {
        name: cleanName || 'Playtester Candidate',
        from_name: cleanName || 'Playtester Candidate',
        email: cleanEmail,
        from_email: cleanEmail,
        reply_to: cleanEmail,
        to_email: 'info@entytec.com',
        subject: '🎮 New Playtester Registration',
        message: `New playtester signed up!\nName: ${cleanName}\nEmail: ${cleanEmail}\nPlatforms: ${cleanPlatforms || 'PC / Steam'}`,
        intent: 'Playtester Signup',
        date: nowFormatted
      };

      emailPromise = sendEmailJS(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, templateParams);
    } else if (type === 'newsletter') {
      const templateParams = {
        email: cleanEmail,
        from_email: cleanEmail,
        reply_to: cleanEmail,
        to_email: 'info@entytec.com',
        subject: '📬 Newsletter Subscription',
        message: `New newsletter subscription: ${cleanEmail}`,
        intent: 'Newsletter',
        date: nowFormatted
      };

      emailPromise = sendEmailJS(EMAILJS_SERVICE_ID, EMAILJS_NEWSLETTER_TEMPLATE, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, templateParams);
      sheetsPromise = syncToGoogleSheets(GOOGLE_SHEETS_URL, 'Newsletter Subscriber', cleanEmail, nowFormatted);
    } else if (type === 'subscribe') {
      const templateParams = {
        name: cleanName || 'Community Subscriber',
        from_name: cleanName || 'Community Subscriber',
        email: cleanEmail,
        from_email: cleanEmail,
        reply_to: cleanEmail,
        to_email: 'info@entytec.com',
        subject: '📬 Community Subscription',
        message: `New community subscription:\nName: ${cleanName}\nEmail: ${cleanEmail}`,
        intent: 'Subscribe',
        date: nowFormatted
      };

      emailPromise = sendEmailJS(EMAILJS_SERVICE_ID, EMAILJS_SUBSCRIBE_TEMPLATE, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, templateParams);
      sheetsPromise = syncToGoogleSheets(GOOGLE_SHEETS_URL, cleanName || 'Community Member', cleanEmail, nowFormatted);
    } else {
      return res.status(400).json({ success: false, error: 'Unknown form submission type.' });
    }

    // Await email and sheets in parallel
    const [emailResult] = await Promise.allSettled([emailPromise, sheetsPromise]);

    if (emailResult.status === 'rejected') {
      console.error('Email sending failed:', emailResult.reason);
      return res.status(502).json({
        success: false,
        error: 'Unable to send email right now. Please try again or contact info@entytec.com.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Your request was sent successfully.'
    });

  } catch (error) {
    console.error('Server error processing form:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred. Please contact us at info@entytec.com.'
    });
  }
};

/**
 * Sends email via EmailJS REST API server-to-server.
 * No client-side SDK needed, credentials remain private.
 */
async function sendEmailJS(serviceId, templateId, publicKey, privateKey, templateParams) {
  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams
  };

  // If private key is configured in Vercel environment variables, attach it
  if (privateKey) {
    payload.accessToken = privateKey;
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'EntytecServerlessAPI/1.0'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`EmailJS API responded with ${response.status}: ${errorText}`);
  }

  return true;
}

/**
 * Syncs lead/subscriber to Google Sheets server-side.
 * Shielding the Google Apps Script WebApp URL from browser inspection.
 */
async function syncToGoogleSheets(scriptUrl, name, email, date) {
  if (!scriptUrl || scriptUrl.includes('TU_GOOGLE_')) return;

  try {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('date', date);

    await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
  } catch (err) {
    // Log error but don't fail the entire user request if Google Sheets is temporarily slow
    console.error('Error syncing to Google Sheets:', err.message);
  }
}

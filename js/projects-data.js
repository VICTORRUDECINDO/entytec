/**
 * Data structured for Entytec Video Game Studio projects
 */
const ENT_PROJECTS = [
  {
    id: "antrio",
    title: "Antrio",
    tagline: "A fast-paced 2D action-platformer inspired by the golden era of 8-bit classics.",
    category: "Action / Platformer",
    platform: "PC · Steam",
    status: "Available on Steam",
    releaseYear: "2024",
    engine: "Unity 3D",
    thumbnail: "Antrio/1.jpg",
    coverImage: "Antrio/2.jpg",
    gallery: [
      "Antrio/Gifs/1.gif",
      "Antrio/Gifs/2.gif",
      "Antrio/Gifs/3.gif"
    ],
    description: "Antrio is a high-octane 2D action-platformer paying homage to timeless 8-bit classics. Featuring razor-sharp precision controls, demanding level design, memorable boss fights, and an electrifying chiptune soundtrack.",
    features: [
      "Ultra-responsive jump and combat mechanics",
      "Multiple themed worlds with secret branching paths",
      "Challenging boss battles with distinctive attack patterns",
      "Full gamepad support and Steam achievements"
    ],
    demoUrl: "https://entytec.itch.io/antrio-demo",
    steamUrl: "https://store.steampowered.com/app/2012950/Antrio/",
    itchUrl: "https://entytec.itch.io/antrio-demo",
    badgeColor: "orange",
    isMain: true
  },
  {
    id: "my-perfect-pet",
    title: "My Perfect Pet",
    tagline: "A cozy simulation and genetics game where you breed and care for your dream pet.",
    category: "Simulation / Cozy",
    platform: "Web · itch.io",
    status: "Available / Testing",
    releaseYear: "2024",
    engine: "Unity 3D",
    thumbnail: "https://img.itch.zone/aW1nLzI0NTQ1NTQwLnBuZw==/315x250%23c/JxgPFp.png",
    coverImage: "https://img.itch.zone/aW1nLzI0NTQ1NTQwLnBuZw==/315x250%23c/JxgPFp.png",
    gallery: [
      "https://img.itch.zone/aW1nLzI0NTQ1NTQwLnBuZw==/315x250%23c/JxgPFp.png"
    ],
    description: "A warm and relaxing simulation game where players explore principles of inheritance and genetics to discover unique phenotypic combinations and nurture their ideal companion. Designed with an accessible, heartwarming atmosphere for players of all ages.",
    features: [
      "Intuitive genetic trait combinations and breeding mechanics",
      "Cozy, colorful art style with adorable creatures",
      "Playable directly in any web browser",
      "Perfect for interactive learning and family entertainment"
    ],
    demoUrl: "https://entytec.itch.io/my-perfect-pet-testing",
    itchUrl: "https://entytec.itch.io/my-perfect-pet-testing",
    badgeColor: "orange",
    isMain: true
  },
  {
    id: "alien-lab",
    title: "Alien Lab",
    tagline: "A sci-fi educational space adventure exploring human genetics, mutations, and cells.",
    category: "Educational / Sci-Fi",
    platform: "Web · itch.io",
    status: "Available on itch.io",
    releaseYear: "2023",
    engine: "Unity 3D",
    thumbnail: "https://img.itch.zone/aW1nLzIxMTUxMjgzLnBuZw==/315x250%23c/8nat4a.png",
    coverImage: "https://img.itch.zone/aW1nLzIxMTUxMjgzLnBuZw==/315x250%23c/8nat4a.png",
    gallery: [
      "https://img.itch.zone/aW1nLzIxMTUxMjgzLnBuZw==/315x250%23c/8nat4a.png"
    ],
    description: "Join a curious young alien scientist aboard a cutting-edge orbital station to investigate the mysteries of human genetics, DNA synthesis, biological inheritance patterns, and cellular structures through interactive laboratory challenges.",
    features: [
      "Hands-on laboratory puzzles and DNA synthesis mini-games",
      "Stylized sci-fi aesthetic and engaging character animations",
      "Developed in collaboration with educational gaming initiatives",
      "Fully compatible across desktop and laptop web browsers"
    ],
    demoUrl: "https://entytec.itch.io/alien-lab",
    itchUrl: "https://entytec.itch.io/alien-lab",
    badgeColor: "amber",
    isMain: true
  },
  {
    id: "your-turn",
    title: "You Turn",
    tagline: "Fast and responsive arcade reflex game available to play on itch.io.",
    category: "Arcade / Casual",
    platform: "Web · itch.io",
    status: "Available on itch.io",
    releaseYear: "2024",
    engine: "Unity 3D",
    thumbnail: "Otros proyectos/your-turn.png",
    coverImage: "Otros proyectos/your-turn.png",
    gallery: ["Otros proyectos/your-turn.png"],
    description: "A dynamic and challenging arcade game tailored for quick, addictive sessions directly in the browser. Test your timing and agility across increasingly difficult obstacles.",
    features: ["Simple one-touch controls", "Responsive browser performance", "Instant replayability"],
    demoUrl: "https://entytec.itch.io/your-turn",
    itchUrl: "https://entytec.itch.io/your-turn",
    badgeColor: "emerald",
    isMain: false
  },
  {
    id: "bubble-effect",
    title: "Bubble Effect",
    tagline: "Chain reactions and spatial reflexes in a vibrant arcade puzzle atmosphere.",
    category: "Puzzle / Arcade",
    platform: "Web · itch.io",
    status: "Available on itch.io",
    releaseYear: "2023",
    engine: "Unity 3D",
    thumbnail: "Otros proyectos/bubble-effect.png",
    coverImage: "Otros proyectos/bubble-effect.png",
    gallery: ["Otros proyectos/bubble-effect.png"],
    description: "A colorful puzzle game focused on timing, angle calculation, and satisfying chain reactions. Trigger cascaded explosions to clear levels and set high scores.",
    features: ["Dynamic chain reactions", "Energetic soundtrack", "Easy to learn, hard to master"],
    demoUrl: "https://entytec.itch.io/bubble-effect",
    itchUrl: "https://entytec.itch.io/bubble-effect",
    badgeColor: "orange",
    isMain: false
  },
  {
    id: "geometry-slime",
    title: "Geometry Slime",
    tagline: "Fun educational title exploring geometric figures, angles, and shapes.",
    category: "Educational",
    platform: "Web · itch.io",
    status: "Available on itch.io",
    releaseYear: "2023",
    engine: "Unity 3D",
    thumbnail: "https://img.itch.zone/aW1nLzE5NzgxNDU4LmpwZw==/315x250%23c/XRt4TG.jpg",
    coverImage: "https://img.itch.zone/aW1nLzE5NzgxNDU4LmpwZw==/315x250%23c/XRt4TG.jpg",
    gallery: ["https://img.itch.zone/aW1nLzE5NzgxNDU4LmpwZw==/315x250%23c/XRt4TG.jpg"],
    description: "Master key geometry and mathematics principles through joyful, hands-on gameplay guiding charming slimes through shape-shifting puzzles.",
    features: ["Core geometric concepts", "Immediate visual feedback", "Vibrant, friendly visuals"],
    demoUrl: "https://entytec.itch.io/geometry-slime",
    itchUrl: "https://entytec.itch.io/geometry-slime",
    badgeColor: "amber",
    isMain: false
  },
  {
    id: "ball-rush",
    title: "Ball Rush",
    tagline: "High-speed reflex runner dodging obstacles through treacherous tracks.",
    category: "Arcade / Runner",
    platform: "Web · itch.io",
    status: "Available on itch.io",
    releaseYear: "2023",
    engine: "Unity 3D",
    thumbnail: "https://img.itch.zone/aW1nLzE5MDg5Njg1LnBuZw==/315x250%23c/pbEtEj.png",
    coverImage: "https://img.itch.zone/aW1nLzE5MDg5Njg1LnBuZw==/315x250%23c/pbEtEj.png",
    gallery: ["https://img.itch.zone/aW1nLzE5MDg5Njg1LnBuZw==/315x250%23c/pbEtEj.png"],
    description: "Test your lightning-quick reflexes in this addictive runner. Dodge hazards, maintain momentum, and set new personal bests across multiple dynamic courses.",
    features: ["Fast-paced gameplay", "Multiple challenging tracks", "Competitive high score chasing"],
    demoUrl: "https://entytec.itch.io/ball-rush",
    itchUrl: "https://entytec.itch.io/ball-rush",
    badgeColor: "emerald",
    isMain: false
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ENT_PROJECTS };
}

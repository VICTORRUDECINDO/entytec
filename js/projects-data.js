/**
 * Data structured for Entytec Video Game Studio projects
 */
const ENT_PROJECTS = [
  {
    id: "antrio",
    title: "Antrio",
    tagline: "Un vertiginoso juego de plataformas y acción 2D inspirado en la era dorada de los 8 bits.",
    category: "Action / Platformer",
    platform: "PC · Steam",
    status: "Disponible en Steam",
    releaseYear: "2024",
    engine: "Unity 3D",
    thumbnail: "Antrio/1.jpg",
    coverImage: "Antrio/2.jpg",
    gallery: [
      "Antrio/3.jpg",
      "Antrio/4.jpg",
      "Antrio/4.jpg"
    ],
    description: "Antrio es un frenético juego de acción y plataformas en 2D que rinde homenaje a los grandes clásicos de la era de 8-bits, combinando mecánicas de precisión contemporáneas, diseño de niveles desafiante, jefes memorables y una banda sonora chiptune electrizante.",
    features: [
      "Mecánicas de salto y combate ultra-precisas",
      "Múltiples mundos temáticos con caminos secretos",
      "Diseño de jefes con patrones únicos y desafiantes",
      "Soporte completo para mandos y logros de Steam"
    ],
    demoUrl: "#demo-antrio",
    steamUrl: "https://store.steampowered.com",
    badgeColor: "orange"
  },
  {
    id: "alchemist",
    title: "The Alchemist Apprentice",
    tagline: "Aventura de puzles mágicos y combinaciones alquímicas en un mundo vibrante.",
    category: "Puzzle / Adventure",
    platform: "PC · Mobile",
    status: "En Producción",
    releaseYear: "2025",
    engine: "Unity 3D",
    featured: true,
    thumbnail: "Otros proyectos/alchemist_1-768x424.png",
    coverImage: "Otros proyectos/alchemist_1-768x424.png",
    gallery: [
      "Otros proyectos/alchemist_1-768x424.png",
      "Otros proyectos/alchemist_2-768x428.png"
    ],
    description: "Conviértete en un aprendiz de alquimia y desentraña los misterios de una ancestral academia mágica. Combina elementos, forja pociones con propiedades dinámicas y resuelve desafiantes acertijos ambientales para restaurar el equilibrio arcano.",
    features: [
      "Sistema dinámico de mezclas químicas y elementos mágicos",
      "Acertijos basados en física e interacción ambiental",
      "Estilo artístico estilizado y relajante",
      "Optimizado para pantallas táctiles y teclado/ratón"
    ],
    demoUrl: "#demo-alchemist",
    steamUrl: "https://store.steampowered.com",
    badgeColor: "amber"
  },
  {
    id: "yarari",
    title: "Yarari: The Sacred Valley",
    tagline: "Explora la mitología ancestral y rescata los espíritus de la naturaleza.",
    category: "Action / Adventure",
    platform: "PC · Consoles",
    status: "En Desarrollo",
    releaseYear: "2026",
    engine: "Unity 3D",
    featured: true,
    thumbnail: "Otros proyectos/yarari1-768x576.jpg",
    coverImage: "Otros proyectos/yarari1-768x576.jpg",
    gallery: [
      "Otros proyectos/yarari1-768x576.jpg",
      "Otros proyectos/yarari2-768x574.jpg"
    ],
    description: "Una experiencia inmersiva que toma como inspiración la rica herencia y leyendas ancestrales del Caribe. Recorre valles sagrados, desentraña ruinas olvidadas y domina habilidades elementales para proteger la fauna mística de la corrupción.",
    features: [
      "Ambientación inspirada en el folclore y biodiversidad tropical",
      "Combate fluido en tiempo real y exploración vertical",
      "Banda sonora orquestal con instrumentos folclóricos autóctonos",
      "Narrativa profunda sobre el vínculo entre el ser humano y la naturaleza"
    ],
    demoUrl: "#demo-yarari",
    steamUrl: "https://store.steampowered.com",
    badgeColor: "emerald"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ENT_PROJECTS };
}

// =====================================================================
//  Datos del día. Lo marcado "A CONFIRMAR" todavía es de ejemplo.
//  Las fechas van en formato "AAAA-MM-DDTHH:MM" (hora de Argentina).
// =====================================================================
window.CONFIG = {
  // Muestra una franja "Borrador" arriba. Poner en false al publicar.
  borrador: true,

  nombre: "Helena",
  titulo: "Mi Bautismo",
  ciudad: "Rosario · Roldán",
  bienvenida:
    "Con mucha alegría queremos compartir con vos un día muy especial: " +
    "mi bautismo por la mañana y el festejo por la tarde.",

  padres: ["Giuliana Alonzo", "Nahuel Trovato"],
  padrinos: ["Florencia Alonzo", "Emma Jimenez", "Facundo Cordoba", "Tomas Jabbur"],

  // Los dos momentos del día.
  eventos: [
    {
      id: "bautismo",
      momento: "Por la mañana",
      titulo: "Bautismo",
      lugar: "Parroquia San Francisco Solano",
      direccion: "Bv. Avellaneda y Mendoza, Rosario",
      inicio: "2026-12-19T10:00",
      fin: "2026-12-19T12:00",
      // Coordenadas GPS del lugar (de OpenStreetMap). Se usan para el mapa y "Cómo llegar".
      gps: [-32.9445974, -60.6808078],
      icono: "iglesia",
    },
    {
      id: "festejo",
      momento: "Por la tarde",
      titulo: "Festejo",
      lugar: "Hada Blanca Eventos",
      direccion: "Av. Acequias del Aire, Roldán",
      inicio: "2026-12-19T16:00",
      fin: "2026-12-19T19:00",
      gps: [-32.9011753, -60.874005],
      icono: "globos",
    },
  ],

  // Línea de tiempo del día (dejar [] para ocultarla). Ejemplo:
  // { hora: "17:30", texto: "Torta y velitas", icono: "torta" }   (íconos: iglesia, globos, taza, torta, musica)
  itinerario: [],

  // Opcionales: dejar en "" para ocultar la sección.
  vestimenta: "",          // ej: "Elegante sport"
  regalos: {
    texto: "",             // ej: "Tu presencia es nuestro mejor regalo. Si querés hacernos un presente:"
    titular: "",
    alias: "",
    cuenta: "",            // CBU
  },

  // Confirmación de asistencia
  confirmarHasta: "2026-12-10",   // A CONFIRMAR
  // Dirección del script de Google (ver INSTRUCCIONES.md). Vacío = MODO DEMO, no guarda nada.
  sheetUrl: "",

  // Web de fotos del cumple (la que ya existe).
  fotosUrl: "https://nahutrovato.github.io/cumple_helena26/",
};

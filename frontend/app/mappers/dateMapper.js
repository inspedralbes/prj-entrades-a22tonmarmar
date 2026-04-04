export function formatEventDate(rawDate) {
  if (!rawDate) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const str = String(rawDate);

  // Aceptamos formatos tipo "YYYY-MM-DD" o "YYYY-MM-DDTHH:MM:SS..."
  const [datePart, timePart] = str.split("T");
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) {
    return str;
  }

  let hours = "00";
  let minutes = "00";

  if (timePart) {
    const [h, m] = timePart.split(":");
    if (h) hours = pad(h);
    if (m) minutes = pad(m);
  }

  return `${pad(day)}-${pad(month)}-${year} / ${hours}-${minutes}`;
}

// Normaliza una fecha cualquiera a formato "YYYY-MM-DD"
export function toDateInputValue(rawDate) {
  if (!rawDate) return "";

  const str = String(rawDate);

  // Si viene como ISO ("2026-04-05T00:00:00.000000Z") nos quedamos con la parte de fecha
  if (str.includes("T")) {
    return str.slice(0, 10);
  }

  // Si ya es YYYY-MM-DD la devolvemos tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Intento de parseo genérico usando Date
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
}

// Normaliza una hora cualquiera a formato "HH:MM" (24h)
export function toTimeInputValue(rawTime) {
  if (!rawTime) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const str = String(rawTime).trim();

  // Casos tipo "YYYY-MM-DDTHH:MM:SS" o "YYYY-MM-DD HH:MM:SS"
  let timePart = str;
  if (str.includes("T")) {
    timePart = str.split("T")[1];
  } else if (str.includes(" ")) {
    const parts = str.split(" ");
    timePart = parts[parts.length - 1];
  }

  const [h, m] = timePart.split(":");
  if (!h || !m) return "";

  return `${pad(h)}:${pad(m)}`;
}

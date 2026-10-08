// revisor/js/filters.js
// Decide qué servicios pasan el filtro. Son funciones puras: no tocan el documento.

// Quita acentos y mayúsculas para que "catalo" encuentre "Catálogo".
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// filter = { text: "", status: "all" | "available" | "down" }
export function filterServices(services, filter) {
  const wanted = normalize(filter.text);
  return services.filter((service) => {
    const nameMatches = normalize(service.name).includes(wanted);
    const statusMatches = filter.status === "all" || service.status === filter.status;
    return nameMatches && statusMatches;
  });
}

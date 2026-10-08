// fig06_08/main.js
import { services } from "./services.js";
import { summarize } from "./stats.js";

const summary = summarize(services);

console.log(`Disponibles: ${summary.available}`);
console.log(`Caídos: ${summary.down}`);
console.log(
  summary.averageMs === null
    ? "Respuesta promedio: sin datos"
    : `Respuesta promedio: ${summary.averageMs} ms`,
);
console.log(JSON.stringify(summary));

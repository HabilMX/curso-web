// revisor/js/form.js
// Traduce lo que el navegador sabe de un campo a una frase para la persona, y lee el
// formulario. No dibuja nada: recibe un control y devuelve texto.

// Para cada campo, qué decir según la regla que incumple (las banderas de `validity`).
const MESSAGES = {
  "new-name": {
    valueMissing: "Escribe el nombre del servicio.",
    tooShort: "Usa al menos 2 caracteres.",
    patternMismatch: "Sin espacios al inicio ni al final.",
  },
  "new-status": {
    valueMissing: "Elige el estado del servicio.",
  },
  "new-response-ms": {
    valueMissing: "Escribe el tiempo en milisegundos.",
    badInput: "Escribe un número, como 250.",
    rangeUnderflow: "No puede ser negativo.",
    rangeOverflow: "El máximo es 60 000 ms.",
    stepMismatch: "Escribe un número entero.",
  },
};

// Devuelve el texto del error de un control, o "" si el control es válido.
// El orden de las banderas en MESSAGES es el orden de prioridad: varias pueden
// estar encendidas a la vez y se dice una sola, la primera.
export function errorMessage(control) {
  if (!control.willValidate || control.validity.valid) {
    return "";
  }
  if (control.validity.customError) {
    return control.validationMessage; // el texto que puso setCustomValidity
  }
  const forControl = MESSAGES[control.id] ?? {};
  for (const flag in forControl) {
    if (control.validity[flag]) {
      return forControl[flag];
    }
  }
  return control.validationMessage; // último recurso: el texto del navegador
}

// Lee un formulario ya validado y arma el servicio con las mismas claves que data/services.json.
// Un campo desactivado no viaja en FormData: un servicio caído queda con responseMs en null.
export function readService(form) {
  const data = new FormData(form);
  const time = data.get("responseMs");
  return {
    id: crypto.randomUUID(), // un identificador nuevo, que no choca con ninguno
    name: data.get("name").trim(),
    status: data.get("status"),
    responseMs: time === null ? null : Number(time),
  };
}

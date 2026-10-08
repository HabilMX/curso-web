// revisor/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import {
  createState, startLoading, loadSucceeded, loadFailed, toggleSort, select,
  changeFilter, nameExists, addService, visible, situation,
} from "./state.js";
import { render, renderCount } from "./view.js";
import { errorMessage, readService } from "./form.js";

// Casos de prueba para ver cada situación sin romper nada: index.html?case=empty
// Es una lista cerrada: el texto de la dirección elige UNA de estas opciones, nunca se usa como dirección.
const CASES = {
  normal: { url: "data/services.json", timeoutMs: 3000 },
  empty: { url: "data/services-empty.json", timeoutMs: 3000 },
  error: { url: "data/missing.json", timeoutMs: 3000 },
  invalid: { url: "index.html", timeoutMs: 3000 },
  // ?delay=5000 solo lo entiende slow-server.py, que tarda 5 s en contestar; el límite son 3 s.
  timeout: { url: "data/services.json?delay=5000", timeoutMs: 3000 },
};
const requested = new URLSearchParams(location.search).get("case");
const current = Object.hasOwn(CASES, requested) ? CASES[requested] : CASES.normal;

const elements = {
  notice: document.querySelector("#notice"),
  errorNotice: document.querySelector("#error-notice"),
  retry: document.querySelector("#retry"),
  dataZone: document.querySelector("#data-zone"),
  addZone: document.querySelector("#add-zone"),
  tableZone: document.querySelector("#table-zone"),
  count: document.querySelector("#count"),
  checkedAt: document.querySelector("#checked-at"),
  total: document.querySelector("#summary-total"),
  available: document.querySelector("#summary-available"),
  down: document.querySelector("#summary-down"),
  average: document.querySelector("#summary-average"),
  body: document.querySelector("#services-body"),
  detail: document.querySelector("#detail"),
  sortButton: document.querySelector("#sort"),
  checkNow: document.querySelector("#check-now"),
};

const state = createState();

async function load() {
  // El botón que pidió la carga se oculta mientras carga, y con él se va el foco:
  // se anota para devolverlo al terminar.
  const fromButton = document.activeElement === elements.checkNow || document.activeElement === elements.retry;
  startLoading(state);
  render(state, elements);
  try {
    loadSucceeded(state, await loadServices(current.url, current.timeoutMs), new Date());
  } catch (error) {
    loadFailed(state, error.message);
  }
  render(state, elements);
  if (fromButton) {
    (situation(state) === "ready" ? elements.checkNow : elements.retry).focus();
  }
}

// Cambiar el estado y dibujar. Al volver a dibujar las filas, el botón que tenía el foco
// desaparece y aparece otro igual: hay que devolverle el foco a quien lo tenía.
function update(change) {
  const focusedId = document.activeElement?.dataset?.id;
  change();
  render(state, elements);
  if (focusedId !== undefined) {
    elements.body.querySelector(`button[data-id="${CSS.escape(focusedId)}"]`)?.focus();
  }
}

elements.sortButton.addEventListener("click", () => update(() => toggleSort(state)));
elements.checkNow.addEventListener("click", load);
elements.retry.addEventListener("click", load);

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

// ---- filtros ----
// La tabla se redibuja con cada tecla, pero el aviso del conteo espera a que la persona deje de
// escribir: un lector de pantalla no debe leer "Mostrando 4", "Mostrando 3", "Mostrando 1" letra por letra.
let timer;
function announceCountLater() {
  clearTimeout(timer);
  timer = setTimeout(() => renderCount(state, elements), 400);
}

document.querySelector("#search").addEventListener("input", (event) => {
  changeFilter(state, { text: event.target.value });
  render(state, elements, { count: false });
  announceCountLater();
});

// Un solo oyente para los tres radios: el evento change sube hasta el <fieldset>.
document.querySelector("#status-filter").addEventListener("change", (event) => {
  changeFilter(state, { status: event.target.value });
  render(state, elements);
});

// ---- formulario: agregar un servicio ----
const form = document.querySelector("#add-form");
const nameField = document.querySelector("#new-name");
const statusField = document.querySelector("#new-status");
const timeField = document.querySelector("#new-response-ms");
const formResult = document.querySelector("#form-result");

// Escribe (o borra) el texto del error de un campo y marca el campo para los lectores de pantalla.
function paint(control) {
  const text = errorMessage(control);
  document.querySelector(`#${control.id}-error`).textContent = text;
  if (text === "") {
    control.removeAttribute("aria-invalid");
  } else {
    control.setAttribute("aria-invalid", "true");
  }
}

// Un servicio caído no tiene tiempo de respuesta: se desactiva el campo (y deja de validarse).
function syncTime() {
  const down = statusField.value === "down";
  timeField.disabled = down;
  if (down) {
    timeField.value = "";
    paint(timeField);
  }
}

// La regla que el navegador no conoce: el nombre no puede repetirse. SIEMPRE con su rama que limpia.
function validateUniqueName() {
  nameField.setCustomValidity(
    nameExists(state, nameField.value) ? "Ya existe un servicio con ese nombre." : "",
  );
}

// El navegador dispara "invalid" en cada campo inválido cuando se intenta enviar. Cancelarlo apaga su
// burbuja; en su lugar escribimos el mensaje en la página, donde se queda y un lector de pantalla lo lee.
// "invalid" no sube por el árbol: por eso se escucha en la fase de captura (el tercer argumento).
form.addEventListener("invalid", (event) => {
  event.preventDefault();
  paint(event.target);
  if (event.target === form.querySelector(":invalid")) {
    const howMany = form.querySelectorAll(":invalid").length;
    formResult.textContent = howMany === 1
      ? "No se agregó: hay 1 campo con error."
      : `No se agregó: hay ${howMany} campos con error.`;
    event.target.focus();
  }
}, true);

form.addEventListener("input", (event) => {
  const control = event.target;
  formResult.textContent = "";
  if (control === nameField) validateUniqueName();
  if (control === statusField) syncTime();
  if (control.getAttribute("aria-invalid") === "true") paint(control);
});

form.addEventListener("focusout", (event) => {
  const control = event.target;
  if (control.matches(":user-invalid") || control.hasAttribute("aria-invalid")) paint(control);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const service = readService(form);
  addService(state, service);
  form.reset();
  syncTime();
  render(state, elements);
  const hidden = visible(state).includes(service) ? "" : " El filtro actual lo oculta.";
  formResult.textContent =
    `Servicio «${service.name}» agregado. Ahora hay ${state.services.length}.${hidden}`;
  nameField.focus();
});

load();

// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, loadSucceeded, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
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
  let services;
  try {
    services = await loadServices("data/services.json");
  } catch (error) {
    // Por ahora la falla solo queda en la consola. La lección 9 la lleva a la pantalla.
    console.error(`No se pudieron cargar los servicios: ${error.message}`);
    return;
  }
  loadSucceeded(state, services, new Date());
  render(state, elements);
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

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

load();

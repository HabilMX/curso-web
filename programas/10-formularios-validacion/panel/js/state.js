// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.
import { filterServices, normalize } from "./filters.js";

export function createState() {
  return {
    phase: "loading",       // "loading" | "error" | "ready"
    services: [],
    errorMessage: null,     // texto para la persona, solo en la fase "error"
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
    filter: { text: "", status: "all" },
  };
}

export function startLoading(state) {
  state.phase = "loading";
  state.errorMessage = null;
}

export function loadSucceeded(state, services, checkedAt) {
  state.phase = "ready";
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
}

export function loadFailed(state, message) {
  state.phase = "error";
  state.errorMessage = message;
}

// Lo que la pantalla debe mostrar: "empty" no es una fase que se guarde, se DEDUCE.
// Una lista vacía que llegó bien es un resultado válido, no un error.
export function situation(state) {
  if (state.phase === "ready" && state.services.length === 0) return "empty";
  return state.phase;
}

export function toggleSort(state) {
  state.sortByTime = !state.sortByTime;
}

// Elegir el que ya estaba elegido lo deselecciona.
export function select(state, id) {
  state.selected = state.selected === id ? null : id;
}

// changes = { text } o { status }: solo se pisa lo que llega.
export function changeFilter(state, changes) {
  Object.assign(state.filter, changes);
}

export function nameExists(state, name) {
  const wanted = normalize(name);
  return state.services.some((service) => normalize(service.name) === wanted);
}

export function addService(state, service) {
  state.services.push(service);
}

// Lo que se debe mostrar, calculado a partir del estado cada vez: primero se filtra,
// luego se ordena. filter y toSorted devuelven copias: el arreglo de los datos no se toca.
export function visible(state) {
  const filtered = filterServices(state.services, state.filter);
  if (!state.sortByTime) {
    return filtered;
  }
  // Los que no tienen medida (null) van al final.
  return filtered.toSorted((a, b) => (a.responseMs ?? Infinity) - (b.responseMs ?? Infinity));
}

export function selectedService(state) {
  return state.services.find((service) => service.id === state.selected) ?? null;
}

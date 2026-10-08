// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState(services) {
  return {
    services,           // los datos
    sortByTime: false,  // false = en el orden original; true = del más rápido al más lento
    selected: null,     // el id del servicio elegido, o null
  };
}

export function toggleSort(state) {
  state.sortByTime = !state.sortByTime;
}

// Elegir el que ya estaba elegido lo deselecciona.
export function select(state, id) {
  state.selected = state.selected === id ? null : id;
}

// Lo que se debe mostrar, calculado a partir del estado cada vez.
// toSorted devuelve una copia ordenada: el arreglo de los datos no se toca.
export function visible(state) {
  if (!state.sortByTime) {
    return state.services;
  }
  // Los que no tienen medida (null) van al final.
  return state.services.toSorted((a, b) => (a.responseMs ?? Infinity) - (b.responseMs ?? Infinity));
}

export function selectedService(state) {
  return state.services.find((service) => service.id === state.selected) ?? null;
}

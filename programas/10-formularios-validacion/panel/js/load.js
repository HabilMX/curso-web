// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error con un mensaje
// que una persona pueda leer. No toca el documento.

export async function loadServices(url, timeoutMs = 3000) {
  // Paso 1: la respuesta. Aquí fallan la red, el tiempo límite y los estados HTTP.
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no respondió en ${timeoutMs} ms.`);
    }
    throw new Error("No se pudo conectar con el servidor.");
  }

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo. El límite de tiempo sigue corriendo mientras se lee.
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no terminó de responder en ${timeoutMs} ms.`);
    }
    if (error.name === "SyntaxError") {
      throw new Error("La respuesta no es JSON válido.");
    }
    // Cualquier otra falla al leer el cuerpo: la conexión se cortó a medias o el cuerpo
    // no se pudo decodificar. Desde aquí no se sabe cuál de las dos fue.
    throw new Error("No se pudo leer completa la respuesta del servidor.");
  }

  if (!Array.isArray(data)) {
    throw new Error("La respuesta no es una lista de servicios.");
  }
  if (!data.every(isService)) {
    throw new Error("Algún servicio de la lista llegó incompleto o con datos de otro tipo.");
  }
  return data;
}

// Un servicio, tal como lo entiende el panel: un objeto (no null) con sus cuatro claves,
// cada una del tipo que el resto del código espera.
function isService(item) {
  return typeof item === "object" && item !== null &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.status === "string" &&
    (item.responseMs === null || Number.isFinite(item.responseMs));
}

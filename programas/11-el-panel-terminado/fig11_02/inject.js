// fig11_02/inject.js
// Un nombre que viene de fuera y trae un ataque dentro.
const incoming = '<img src="missing.png" onerror="document.title = \'atacado\'">';

// MAL: innerHTML interpreta el texto como HTML.
document.getElementById("zone").innerHTML = incoming;

const images = document.querySelectorAll("#zone img").length;
document.getElementById("result").textContent =
  `Imágenes inyectadas: ${images}. Título de la página: ${document.title}`;

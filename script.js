let historial = JSON.parse(localStorage.getItem('historial')) || [];
document.addEventListener('DOMContentLoaded', () => {
  mostrarHistorial();
});
function cifrar() {
  const clave = document.getElementById("clave").value;
  const texto = document.getElementById("mensaje").value;
  if (!clave || !texto) return alert("Debes ingresar tu clave y mensaje.");
  simularTerminal("Cifrando mensaje...");
  const cifrado = CryptoJS.AES.encrypt(texto, clave).toString();
  document.getElementById("resultado").value = cifrado;
  historial.push({ tipo: "🔐 Cifrado", texto: cifrado });
  guardarHistorial();
}
function descifrar() {
  const clave = document.getElementById("clave").value;
  const texto = document.getElementById("mensaje").value;
  if (!clave || !texto) return alert("Debes ingresar tu clave y mensaje.");
  try {
    simularTerminal("Descifrando mensaje...");
    const descifrado = CryptoJS.AES.decrypt(texto, clave).toString(CryptoJS.enc.Utf8);
    if (!descifrado) throw Error("Clave incorrecta.");
    document.getElementById("resultado").value = descifrado;
    historial.push({ tipo: "🔓 Descifrado", texto: descifrado });
    guardarHistorial();
  } catch {
    alert("Error al descifrar. Verifica la clave o el mensaje.");
  }
}
function copiar() {
  const texto = document.getElementById("resultado").value;
  if (!texto) return alert("Nada para copiar.");
  navigator.clipboard.writeText(texto);
  alert("Copiado al portapapeles.");
}
function compartirWhatsApp() {
  const texto = document.getElementById("resultado").value;
  if (!texto) return alert("No hay mensaje cifrado para compartir.");
  const mensaje = `🔐 Mensaje cifrado:\n\n${texto}\n\nPuedes descifrarlo usando tu clave en el Encriptador.`;
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
function guardarHistorial() {
  localStorage.setItem('historial', JSON.stringify(historial));
  mostrarHistorial();
}
function mostrarHistorial() {
  const lista = document.getElementById("historial");
  lista.innerHTML = "";
  historial.slice(-10).reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.tipo}: ${entry.texto}`;
    lista.appendChild(li);
  });
}
function borrarHistorial() {
  if (confirm("¿Seguro que deseas borrar el historial?")) {
    historial = [];
    localStorage.removeItem("historial");
    mostrarHistorial();
  }
}
function cambiarClave() {
  const nueva = prompt("Ingresa tu nueva clave:");
  if (nueva) {
    localStorage.setItem("clave", nueva);
    alert("Clave actualizada.");
  }
}
function exportarHistorial() {
  const clave = document.getElementById("clave").value;
  if (!clave) return alert("Ingresa tu clave actual para exportar.");
  const contenido = JSON.stringify(historial);
  const cifrado = CryptoJS.AES.encrypt(contenido, clave).toString();
  const blob = new Blob([cifrado], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.download = "historial_cifrado.enc";
  link.href = URL.createObjectURL(blob);
  link.click();
}
function simularTerminal(texto) {
  const resultado = document.getElementById("resultado");
  resultado.value = "";
  let i = 0;
  const intervalo = setInterval(() => {
    if (i >= texto.length) {
      clearInterval(intervalo);
    } else {
      resultado.value += texto[i++];
    }
  }, 50);
}
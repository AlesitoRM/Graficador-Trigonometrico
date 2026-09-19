function loopAnimacion() {
    Logica.avanzarTiempo();
    Renderizador.dibujarFrame();
    requestAnimationFrame(loopAnimacion); 
}

// ----------------------------------------------------
// MANEJO DE EVENTOS (Interacciones del usuario)
// ----------------------------------------------------
const btnAnimacion = document.getElementById('btnAnimacion');

btnAnimacion.addEventListener('click', () => {
    Estado.animando = !Estado.animando;
    
    btnAnimacion.classList.toggle('pausado', Estado.animando);
    btnAnimacion.innerHTML = Estado.animando ? 'Pausar' : 'Iniciar';
});

function aplicarMetaGrados() {
    const input = document.getElementById('inputGrados');
    const grados = parseFloat(input.value);
    
    if (!isNaN(grados)) {
        Logica.fijarMeta(grados);
        // Muestra el ángulo normalizado en el input (ej. -45° se muestra como 315°)
        input.value = Estado.metaGrados;
    }
}

document.getElementById('btnMarcar').addEventListener('click', aplicarMetaGrados);
document.getElementById('inputGrados').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        aplicarMetaGrados();
    }
});

document.getElementById('selectorFuncion').addEventListener('change', (event) => {
    Logica.cambiarFuncion(event.target.value);
});

document.getElementById('inputFrecuencia').addEventListener('input', (event) => {
    const freq = parseFloat(event.target.value);
    if (!isNaN(freq) && freq > 0) {
        Logica.cambiarFrecuencia(freq);
    }
});

document.getElementById('inputDesfase').addEventListener('input', (event) => {
    const desfase = parseFloat(event.target.value);
    if (!isNaN(desfase)) {
        Logica.cambiarDesfase(desfase);
    }
});

// Inicializamos la aplicación dibujando el primer cuadro (frame) en estado de reposo
Renderizador.dibujarFrame();

requestAnimationFrame(loopAnimacion);
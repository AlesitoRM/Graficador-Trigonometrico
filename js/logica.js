// Procesa las matemáticas y actualiza los datos
const Logica = {
    avanzarTiempo: function () {
        if (Estado.animando) {
            Estado.anguloActual += Estado.velocidad;
            if (Estado.anguloActual >= 2 * Math.PI) {
                Estado.anguloActual = 0;
            }
        }
    },

    fijarMeta: function (grados) {
        if (isNaN(grados)) return;

        // Normaliza cualquier ángulo (negativo o > 360) al rango [0, 360]
        let normalizado = ((grados % 360) + 360) % 360;

        // Si el usuario ingresó exactamente 360, -360, 720, etc., situar en el ciclo completo 360°
        if (normalizado === 0 && Math.abs(grados) >= 360) {
            normalizado = 360;
        }

        Estado.metaGrados = normalizado;
        Estado.metaRadianes = normalizado * (Math.PI / 180);
        Estado.metaFijada = true;

        // Si el simulador está en pausa, redibuja inmediatamente
        if (!Estado.animando) {
            Renderizador.dibujarFrame();
        }
    },

    cambiarFuncion: function (nuevaFuncion) {
        Estado.funcion = nuevaFuncion;
        // Si el simulador está en pausa, fuerza un redibujado inmediato
        if (!Estado.animando) {
            Renderizador.dibujarFrame();
        }
    },

    cambiarFrecuencia: function (nuevaFrecuencia) {
        Estado.frecuencia = Math.max(0.1, nuevaFrecuencia);
        // Si el simulador está en pausa, fuerza un redibujado inmediato
        if (!Estado.animando) {
            Renderizador.dibujarFrame();
        }
    },

    cambiarDesfase: function (grados) {
        if (isNaN(grados)) return;
        Estado.desfaseGrados = grados;
        Estado.desfaseRadianes = grados * (Math.PI / 180);
        
        if (!Estado.animando) {
            Renderizador.dibujarFrame();
        }
    }
};
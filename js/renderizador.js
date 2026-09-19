const Renderizador = {
    ctxCirculo: document.getElementById('canvasCirculo').getContext('2d'),
    ctxOnda: document.getElementById('canvasOnda').getContext('2d'),
    
    escala: 100, 
    
    // Funciones para traducir coordenadas matemáticas a píxeles en pantalla
    mapX_Circ: (x) => 160 + (x * Renderizador.escala),
    mapY_Circ: (y) => 160 - (y * Renderizador.escala),
    mapX_Onda: (x) => x * Renderizador.escala,
    mapY_Onda: (y) => 160 - (y * Renderizador.escala),

    limpiarLienzos: function() {
        this.ctxCirculo.clearRect(0, 0, 320, 320);
        this.ctxOnda.clearRect(0, 0, 680, 320);
    },

    dibujarEjes: function() {
        // Ejes del círculo
        this.ctxCirculo.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctxCirculo.lineWidth = 1;
        this.ctxCirculo.beginPath();
        this.ctxCirculo.moveTo(0, 160); this.ctxCirculo.lineTo(320, 160);
        this.ctxCirculo.moveTo(160, 0); this.ctxCirculo.lineTo(160, 320);
        this.ctxCirculo.stroke();

        this.ctxCirculo.strokeStyle = 'rgba(0, 240, 255, 0.22)';
        this.ctxCirculo.setLineDash([4, 4]);
        this.ctxCirculo.beginPath();
        this.ctxCirculo.arc(160, 160, this.escala, 0, 2 * Math.PI);
        this.ctxCirculo.stroke();
        this.ctxCirculo.setLineDash([]); 

        // Grados en el círculo
        this.ctxCirculo.beginPath();
        this.ctxCirculo.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        for (let deg = 0; deg < 360; deg += 15) {
            let rad = deg * Math.PI / 180;
            let c = Math.cos(rad);
            let s = Math.sin(rad);
            
            this.ctxCirculo.moveTo(this.mapX_Circ(c * 0.96), this.mapY_Circ(s * 0.96));
            this.ctxCirculo.lineTo(this.mapX_Circ(c * 1.04), this.mapY_Circ(s * 1.04));
            
            if (deg % 30 === 0) { 
                if (deg % 90 === 0) {
                    this.ctxCirculo.fillStyle = '#F8FAFC';
                    this.ctxCirculo.font = '600 10px "JetBrains Mono", monospace';
                } else {
                    this.ctxCirculo.fillStyle = '#64748B';
                    this.ctxCirculo.font = '400 9px "JetBrains Mono", monospace';
                }

                let xText = this.mapX_Circ(c * 1.25);
                let yText = this.mapY_Circ(s * 1.25);

                if (Math.abs(c) < 0.1) this.ctxCirculo.textAlign = 'center';
                else if (c > 0) this.ctxCirculo.textAlign = 'left';
                else this.ctxCirculo.textAlign = 'right';

                if (Math.abs(s) < 0.1) this.ctxCirculo.textBaseline = 'middle';
                else if (s > 0) this.ctxCirculo.textBaseline = 'bottom';
                else this.ctxCirculo.textBaseline = 'top';

                this.ctxCirculo.fillText(deg + '°', xText, yText);
            }
        }
        this.ctxCirculo.stroke();

        // Ejes de la onda
        this.ctxOnda.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctxOnda.beginPath();
        this.ctxOnda.moveTo(0, 160); this.ctxOnda.lineTo(680, 160);
        this.ctxOnda.stroke();

        this.ctxOnda.textBaseline = 'top';
        this.ctxOnda.beginPath();
        this.ctxOnda.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        for (let deg = 0; deg <= 360; deg += 15) {
            let rad = deg * Math.PI / 180;
            let x = this.mapX_Onda(rad);
            
            this.ctxOnda.moveTo(x, 156);
            this.ctxOnda.lineTo(x, 164);
            
            if (deg % 30 === 0) {
                if (deg === 0) {
                    this.ctxOnda.textAlign = 'left';
                    x += 3;
                } else if (deg === 360) {
                    this.ctxOnda.textAlign = 'right';
                    x -= 3;
                } else {
                    this.ctxOnda.textAlign = 'center';
                }

                if (deg % 90 === 0) {
                    this.ctxOnda.fillStyle = '#F8FAFC';
                    this.ctxOnda.font = '600 10px "JetBrains Mono", monospace';
                    this.ctxOnda.fillText(deg + '°', x, 170);
                } else {
                    this.ctxOnda.fillStyle = '#64748B';
                    this.ctxOnda.font = '400 9px "JetBrains Mono", monospace';
                    this.ctxOnda.fillText(deg + '°', x, 172); 
                }
            }
        }
        this.ctxOnda.stroke();
    },

    dibujarMeta: function() {
        if (!Estado.metaFijada) return;
        const anguloMeta = Estado.metaRadianes;
        // En el círculo, la aguja amarilla apunta fielmente a los grados marcados
        const xMark = Math.cos(anguloMeta);
        const yMark = Math.sin(anguloMeta);

        this.ctxCirculo.strokeStyle = '#F59E0B'; 
        this.ctxCirculo.beginPath();
        this.ctxCirculo.moveTo(this.mapX_Circ(0), this.mapY_Circ(0));
        this.ctxCirculo.lineTo(this.mapX_Circ(xMark), this.mapY_Circ(yMark));
        this.ctxCirculo.stroke();

        this.ctxCirculo.fillStyle = '#F59E0B';
        this.ctxCirculo.beginPath();
        this.ctxCirculo.arc(this.mapX_Circ(xMark), this.mapY_Circ(yMark), 5, 0, 2 * Math.PI);
        this.ctxCirculo.fill();

        // En la onda, evaluamos la función con la frecuencia y desfase en ese ángulo meta
        const anguloMetaEfectivo = (anguloMeta * Estado.frecuencia) + Estado.desfaseRadianes;
        let yOndaMark = 0;
        if (Estado.funcion === 'Seno') yOndaMark = Math.sin(anguloMetaEfectivo);
        else if (Estado.funcion === 'Coseno') yOndaMark = Math.cos(anguloMetaEfectivo);
        else if (Estado.funcion === 'Tangente') yOndaMark = Math.tan(anguloMetaEfectivo);
        else if (Estado.funcion === 'MayorEntero') yOndaMark = Math.floor(Math.sin(anguloMetaEfectivo));

        if (Math.abs(yOndaMark) <= 1.5) { 
            // Línea guía vertical fija en la meta
            this.ctxOnda.strokeStyle = 'rgba(245, 158, 11, 0.7)';
            this.ctxOnda.setLineDash([4, 4]);
            this.ctxOnda.beginPath();
            this.ctxOnda.moveTo(this.mapX_Onda(anguloMeta), this.mapY_Onda(0));
            this.ctxOnda.lineTo(this.mapX_Onda(anguloMeta), this.mapY_Onda(yOndaMark));
            this.ctxOnda.stroke();
            this.ctxOnda.setLineDash([]);

            // Punto objetivo en la onda (sólido y brillante cuando la onda lo alcanza)
            const alcanzado = Estado.anguloActual >= anguloMeta;
            this.ctxOnda.fillStyle = alcanzado ? '#F59E0B' : 'rgba(245, 158, 11, 0.45)';
            this.ctxOnda.strokeStyle = '#F59E0B';
            this.ctxOnda.lineWidth = 1.5;
            this.ctxOnda.beginPath();
            this.ctxOnda.arc(this.mapX_Onda(anguloMeta), this.mapY_Onda(yOndaMark), 5, 0, 2 * Math.PI);
            this.ctxOnda.fill();
            this.ctxOnda.stroke();
        }
    },

    dibujarEstadoActual: function() {
        const ang = Estado.anguloActual;
        const angEfectivo = (ang * Estado.frecuencia) + Estado.desfaseRadianes;
        const xCirc = Math.cos(angEfectivo);
        const yCirc = Math.sin(angEfectivo);

        let color = '#00F0FF'; 
        let proyeccionColor = '#F43F5E';
        
        if (Estado.funcion === 'Coseno') {
            color = '#10B981'; 
            proyeccionColor = '#10B981';
        }
        if (Estado.funcion === 'Tangente') {
            color = '#A855F7';
            proyeccionColor = '#A855F7';
        }
        if (Estado.funcion === 'MayorEntero') {
            color = '#EAB308';
            proyeccionColor = '#F97316';
        }

        // Dibuja el radio vector en el círculo
        this.ctxCirculo.strokeStyle = '#F8FAFC';
        this.ctxCirculo.lineWidth = 2;
        this.ctxCirculo.beginPath();
        this.ctxCirculo.moveTo(this.mapX_Circ(0), this.mapY_Circ(0));
        this.ctxCirculo.lineTo(this.mapX_Circ(xCirc), this.mapY_Circ(yCirc));
        this.ctxCirculo.stroke();

        this.ctxCirculo.strokeStyle = proyeccionColor;
        this.ctxCirculo.lineWidth = 3;
        this.ctxCirculo.beginPath();
        if (Estado.funcion === 'Seno') {
            this.ctxCirculo.moveTo(this.mapX_Circ(xCirc), this.mapY_Circ(0));
            this.ctxCirculo.lineTo(this.mapX_Circ(xCirc), this.mapY_Circ(yCirc));
        } else if (Estado.funcion === 'Coseno') {
            this.ctxCirculo.moveTo(this.mapX_Circ(0), this.mapY_Circ(0));
            this.ctxCirculo.lineTo(this.mapX_Circ(xCirc), this.mapY_Circ(0));
        } else if (Estado.funcion === 'Tangente') {
            this.ctxCirculo.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctxCirculo.moveTo(this.mapX_Circ(1), 0);
            this.ctxCirculo.lineTo(this.mapX_Circ(1), 320); 
            this.ctxCirculo.stroke();
            this.ctxCirculo.strokeStyle = proyeccionColor;
            this.ctxCirculo.beginPath();
            this.ctxCirculo.moveTo(this.mapX_Circ(0), this.mapY_Circ(0));
            this.ctxCirculo.lineTo(this.mapX_Circ(1), this.mapY_Circ(Math.tan(angEfectivo)));
            this.ctxCirculo.stroke();
        } else if (Estado.funcion === 'MayorEntero') {
            // Proyección del valor escalonado (piso de sen)
            let yPiso = Math.floor(yCirc);
            this.ctxCirculo.moveTo(this.mapX_Circ(xCirc), this.mapY_Circ(0));
            this.ctxCirculo.lineTo(this.mapX_Circ(xCirc), this.mapY_Circ(yPiso));
        }
        this.ctxCirculo.stroke();

        this.ctxCirculo.fillStyle = color;
        this.ctxCirculo.beginPath();
        this.ctxCirculo.arc(this.mapX_Circ(xCirc), this.mapY_Circ(yCirc), 6, 0, 2*Math.PI);
        this.ctxCirculo.fill();

        // Dibuja la onda generada
        this.ctxOnda.strokeStyle = color;
        this.ctxOnda.lineWidth = 3;
        this.ctxOnda.beginPath();
        
        let primerPunto = true;
        const paso = Math.min(0.01, 0.01 / Estado.frecuencia);
        for (let a = 0; a <= ang; a += paso) {
            let aEff = (a * Estado.frecuencia) + Estado.desfaseRadianes;
            let y = 0;
            if (Estado.funcion === 'Seno') y = Math.sin(aEff);
            else if (Estado.funcion === 'Coseno') y = Math.cos(aEff);
            else if (Estado.funcion === 'MayorEntero') y = Math.floor(Math.sin(aEff));
            else if (Estado.funcion === 'Tangente') {
                y = Math.tan(aEff);
                if (Math.abs(y) > 10) { 
                    primerPunto = true; 
                    continue; 
                }
            }
            
            if (primerPunto) {
                this.ctxOnda.moveTo(this.mapX_Onda(a), this.mapY_Onda(y));
                primerPunto = false;
            } else {
                this.ctxOnda.lineTo(this.mapX_Onda(a), this.mapY_Onda(y));
            }
        }

        let yExact = 0;
        if (Estado.funcion === 'Seno') yExact = Math.sin(angEfectivo);
        else if (Estado.funcion === 'Coseno') yExact = Math.cos(angEfectivo);
        else if (Estado.funcion === 'Tangente') yExact = Math.tan(angEfectivo);
        else if (Estado.funcion === 'MayorEntero') yExact = Math.floor(Math.sin(angEfectivo));

        if (Estado.funcion !== 'Tangente' || Math.abs(yExact) <= 10) {
            if (primerPunto) {
                this.ctxOnda.moveTo(this.mapX_Onda(ang), this.mapY_Onda(yExact));
            } else {
                this.ctxOnda.lineTo(this.mapX_Onda(ang), this.mapY_Onda(yExact));
            }
        }
        this.ctxOnda.stroke();

        if (Math.abs(yExact) <= 1.5) {
            this.ctxOnda.strokeStyle = proyeccionColor;
            this.ctxOnda.setLineDash([5, 5]);
            this.ctxOnda.beginPath();
            this.ctxOnda.moveTo(this.mapX_Onda(ang), this.mapY_Onda(0));
            this.ctxOnda.lineTo(this.mapX_Onda(ang), this.mapY_Onda(yExact));
            this.ctxOnda.stroke();
            this.ctxOnda.setLineDash([]);

            this.ctxOnda.fillStyle = color;
            this.ctxOnda.beginPath();
            this.ctxOnda.arc(this.mapX_Onda(ang), this.mapY_Onda(yExact), 6, 0, 2*Math.PI);
            this.ctxOnda.fill();
        }
    },

    dibujarFrame: function() {
        this.limpiarLienzos();
        this.dibujarEjes();
        this.dibujarMeta();
        this.dibujarEstadoActual();
    }
};
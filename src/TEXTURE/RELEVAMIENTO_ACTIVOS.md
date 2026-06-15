# RELEVAMIENTO DE ACTIVOS - ISO CORE v1.0

Este documento detalla las dimensiones exactas y la **perspectiva** que deben tener tus archivos individuales para que el motor los renderice correctamente.

## 🎨 Perspectiva y Estilo
- **Vista 3/4 (Recomendada):** Como la que mostraste en tu imagen. Es ideal porque los pies se alinean con los ejes del suelo isométrico.
- **Múltiples Direcciones:** No tienen que ser solo de frente. El motor espera 5 estados por cada personaje.

## 📂 Guía de Archivos Individuales (Stage 1)

Crea tus archivos con estas medidas exactas (Ancho x Alto). Si el archivo contiene varias direcciones, debe ser una "tira" (sprite strip).

### 👤 ALDEANOS (94x78 px por frame)
Cada archivo debe contener 5 frames verticales (una tira de 94x390 px):
1. **Frame 1:** Mirando hacia abajo (3/4 frente)
2. **Frame 2:** Mirando hacia la izquierda (Perfil)
3. **Frame 3:** Mirando hacia la derecha (Perfil inverso)
4. **Frame 4:** Mirando hacia arriba (3/4 espalda)
5. **Frame 5:** Pose de espera (Idle)

**Nombres de archivos:**
- `Aldeano_Lenador.png` (94x390 px)
- `Aldeano_Recolector.png` (94x390 px)
- `Aldeano_Mujer.png` (94x390 px)
- `Aldeano_Nino.png` (94x390 px)
- `Aldeano_Anciano.png` (94x390 px)

### ⚔️ ACCIONES (86x195 px por frame)
Animaciones de estado que aparecen sobre el aldeano:
- `Accion_Talar.png`
- `Accion_Recolectar.png`
- `Accion_Cargar.png`
- `Accion_Comer.png`

### 🏠 EDIFICIOS (127x182 px por frame)
- `Edificio_Casa.png`
- `Edificio_Almacen.png`
- `Edificio_Taller.png`

### 🌲 RECURSOS (117x90 px)
- `Recurso_Arbol.png`
- `Recurso_Roca.png`
- `Recurso_Fruta.png`

### 🐺 ANIMALES (86x135 px por frame)
- `Animal_Lobo.png`
- `Animal_Oso.png`
- `Animal_Conejo.png`

---
**Tip Pro:** El primer sprite de tu imagen (el de la izquierda) es el mejor para el "Frame 1" (Abajo). El del medio es perfecto para el "Frame 2" (Izquierda). ¡Sigue ese estilo pixel-art, le queda genial al Vector Lab!

Una vez los tengas, avísame para subirlos a la carpeta `/public/textures` y conectarlos.
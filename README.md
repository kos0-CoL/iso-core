# 🧠 ISO-CORE: LABORATORIO DE LA BIBLIA NEURONAL v2.0

Bienvenido al simulador de emergencia conductual basado en la **Matriz de Perceptrones**.

## 🚀 Cómo iniciar

### Opción A: Simulación Next.js (Laboratorio Completo)
Esta versión incluye el inspector de agentes, el lienzo isométrico y la terminal de comandos semánticos (Genkit).

1. Instala las dependencias (si no lo has hecho): `npm install`
2. Inicia el servidor: `npm run dev`
3. Abre: [http://localhost:9005](http://localhost:9005)

### Opción B: Prototipo Ligero (Legacy)
Si quieres probar solo la lógica de `brain.js`:
1. Abre el archivo `index.html` directamente en tu navegador.

## 🕹️ Mecánicas del Juego
- **Selección:** Haz clic en cualquier aldeano o en la **Aldea Central** para ver sus vectores internos.
- **Interacción:** El mundo se puebla automáticamente con recursos (árboles) y amenazas (lobos).
- **Biblia Neuronal:** Cada agente tiene un cerebro con 17 inputs sensoriales ($X_1$ a $X_{17}$).
- **Comandos Divinos:** Usa la terminal superior para alterar la realidad (ej: "más hambre", "entorno peligroso").

## 📂 Estructura
- `src/lib/simulation-logic.ts`: El motor de perceptrones y pesos sinápticos.
- `src/ai/flows/`: Flujos de Genkit para el ajuste semántico divino.
- `biblia.md`: La documentación maestra de los pesos y neuronas.

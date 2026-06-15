
# GUÍA DE GENERACIÓN DE TILES - ISO CORE v3.0

Para que los biomas se rendericen correctamente en el nuevo motor de zoom centrado, utiliza estas especificaciones:

## 📐 Dimensiones de Tile
- **Diamante Base:** 64x32 px.
- **Imagen de Salida:** 128x128 px (permite profundidad y texturas de borde).

## 🎨 Biomas ( public/textures/ )
1. **Grass_Tile.png**: Césped verde oscuro vibrante.
2. **Forest_Floor.png**: Tierra con hojas y raíces para zonas de bosque.
3. **Desert_Sand.png**: Arena con patrones de viento.
4. **Water_Tile.png**: Agua cristalina con reflejos celestes.

## 🐺 Fauna y Recursos
- **Animal_Deer.png**: 64x64 px, vista 3/4.
- **Animal_Boar.png**: 64x64 px, perfil robusto.
- **Recurso_Roca.png**: 64x64 px, gris basalto con vetas blancas.

## 🏛️ Especial: Sprite de Bosque
Crea un sprite llamado `Overlay_Bosque.png` que sea una sombra suave circular. El motor lo usará para "vectorizar" visualmente las zonas de peligro.

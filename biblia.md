# LA BIBLIA NEURONAL v2.0: MATRIZ MAESTRA DE PERCEPTRONES

## 📋 Los 17 Inputs del Entorno y Estado Interno ($X_1$ a $X_{17}$)

Cada ciclo de simulación, el juego le pasa al cerebro de cada aldeano estos 17 valores normalizados entre 0.0 y 1.0:

| Input | Descripción |
|-------|-------------|
| $X_1$ | Proximidad de Amenaza Real (Peligro visible en el mapa) |
| $X_2$ | Clima Hostil (Intensidad de frío, tormenta o nieve) |
| $X_3$ | Falta de Luz (Nivel de oscuridad actual. Noche = 1.0) |
| $X_4$ | Hambre Crítica (Nivel de inanición del propio aldeano) |
| $X_5$ | Fatiga Acumulada (Necesidad física de dormir) |
| $X_6$ | Estrés / Trauma (Impacto por ver muertes o sufrir heridas) |
| $X_7$ | Cantidad General de Aliados en el mapa |
| $X_8$ | Presencia de Niños (Si hay menores desprotegidos cerca) |
| $X_9$ | Presencia de Ancianos/Líderes (Proximidad a figuras de autoridad) |
| $X_{10}$ | Presencia de Pareja/Vínculo (Proximidad a su núcleo afectivo) |
| $X_{11}$ | Madera Disponible (Proximidad y calidad de árboles) |
| $X_{12}$ | Comida Disponible (Arbustos de bayas, hongos o animales cerca) |
| $X_{13}$ | Materiales Avanzados (Piedra, hierro, minerales cerca) |
| $X_{14}$ | Nivel de Almacén (Qué tan vacías están las reservas del pueblo) |
| $X_{15}$ | Llamado al Ritual (Si hay una fogata, danza o rezo activo) |
| $\color{#888}{X_{16}}$ | **Miedo Residual / Memoria Temporal**: Recuerda el peligro reciente aunque la amenaza ya no sea visible. (Satura a 1.0 con el peligro, decae -0.05 por ciclo en paz) |
| $\color{#888}{X_{17}}$ | **Densidad de Cohesión Social / Proximidad**: Proximidad física inmediata de aliados en un radio corto (0.0 = Solo en el bosque, 1.0 = Cuadrilla compacta) |

---

## 🪓 1. El Leñador (La Fuerza de Expansión)

Su cerebro tolera el peligro y el frío moderado. Trabajar en cuadrilla anula casi por completo su pánico.

### Pesos Sinápticos ($W$) para cada Perceptrón de Acción

**🏃 Huir del Peligro ($Y_{panic}$):**  
$$
\big((+0.6 \cdot X_1) + (+0.6 \cdot X_{16})\big) - (+0.8 \cdot X_{17}) + (+0.5 \cdot X_6) + b(-0.2)
$$
> Lógica: El peligro visible ($X_1$) y su memoria ($X_{16}$) lo asustan, pero la cercanía de compañeros ($X_{17}$) resta miedo con mucha fuerza (-0.8).

**🛡️ Defensa de la Aldea:**  
$$
(+0.7 \cdot X_1) + (+0.6 \cdot X_{17}) + (+0.8 \cdot X_8) + b(+0.5)
$$

**🏹 Estrategia de Caza:**  
$$
(+0.4 \cdot X_1) + (+0.6 \cdot X_{12}) + b(+0.2)
$$

**🪵 Talar Madera (Primaria):**  
$$
(-0.2 \cdot X_2) + (+0.9 \cdot X_{11}) + (+0.7 \cdot X_{14}) + b(+0.8)
$$

**🥩 Cocina y Conservación:**  
$$
(-0.8 \cdot X_4) + b(-0.5)
$$

**🎨 Arte y Danza:**  
$$
(+0.3 \cdot X_5) + (+0.4 \cdot X_7) + b(+0.1)
$$

**🛐 Creencias y Rituales:**  
$$
(+0.5 \cdot X_9) + (+0.4 \cdot X_{15}) + b(+0.2)
$$

**🏠 Retorno a la Base:**  
$$
(+0.7 \cdot X_4) + (+0.8 \cdot X_5) + (+0.4 \cdot X_2) + b(+0.1)
$$

---

## 🍳 2. La Cocinera (El Sustento y Cohesión)

Miedosa por naturaleza si está sola. Busca la seguridad del grupo y se vuelve valiente solo para proteger el nido.

**🏃 Huir del Peligro ($Y_{panic}$):**  
$$
\big((+0.9 \cdot X_1) + (+0.9 \cdot X_{16})\big) - (+0.5 \cdot X_{17}) + (+0.5 \cdot X_3) + b(+0.6)
$$
> Lógica: Pánico base muy alto. La presencia de aliados ($X_{17}$) ayuda a calmarla, pero si está sola de noche ($X_3$) u olvida un peligro reciente ($X_{16}$), huirá de inmediato.

**🛡️ Defensa de la Aldea:**  
$$
(+0.3 \cdot X_1) + (+0.9 \cdot X_8) + b(+0.1)
$$

**🏹 Estrategia de Caza:**  
$$
(-0.7 \cdot X_1) + b(-0.6)
$$

**🪵 Talar Madera:**  
$$
(+0.1 \cdot X_{11}) + b(-0.4)
$$

**🥩 Cocinar y Conservar (Primaria):**  
$$
(+0.9 \cdot X_{12}) + (+0.8 \cdot X_{14}) + b(+0.9)
$$

**🎨 Arte y Danza:**  
$$
(+0.6 \cdot X_6) + (+0.7 \cdot X_7) + b(+0.5)
$$

**🛐 Creencias y Rituales:**  
$$
(+0.8 \cdot X_{15}) + b(+0.6)
$$

**🏠 Retorno a la Base:**  
$$
(+0.4 \cdot X_2) + (+0.9 \cdot X_3) + b(+0.8)
$$

---

## 🧒 3. El Niño (El Aprendiz Explorador)

Cerebro hiperreactivo. El miedo residual lo mantiene llorando mucho tiempo. Necesita adultos pegados para no huir.

**🏃 Huir del Peligro ($Y_{panic}$):**  
$$
\big((+1.0 \cdot X_1) + (+1.0 \cdot X_{16})\big) - (+0.9 \cdot X_{17}) + (+0.9 \cdot X_2) + b(+0.9)
$$
> Lógica: El "Efecto Pescado" lo golpearía durísimo, por eso su memoria ($X_{16}$) pesa el máximo absoluto (+1.0). Solo se queda quieto si un adulto está literalmente a su lado (-0.9 en $X_{17}$).

**🛡️ Defensa de la Aldea:**  
$$
(-1.0 \cdot X_1) + b(-0.9)
$$

**🏹 Estrategia de Caza:**  
$$
(+0.3 \cdot X_{12}) + b(-0.2)
$$

**🪵 Talar Madera:**  
$$
(+0.4 \cdot X_7) + b(-0.5)
$$

**🥩 Cocina y Conservación:**  
$$
(+0.5 \cdot X_9) + b(-0.1)
$$

**🎨 Arte y Danza:**  
$$
(-0.2 \cdot X_5) + (+1.0 \cdot X_7) + b(+0.9)
$$

**🛐 Creencias y Rituales:**  
$$
(+0.7 \cdot X_{15}) + b(+0.5)
$$

**🏠 Retorno a la Base:**  
$$
(+0.8 \cdot X_2) + (+0.9 \cdot X_3) + b(+0.6)
$$

---

## 🧓 4. El Anciano (El Chamán de la Sabiduría)

Sabe que no puede correr rápido. La presencia de otros no le quita el miedo racional, pero le da seguridad para resistir.

**🏃 Huir del Peligro ($Y_{panic}$):**  
$$
\big((+0.8 \cdot X_1) + (+0.7 \cdot X_{16})\big) - (+0.4 \cdot X_{17}) + (+0.7 \cdot X_2) + b(+0.4)
$$
> Lógica: Es prudente. Sabe que si se queda solo morirá, así que busca mantener siempre una distancia prudencial del peligro.

**🛡️ Defensa de la Aldea:**  
$$
(+0.4 \cdot X_1) + (+0.8 \cdot X_9) + b(+0.3)
$$

**🏹 Estrategia de Caza:**  
$$
(-0.5 \cdot X_1) + b(-0.4)
$$

**🪵 Talar Madera:**  
$$
(-0.8 \cdot X_5) + b(-0.6)
$$

**🥩 Cocina y Conservación:**  
$$
(+0.6 \cdot X_{12}) + b(+0.5)
$$

**🎨 Arte y Danza:**  
$$
(+0.8 \cdot X_6) + (+0.7 \cdot X_7) + b(+0.6)
$$

**🛐 Creencias y Rituales (Primaria):**  
$$
(+0.9 \cdot X_6) + (+1.0 \cdot X_{14}) + b(+0.9)
$$

**🏠 Retorno a la Base:**  
$$
(+0.8 \cdot X_3) + (+0.9 \cdot X_5) + b(+0.7)
$$

---

## 🛡️ 5. El Guardián (El Escudo Protector)

Su cerebro ignora el pánico. Cuantos más aliados tiene cerca, más se activa su instinto de combate en lugar de huir.

**🏃 Huir del Peligro ($Y_{panic}$):**  
$$
\big((+0.2 \cdot X_1) + (+0.2 \cdot X_{16})\big) - (+0.9 \cdot X_{17}) + (+0.9 \cdot X_4) + b(-0.8)
$$
> Lógica: Sus pesos de miedo son ínfimos. Estar con aliados ($X_{17}$) reduce su pánico a niveles negativos. Solo huye si está famélico ($X_4$) y totalmente superado en número.

**🛡️ Defensa de la Aldea (Primaria):**  
$$
(+1.0 \cdot X_1) + (+0.6 \cdot X_{16}) + (+0.8 \cdot X_6) + (+0.9 \cdot X_8) + b(+0.9)
$$
> Lógica: El peligro visible y el recuerdo del peligro ($X_{16}$) alimentan directamente su neurona de combate.

**🏹 Estrategia de Caza:**  
$$
(+0.8 \cdot X_1) + (+0.6 \cdot X_{12}) + b(+0.5)
$$

**🪵 Talar Madera:**  
$$
b(-0.7)
$$

**🥩 Cocina y Conservación:**  
$$
b(-0.5)
$$

**🎨 Arte y Danza:**  
$$
(+0.5 \cdot X_1) + b(+0.3)
$$

**🛐 Creencias y Rituales:**  
$$
(+0.6 \cdot X_{15}) + b(+0.4)
$$

**🏠 Retorno a la Base:**  
$$
(-0.5 \cdot X_3) + b(-0.3)
$$

---

## 🛠️ 6. El Artesano (La Logística e Ingeniería)

Calculador. Trabajar en equipo le da la tranquilidad necesaria para concentrarse en reparar estructuras bajo presión.

**🏃 Huir del Peligro ($Y_{panic}$):**  
$$
\big((+0.6 \cdot X_1) + (+0.5 \cdot X_{16})\big) - (+0.7 \cdot X_{17}) + b(+0.2)
$$
> Lógica: Es precavido si anda solo por el mapa, pero si la densidad de aliados en la zona es alta, su pánico se bloquea y se queda construyendo.

**🛡️ Defensa de la Aldea:**  
$$
(+0.4 \cdot X_1) + (+0.8 \cdot X_{13}) + b(+0.5)
$$

**🏹 Estrategia de Caza:**  
$$
(+0.5 \cdot X_{13}) + b(+0.3)
$$

**🪵 Talar/Minar Recursos:**  
$$
(+0.6 \cdot X_{11}) + (+0.8 \cdot X_{13}) + b(+0.4)
$$

**🥩 Cocina y Conservación:**  
$$
(+0.4 \cdot X_{14}) + b(+0.2)
$$

**🎨 Arte y Danza:**  
$$
(+0.8 \cdot X_{13}) + b(+0.5)
$$

**🛐 Creencias y Rituales:**  
$$
(+0.5 \cdot X_9) + b(+0.3)
$$

**🏠 Retorno a la Base:**  
$$
(+0.6 \cdot X_3) + (+0.7 \cdot X_{13}) + b(+0.4)
$$

---

## 🎛️ Reglas del Motor de Juego para procesar esta Biblia

1. **Actualización de $X_{16}$ (Miedo Residual):**  
   En cada tick de juego:  
   - Si $X_1 > 0$ (amenaza a la vista) → $X_{16} = X_1$  
   - Si $X_1 == 0$ → $X_{16} = \max(0.0,\, X_{16} - 0.05)$

2. **Cálculo de $X_{17}$ (Proximidad):**  
   Contar cuántos aliados hay en un radio pequeño alrededor del aldeano.  
   Normalizar:  
   - 0 aliados = 0.0  
   - 4 o más aliados = 1.0  
   (interpolación lineal para valores intermedios)

3. **Activación de acciones:**  
   - Para cada acción posible, calcular la suma lineal (con sus pesos y bias).  
   - Pasar esa suma por la **función Sigmoide**:  
     $$
     \sigma(z) = \frac{1}{1 + e^{-z}}
     $$
   - La acción con el **output más cercano a 1.0** toma el control del cuerpo del aldeano en ese frame.

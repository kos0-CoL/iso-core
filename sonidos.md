# 🔊 ISO-CORE: MANIFESTO DE ACTIVOS SONOROS v1.0

Este documento detalla la arquitectura de audio necesaria para la simulación. Todos los archivos deben colocarse en `/public/audio/` siguiendo la estructura jerárquica para que el `AudioManager` pueda localizarlos.

## 📁 Estructura de Directorios
- `/public/audio/ambient/`: Loops de atmósfera de larga duración.
- `/public/audio/sfx/actions/`: Sonidos de tareas (Talar, Minar, etc.).
- `/public/audio/sfx/social/`: Interacciones basadas en el vector $X_{17}$ y $X_{19}$.
- `/public/audio/sfx/combat/`: Ataques, daños y fauna.
- `/public/audio/ui/`: Feedback de menús e interfaz de laboratorio.

---

## 🌲 1. AMBIENTE (Loops Estéreo)
| Archivo | Descripción | Disparador |
|---------|-------------|------------|
| `ambient_forest_day.mp3` | Pájaros, viento en hojas. | Luz > 0.5 |
| `ambient_forest_night.mp3` | Grillos, búhos, viento frío. | Luz < 0.5 |
| `ambient_lab_hum.mp3` | Zumbido eléctrico constante. | Siempre activo (bajo volumen) |

## 🪓 2. ACCIONES DE ALDEANOS (SFX Mono - Espaciales)
| Archivo | Descripción | Tarea Relacionada |
|---------|-------------|-------------------|
| `action_walk_grass.mp3` | Pasos rítmicos sobre tierra. | EXPLORAR / CAMINAR |
| `action_wood_chop.mp3` | Golpe hacha sobre madera. | TALAR |
| `action_stone_mine.mp3` | Impacto metálico sobre roca. | MINAR (Piedras) |
| `action_berry_pick.mp3` | Arbusto agitado, roce de hojas. | RECOLECTAR |
| `action_farming.mp3` | Azada removiendo tierra seca. | SIEMBRA (Autómata) |

## 🗣️ 3. INTERACCIÓN SOCIAL (SFX Mono - Espaciales)
| Archivo | Descripción | Disparador |
|---------|-------------|------------|
| `social_murmur_loop.mp3` | Murmullo de multitud indescifrable.| Cohesión ($X_{17}$) > 0.8 |
| `social_chat_male.mp3` | Voces cortas tipo "Simlish" graves. | Tarea: CHARLAR (Hombres) |
| `social_chat_female.mp3` | Voces cortas agudas y rápidas. | Tarea: CHARLAR (Mujeres) |
| `social_child_giggle.mp3` | Risas pequeñas o balbuceos. | Niños con Felicidad alta |

## 🐺 4. COMBATE Y FAUNA (SFX Mono - Espaciales)
| Archivo | Descripción | Sujeto |
|---------|-------------|------------|
| `animal_wolf_growl.mp3` | Gruñido de advertencia bajo. | Lobo en proximidad |
| `animal_bear_roar.mp3` | Rugido gutural potente. | Oso en ataque |
| `combat_hit_flesh.mp3` | Impacto orgánico seco. | Daño recibido (Aldeano) |
| `combat_shield_block.mp3` | Impacto metálico sordo. | Guardián en DEFENSA |
| `combat_death_cry.mp3` | Exhalación final, eco digital. | Muerte de sujeto |

## 🖥️ 5. INTERFAZ Y LABORATORIO (SFX Estéreo)
| Archivo | Descripción | Evento |
|---------|-------------|------------|
| `ui_select_neon.mp3` | Clic digital con delay cian. | Clic en entidad / Aldeano |
| `ui_menu_open.mp3` | Deslizamiento mecánico (Woosh). | Abrir Guía o Inspector |
| `ui_menu_close.mp3` | Clic de cierre rápido seco. | Cerrar paneles |
| `ui_terminal_type.mp3` | Tecla de terminal antigua. | Escribir en Terminal Divina |
| `ui_pause_on.mp3` | Descenso de tono (Pitch down). | Pausar Simulación (ESC) |
| `ui_alert_critical.mp3` | Pitido de alerta de laboratorio. | Evento Crítico en el Log |

---

## 🛠️ Especificaciones Técnicas
1. **Formato:** `.mp3` (VBR 192kbps) para rendimiento web óptimo.
2. **Mono vs Estéreo:** 
   - Sonidos **MONO** para todo lo que ocurra en el mapa (Acciones, Social, Fauna). Esto permite que el `AudioContext` calcule el Panning (Izquierda/Derecha) y el volumen por distancia.
   - Sonidos **ESTÉREO** para Ambiente y UI.
3. **Volumen Base:** Normalizar a -3dB para evitar distorsión cuando muchos aldeanos actúan a la vez.
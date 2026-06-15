// brain.js
// Contiene los pesos sinápticos de todos los aldeanos según la Biblia Neuronal v2.0

// Función sigmoide (activación)
function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

// Objeto con todos los cerebros
const pesos = {
    leñador: {
        huir: {
            weights: [0.6, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, -0.8],
            bias: -0.2
        },
        defensa: {
            weights: [0.7, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0.6],
            bias: 0.5
        },
        caza: {
            weights: [0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0],
            bias: 0.2
        },
        talar: {
            weights: [0, -0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0.7, 0, 0, 0],
            bias: 0.8
        },
        cocinar: {
            weights: [0, 0, 0, -0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.5
        },
        arte: {
            weights: [0, 0, 0, 0, 0.3, 0, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.1
        },
        ritual: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.4, 0, 0],
            bias: 0.2
        },
        retorno: {
            weights: [0, 0.4, 0, 0.7, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.1
        }
    },
    cocinera: {
        huir: {
            weights: [0.9, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, -0.5],
            bias: 0.6
        },
        defensa: {
            weights: [0.3, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.1
        },
        caza: {
            weights: [-0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.6
        },
        talar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0, 0, 0, 0],
            bias: -0.4
        },
        cocinar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0.8, 0, 0, 0],
            bias: 0.9
        },
        arte: {
            weights: [0, 0, 0, 0, 0, 0.6, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.5
        },
        ritual: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.8, 0, 0],
            bias: 0.6
        },
        retorno: {
            weights: [0, 0.4, 0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.8
        }
    },
    niño: {
        huir: {
            weights: [1.0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.0, -0.9],
            bias: 0.9
        },
        defensa: {
            weights: [-1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.9
        },
        caza: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0],
            bias: -0.2
        },
        talar: {
            weights: [0, 0, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.5
        },
        cocinar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.1
        },
        arte: {
            weights: [0, 0, 0, 0, -0.2, 0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.9
        },
        ritual: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0, 0],
            bias: 0.5
        },
        retorno: {
            weights: [0, 0.8, 0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.6
        }
    },
    anciano: {
        huir: {
            weights: [0.8, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, -0.4],
            bias: 0.4
        },
        defensa: {
            weights: [0.4, 0, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.3
        },
        caza: {
            weights: [-0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.4
        },
        talar: {
            weights: [0, 0, 0, 0, -0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.6
        },
        cocinar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0],
            bias: 0.5
        },
        arte: {
            weights: [0, 0, 0, 0, 0, 0.8, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.6
        },
        ritual: {
            weights: [0, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 1.0, 0, 0, 0],
            bias: 0.9
        },
        retorno: {
            weights: [0, 0, 0.8, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.7
        }
    },
    guardián: {
        huir: {
            weights: [0.2, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, -0.9],
            bias: -0.8
        },
        defensa: {
            weights: [1.0, 0, 0, 0, 0, 0.8, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0.6, 0],
            bias: 0.9
        },
        caza: {
            weights: [0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0],
            bias: 0.5
        },
        talar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.7
        },
        cocinar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.5
        },
        arte: {
            weights: [0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.3
        },
        ritual: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0],
            bias: 0.4
        },
        retorno: {
            weights: [0, 0, -0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: -0.3
        }
    },
    artesano: {
        huir: {
            weights: [0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, -0.7],
            bias: 0.2
        },
        defensa: {
            weights: [0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 0],
            bias: 0.5
        },
        caza: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0],
            bias: 0.3
        },
        talar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0.8, 0, 0, 0, 0],
            bias: 0.4
        },
        cocinar: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0, 0, 0],
            bias: 0.2
        },
        arte: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 0],
            bias: 0.5
        },
        ritual: {
            weights: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0],
            bias: 0.3
        },
        retorno: {
            weights: [0, 0, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0, 0, 0, 0],
            bias: 0.4
        }
    }
};

// Función para calcular la acción de un aldeano
function calcularAccion(tipo, inputs) {
    const cerebro = pesos[tipo];
    if (!cerebro) {
        console.error(`Tipo de aldeano desconocido: ${tipo}`);
        return null;
    }
    let mejorAccion = null;
    let mejorValor = -Infinity;
    for (let [nombreAccion, params] of Object.entries(cerebro)) {
        let suma = params.bias;
        for (let i = 0; i < 17; i++) {
            suma += params.weights[i] * inputs[i];
        }
        let salida = sigmoid(suma);
        if (salida > mejorValor) {
            mejorValor = salida;
            mejorAccion = nombreAccion;
        }
    }
    return mejorAccion;
}

// Exportar (para usar en otros archivos, por ejemplo en index.html)
// Si estás en un entorno de navegador, esto queda disponible globalmente
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pesos, calcularAccion, sigmoid };
} else {
    window.pesos = pesos;
    window.calcularAccion = calcularAccion;
    window.sigmoid = sigmoid;
}
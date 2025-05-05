const Expertos = require('../models/expertos'); // ✅ Importación única al inicio
const { Op } = require('sequelize'); // Asegúrate de importar Op

async function validarExpertos({ jefe_brigada_id, botanico_id, auxiliar_id, coinvestigador_id }) {
    const roles = {
        jefe_brigada_id: 'jefe de brigada',
        botanico_id: 'botanico',
        auxiliar_id: 'auxiliar',
        coinvestigador_id: 'coinvestigador'
    };

    const datos = { jefe_brigada_id, botanico_id, auxiliar_id, coinvestigador_id };
    const ids = Object.values(datos);

    try {
        const expertos = await Expertos.findAll({
            where: { id: ids }
        });

        const expertosMap = expertos.reduce((acc, experto) => {
            acc[experto.id] = experto;
            return acc;
        }, {});

        for (let [clave, rolEsperado] of Object.entries(roles)) {
            const id = datos[clave];
            const experto = expertosMap[id];

            if (!experto) {
                return { ok: false, error: `El experto con ID ${id} no existe.` };
            }

            if (experto.rol.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() !== 
                rolEsperado.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) {
                return { ok: false, error: `El experto con ID ${id} no tiene el rol de ${rolEsperado}.` };
            }
        }

        return { ok: true };
    } catch (error) {
        console.error('Error al validar expertos:', error);
        return { ok: false, error: 'Error en la validación de expertos.' };
    }
}


// Función para normalizar texto (quitar tildes y pasar a minúsculas)
// Función para normalizar texto (quitar tildes y pasar a minúsculas)
// Función para normalizar texto (quitar tildes y pasar a minúsculas)
// Función para normalizar texto (quitar tildes y pasar a minúsculas)
function normalizarTexto(texto) {
    return texto.normalize('NFC').toLowerCase(); // Usamos NFC para normalizar el texto de manera estricta
}

async function obtenerExpertosPorRol(rol) {
    try {
        const rolNormalizado = normalizarTexto(rol);

        // Buscar expertos por rol, ignorando mayúsculas/minúsculas
        const expertos = await Expertos.findAll({
            where: {
                rol: {
                    [Op.iLike]: `%${rolNormalizado}%` // Hacemos la búsqueda insensible a mayúsculas/minúsculas
                }
            }
        });

        // Si no se encuentran expertos, devolvemos un mensaje de error
        if (!expertos || expertos.length === 0) {
            return { ok: false, error: 'No se encontraron expertos con ese rol.' };
        }

        // Devolvemos los expertos encontrados
        const resultados = expertos.map(exp => ({
            id: exp.id,
            nombre: exp.nombre,
            rol: exp.rol
        }));

        return { ok: true, expertos: resultados };
    } catch (error) {
        console.error('Error al obtener expertos por rol:', error);
        return { ok: false, error: 'Hubo un error al obtener los expertos.' };
    }
}

async function obtenerExpertoPorCorreo(email) {
    try {
        const experto = await Expertos.findOne({ where: { email } });

        if (!experto) {
            return { ok: false, error: 'No se encontró un experto con ese correo.' };
        }

        return {
            ok: true,
            experto: {
                id: experto.id,
                nombre: experto.nombre,
                rol: experto.rol,
                email: experto.email
            }
        };
    } catch (error) {
        console.error('Error al buscar experto por correo:', error);
        return { ok: false, error: 'Hubo un error al buscar el experto.' };
    }
}

module.exports = {
    validarExpertos,
    obtenerExpertosPorRol,
    obtenerExpertoPorCorreo // 👈 Asegúrate de exportarlo
};

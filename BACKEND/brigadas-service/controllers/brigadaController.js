const Brigada = require('../models/brigadaModel');  // Asegúrate de que la ruta es correcta
const Expertos = require('../models/expertos');
const db = require('../config/db'); // Asegúrate de que la ruta es correcta
const { Op } = require('sequelize');


// Crear brigada

const createBrigada = async (req, res) => {
    const { nombre, jefe_brigada_id, botanico_id, auxiliar_id, coinvestigador_id } = req.body;

    // 1. Verificar que los expertos existan en la base de datos externa
    const expertosIds = [jefe_brigada_id, botanico_id, auxiliar_id, coinvestigador_id];

    const expertosExistentes = await Expertos.findAll({
        where: { id: { [Op.in]: expertosIds } },
        attributes: ['id', 'rol']
    });

    if (expertosExistentes.length !== 4) {
        return res.status(400).json({ message: 'Uno o más expertos no existen en la base de datos de expertos.' });
    }

    // 2. Validar que cada experto tenga el rol correcto
    const rolesEsperados = {
        [jefe_brigada_id]: 'jefe de brigada',
        [botanico_id]: 'botanico',
        [auxiliar_id]: 'auxiliar',
        [coinvestigador_id]: 'coinvestigador',
    };

    for (const experto of expertosExistentes) {
        const rolEsperado = rolesEsperados[experto.id];
        if (experto.rol.toLowerCase() !== rolEsperado) {
            return res.status(400).json({
                message: `El experto con ID ${experto.id} no tiene el rol esperado. Esperado: ${rolEsperado}, encontrado: ${experto.rol}`
            });
        }
    }

    // 3. Iniciar transacción para crear la brigada
    const t = await db.transaction();

    try {
        const brigada = await Brigada.create({
            nombre,
            jefe_brigada_id,
            botanico_id,
            auxiliar_id,
            coinvestigador_id,
            estado: 'sin asignar',
            fecha_inicio: new Date()
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Brigada creada correctamente.', brigadaId: brigada.id });
    } catch (error) {
        await t.rollback();
        console.error('Error al crear brigada:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

// Obtener todas las brigadas
const getAllBrigadas = async (req, res) => {
    try {
        const brigadas = await Brigada.findAll();
        res.status(200).json(brigadas);
    } catch (error) {
        console.error('Error al obtener brigadas:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

// Obtener brigada por ID sin relación directa en MySQL, consultando expertos en PostgreSQL
const getBrigadaById = async (req, res) => {
    const { id } = req.params;
    try {
      // 1. Obtener la brigada desde MySQL
      const brigada = await Brigada.findByPk(id);
      if (!brigada) {
        return res.status(404).json({ message: 'Brigada no encontrada.' });
      }
      // 2. Extraer IDs de expertos almacenados
      const {
        jefe_brigada_id,
        botanico_id,
        auxiliar_id,
        coinvestigador_id,
        nombre,
        estado
      } = brigada;
      // 3. Consultar cada experto en PostgreSQL
      const [jefe, botanico, auxiliar, coinvestigador] = await Promise.all([
        Expertos.findByPk(jefe_brigada_id, { attributes: ['id', 'nombre', 'rol'] }),
        Expertos.findByPk(botanico_id,     { attributes: ['id', 'nombre', 'rol'] }),
        Expertos.findByPk(auxiliar_id,     { attributes: ['id', 'nombre', 'rol'] }),
        Expertos.findByPk(coinvestigador_id,{ attributes: ['id', 'nombre', 'rol'] })
      ]);
      
      // 4. Construir respuesta combinada
      const resultado = {
        id: brigada.id,
        nombre,
        estado,
        jefe_brigada: jefe || null,
        botanico:    botanico || null,
        auxiliar:    auxiliar || null,
        coinvestigador: coinvestigador || null
      };
      return res.status(200).json(resultado);
    } catch (error) {
      console.error('Error al obtener brigada:', error);
      return res.status(500).json({ message: 'Error del servidor.' });
    }
  };

// Actualizar estado de brigada
const updateBrigadaEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'en_curso', 'finalizada'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ message: 'Estado inválido.' });
    }

    try {
        const [updated] = await Brigada.update({ estado }, { where: { id } });
        if (!updated) {
            return res.status(404).json({ message: 'Brigada no encontrada.' });
        }
        res.status(200).json({ message: 'Estado de brigada actualizado.' });
    } catch (error) {
        console.error('Error al actualizar estado de brigada:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

module.exports = {
    createBrigada,
    getAllBrigadas,
    getBrigadaById,
    updateBrigadaEstado
};

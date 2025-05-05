const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });

        const token = jwt.sign({ id: newUser.id, username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: err.message });
    }
};

const getUsers = async (_req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    }
};

const getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, password, role } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

        user.username = username || user.username;
        user.password = hashedPassword;
        user.role = role || user.role;

        await user.save();

        res.status(200).json({ message: 'Usuario actualizado', user });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
    }
};

const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        await user.destroy();
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
};

module.exports = {
    register,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};

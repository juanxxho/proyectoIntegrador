const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);

router.put('/:userId', verifyToken, verifyRole(['administrador']), userController.updateUser);
router.delete('/:userId', verifyToken, verifyRole(['administrador']), userController.deleteUser);

module.exports = router;

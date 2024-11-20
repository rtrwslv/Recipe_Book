const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.delete('/:id', userController.deleteUser);
router.get('/getAll', userController.getAllUsers);
router.put('/:id/makeAdmin', userController.makeAdmin);
router.put('/:id/makeModerator', userController.makeModerator);

module.exports = router;

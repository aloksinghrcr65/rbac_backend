const { Router } = require('express');
const router = Router();

const { registerUser } = require('../controllers/auth/authController');
const { registerValidator } = require('../helper/validator');

router.post('/register', registerValidator, registerUser);

module.exports = router;
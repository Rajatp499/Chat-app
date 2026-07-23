const express = require('express');
const router = express.Router();
const { register, login, logout, send_otp, checkAuth } = require('../controllers/authController');
const auth = require('../middleware/auth')

router.post('/register', register);
router.post('/login', login)
router.get("/logout", logout)
router.post('/send-otp', send_otp)
router.get('/checkAuth', checkAuth)


module.exports = router;

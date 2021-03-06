/*
    Ruta: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, getRefreshToken } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJwt } = require('../middlewares/validarJWT');

const router = Router();

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
],
 login);
 
 router.post('/google', [
    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    validarCampos
],
 googleSignIn);

 router.get('/refresh-token', [
    validarJwt
],
 getRefreshToken);

module.exports = router;
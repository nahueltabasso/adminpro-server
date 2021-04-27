/*
    Ruta: /api/usuario
*/

const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarioController');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJwt, validarAdminRole, validarAdminRoleOrUsuarioLogueado } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', [validarJwt, validarAdminRole], getUsuarios);
router.post('/', [      // El segundo parametro son los middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('password', 'La password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,      // Custom Middleware
], crearUsuario);
router.put('/:id', [      // El segundo parametro son los middlewares
    [validarJwt,
    validarAdminRoleOrUsuarioLogueado],
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos,      // Custom Middleware
], actualizarUsuario);
// router.put('/actualiza-perfil/:id', [      // El segundo parametro son los middlewares
//     [validarJwt,
//     validarAdminRole],
//     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
//     check('apellido', 'El apellido es obligatorio').not().isEmpty(),
//     check('email', 'El email es obligatorio').isEmail(),
//     check('role', 'El rol es obligatorio').not().isEmpty(),
//     validarCampos,      // Custom Middleware
// ], actualizarUsuario)
router.delete('/:id', [validarJwt, validarAdminRole], borrarUsuario);

module.exports = router;
/*
    Ruta: /api/medico
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, addMedico, deleteMedico, updateMedico } = require('../controllers/medicoController');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJwt } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', validarJwt, getMedicos);
router.post('/', [ 
    validarJwt,     // El segundo parametro son los middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('hospital', 'El Hospital es obligatorio').not().isEmpty(),
    check('hospital', 'El Hospital ID debe ser valido').isMongoId(),
    validarCampos,      // Custom Middleware
], addMedico);
router.put('/:id', [      // El segundo parametro son los middlewares
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('hospital', 'El Hospital ID debe ser valido').isMongoId(),
    validarCampos,      // Custom Middleware
], updateMedico);
router.delete('/:id', validarJwt, deleteMedico);

module.exports = router;
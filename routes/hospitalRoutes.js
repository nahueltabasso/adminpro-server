/*
    Ruta: /api/hospital
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, crearHospital, deleteHospital, updateHospital, getHospitalesForCombo } = require('../controllers/hospitalController');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJwt } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', validarJwt, getHospitales);
router.post('/', [  
    validarJwt,    // El segundo parametro son los middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,      // Custom Middleware
], crearHospital);
router.put('/:id', [      // El segundo parametro son los middlewares
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,      // Custom Middleware
], updateHospital);
router.delete('/:id', validarJwt, deleteHospital);
router.get('/hospitales-combo', validarJwt, getHospitalesForCombo);

module.exports = router;
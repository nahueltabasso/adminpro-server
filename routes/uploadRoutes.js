/*
    Ruta: /api/uploads/
*/

const { Router } = require('express');
const { fileUpload, viewImage } = require('../controllers/uploadController');
const expressFileUpload = require('express-fileupload');
const { validarJwt } = require('../middlewares/validarJWT');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJwt, fileUpload);
router.get('/:tipo/:foto', validarJwt, viewImage);

module.exports = router;

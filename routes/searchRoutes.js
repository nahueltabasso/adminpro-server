/*
    Ruta: /api/todo/
*/

const { Router } = require('express');
const { searchTodo, searchInSpecificCollection } = require('../controllers/searchController');
const { validarJwt } = require('../middlewares/validarJWT');

const router = Router();

router.get('/:busqueda', validarJwt, searchTodo);
router.get('/collecion/:tabla/:busqueda', validarJwt, searchInSpecificCollection);

module.exports = router;

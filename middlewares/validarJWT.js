const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJwt = (request, response, next) => {
    // Leer token
    const token = request.header('Authorization');
    if (!token || !token === undefined) {
        return response.status(401).json({
            ok: false,
            msg: 'Acceso Denegado!'
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.uid = uid;
    } catch (error) {
        console.log(error);
        response.status(401).json({
            ok: false,
            msg: 'Token invalido!'
        });
    }
    next();
}

const validarAdminRole = async(request, response, next) => {

    const uid = request.uid
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            response.status(404).json({
                ok: false,
                msg: 'Usuario no existe!'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            response.status(401).json({
                ok: false,
                msg: 'Acceso denegado!'
            }); 
        }
        next();
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte al administrador!'
        });
    }
}

const validarAdminRoleOrUsuarioLogueado = async(request, response, next) => {

    const uid = request.uid
    const id = request.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            response.status(404).json({
                ok: false,
                msg: 'Usuario no existe!'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE' && uid !== id) {
            response.status(401).json({
                ok: false,
                msg: 'Acceso denegado!'
            }); 
        }
        next();
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte al administrador!'
        });
    }
}

module.exports = {
    validarJwt,
    validarAdminRole,
    validarAdminRoleOrUsuarioLogueado
} 
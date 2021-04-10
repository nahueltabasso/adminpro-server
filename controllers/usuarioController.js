const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const getUsuarios = async(request, response) => {
    const desde = Number(request.query.desde) || 0;
    const totalPorPagina = Number(request.params.totalPorPagina) || 5;

    // Recuperamos los usuarios de la BD
    const [ usuarios, totalRegistros ] = await Promise.all([
        Usuario.find({}, 'nombre apellido email role google img')
                .skip(desde)    // Ignora los registros anteriores al parametro "desde";
                .limit(totalPorPagina),

        Usuario.countDocuments()
    ]);

    response.json({
        ok: true,
        usuarios: usuarios,
        totalRegistros: totalRegistros
    });
}

const crearUsuario = async(request, res = response) => {
    console.log(request.body);
    const { email, password } = request.body;

    try {
        const existeUsuario = await Usuario.findOne({ email: email });
        if (existeUsuario) {
            console.log('El usuario ya existe en la base de datos!');
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe en la base de datos!'
            });
        }

        const usuario = new Usuario(request.body);
        // Encriptar la password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Persistimos el objeto en la BD
        await usuario.save();
        console.log('Usuario registrado con ID ' + usuario.id);
        
        // Generamos el JWT (JsonWebToken)
        const jwtToken = await generateJWT(usuario.id);

        res.json({
            ok: true,
            usuario: usuario,
            token: jwtToken
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        });
    }

}

const actualizarUsuario = async(request, res = response) => {
    const uid = request.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        // Validamos si existe el usuario
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario!'
            })
        }

        const { password, google, email, ...campos } = request.body;
        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email: email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email!'
                });
            }
        }
        
        // delete campos.password;
        // delete campos.google;
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        });
    }
}

const borrarUsuario = async(request, res = response) => {
    const uid = request.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario!'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        
        res.json({
            ok: true,
            msg: 'Usuario eliminado!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
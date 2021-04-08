const { response } = require('express');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const login = async(request, res = response) => {
    const { email, password } = request.body;

    try {
        // Validamos que el usuario exista
        const usuarioDB = await Usuario.findOne({ email: email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email o contraseña incorrectos!'
            });
        }

        // Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrectos!'
            });
        }

        // Generamos el JWT (JsonWebToken)
        const jwtToken = await generateJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token: jwtToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Consulte con el administrador!'
        });
    }
}

module.exports = {
    login,
}
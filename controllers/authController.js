const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/googleVerify');

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

const googleSignIn = async(request, res = response) => {
    // Recuperar el token de Google 
    const googleToken = request.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        // Validamos si existe un usuario con el email
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        let nameCortado = name.split(' ');      // Sera un arreglo de 3 posiciones, la primera el nombre y la ultima el apellido
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: nameCortado[0],
                apellido: nameCortado[2],
                password: '@@@',
                email: email,
                img: picture,
                google: true
            });
        } else {
            // Existe el usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardamos en la base de datos
        await usuario.save();

        // Generamos el JWT (JsonWebToken)
        const jwtToken = await generateJWT(usuario.id);        

        res.status(200).json({
            ok: true,
            token: jwtToken
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no valido!'
        });
    }
}

const getRefreshToken = async(request, res = response) => {
    const uid = request.uid;
 
    // Generamos el JWT (JsonWebToken)
    const jwtToken = await generateJWT(uid);
    
    res.status(200).json({
        ok: true,
        token: jwtToken,
    });
}

module.exports = {
    login,
    googleSignIn,
    getRefreshToken
}
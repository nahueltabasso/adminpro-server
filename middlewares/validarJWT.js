const jwt = require('jsonwebtoken');

const validarJwt = (request, response, next) => {
    // Leer token
    const token = request.header('Authorization');
    console.log(token);
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

module.exports = {
    validarJwt
}
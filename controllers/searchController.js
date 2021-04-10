const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const searchTodo = async(request, res = response) => {
    // Obtenemos el parametro en el path de request
    const busqueda = request.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        await Usuario.find({ nombre: regex }),
        await Medico.find({ nombre: regex }),
        await Hospital.find({ nombre: regex }),
    ]);

    res.status(200).json({
        ok: true,
        usuarios: usuarios,
        medicos: medicos,
        hospitales: hospitales
    });
}

const searchInSpecificCollection = async(request, res = response) => {
    // Obtenemos el parametro en el path de request
    const collecion = request.params.tabla
    const busqueda = request.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre apellido img')
                                .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                .populate('usuario', 'nombre apellido img');
        break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'Ha ocurrido un erro. Consulte al administrador!'
            });
    }

    res.status(200).json({
        ok: true,
        resultados: data
    });
}

module.exports = {
    searchTodo,
    searchInSpecificCollection
}
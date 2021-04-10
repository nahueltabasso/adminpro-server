const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async(request, res = response) => {
    const hospitales = await Hospital.find()
                            .populate('usuario', 'nombre apellido email img');

    res.status(200).json({
        ok: true, 
        hospitales: hospitales
    });
}

const crearHospital = async(request, res = response) => {
    console.log(request.body);
    const hospital = new Hospital(request.body);
    const idUsuario = request.uid;
    hospital.usuario = idUsuario;

    try {
        const hospitalDB = await hospital.save();

        res.status(201).json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Consulte al Administrador'
        });
    }
}

const updateHospital = (request, res = response) => {

}

const deleteHospital = (request, res = response) => {

}


module.exports = {
    getHospitales,
    crearHospital,
    updateHospital,
    deleteHospital
}
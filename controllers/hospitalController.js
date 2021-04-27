const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async(request, res = response) => {
    const desde = Number(request.query.desde) || 0;
    const totalPorPagina = Number(request.params.totalPorPagina) || 5;

    const [ hospitales, totalRegistros ] = await Promise.all([
        Hospital.find()
        .skip(desde)
        .limit(totalPorPagina)
        .populate('usuario', 'nombre apellido email img'),

        Hospital.countDocuments()
    ]);

    res.status(200).json({
        ok: true, 
        hospitales: hospitales,
        totalRegistros: totalRegistros
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

const updateHospital = async(request, res = response) => {
    const idHospital = request.params.id;

    try {
        let hospitalDB = await Hospital.findById(idHospital);
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe en la base de datos'
            });
        }

        hospitalDB.nombre = request.body.nombre;
        hospitalDB = await Hospital.findByIdAndUpdate(idHospital, hospitalDB, { new: true });

        res.status(201).json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte con el administrador!'
        });
    }
}

const deleteHospital = async(request, res = response) => {
    const idHospital = request.params.id;

    try {
        const hospitalDB = await Hospital.findById(idHospital);
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe en la base de datos'
            });
        }

        await Hospital.findByIdAndDelete(idHospital);
        res.status(204).json({
            ok: true,
            msg: 'Hospital eliminado con exito!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte con el administrador!'
        });
    }

}

const getHospitalesForCombo = async(request, res = response) => {
    try {
        const hospitales = await Hospital.find();
        
        res.status(200).json({
            ok: true,
            hospitales: hospitales
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte con el administrador!'
        });
    }
}



module.exports = {
    getHospitales,
    crearHospital,
    updateHospital,
    deleteHospital,
    getHospitalesForCombo
}
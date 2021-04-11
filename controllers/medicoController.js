const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async(request, res = response) => {
    const medicos = await Medico.find()
                            .populate('usuario', 'nombre apellido email img')
                            .populate('hospital', 'nombre img');

    res.status(200).json({
        ok: true,
        medicos: medicos
    });
}

const addMedico = async(request, res = response) => {
    console.log(request.body);
    const medico = new Medico(request.body);
    const idUsuario = request.uid;
    medico.usuario = idUsuario;

    try {
        const medicoDB = await medico.save();

        res.status(201).json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Consulte al Administrador'
        });
    }
}

const updateMedico = async(request, res = response) => {
    const idMedico = request.params.id;

    try {
        let medicoDB = await Medico.findById(idMedico);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe en la base de datos'
            });
        }

        medicoDB.nombre = request.body.nombre;
        medicoDB.apellido = request.body.apellido;
        medicoDB = await Medico.findByIdAndUpdate(idMedico, medicoDB, { new: true });

        res.status(201).json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte con el administrador!'
        });
    }
}

const deleteMedico = async(request, res = response) => {
    const idMedico = request.params.id;

    try {
        const medicoDB = await Medico.findById(idMedico);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe en la base de datos'
            });
        }

        await Medico.findByIdAndDelete(idMedico);
        res.status(204).json({
            ok: true,
            msg: 'Medico eliminado con exito!'
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
    getMedicos,
    addMedico,
    updateMedico,
    deleteMedico
}
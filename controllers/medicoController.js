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

const updateMedico = (request, res = response) => {

}

const deleteMedico = (request, res = response) => {

}


module.exports = {
    getMedicos,
    addMedico,
    updateMedico,
    deleteMedico
}
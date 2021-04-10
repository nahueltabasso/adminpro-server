const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const fs = require('fs');   // FileSystem permite leer las carpetas y los archivos

const actualizarArchivo = async(tipo, id, nombreArchivo) => {
    let oldPath = "";
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log("No existe el Medico en la base de datos!");
                return false;
            }
            oldPath = `./uploads/medicos/${medico.img}`;
            borrarImagen(oldPath);
            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log("No existe el Hospital en la base de datos!");
                return false;
            }
            oldPath = `./uploads/hospitales/${hospital.img}`;
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            console.log(usuario);
            if (!usuario) {
                console.log("No existe el Usuario en la base de datos!");
                return false;
            }
            oldPath = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(oldPath);
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;

        default:

    }
}

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // Borramos la imagen anterior
        fs.unlinkSync(path);     
    }

}

module.exports = {
    actualizarArchivo
}
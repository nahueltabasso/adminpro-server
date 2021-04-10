const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarArchivo } = require('../helpers/actualizarArchivo');
const path = require('path');
const fs = require('fs');   // FileSystem permite leer las carpetas y los archivos

const fileUpload = async(request, res = response) => {
    const tipo = request.params.tipo;
    const id = request.params.id;
    
    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte con el administrador!'
        });
    }

    // Validar que exista un archivo en el request
    if (!request.files || Object.keys(request.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se encontro ningun archivo'
        });
    }

    // Procesar la imagen
    const file = request.files.imagen;
    console.log(file);

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length -1];

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida!'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
    console.log(nombreArchivo);

    // Path para almacenar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;
    console.log(path);

    // Mover la imagen hacia el directorio
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Ocurrio un error. Consulte con el administrador'
            });
        }

        // Actualizamos la base de datos
        actualizarArchivo(tipo, id, nombreArchivo);

        res.status(201).json({
            ok: true,
            msg: 'Archivo subido!',
            nombreArchivo: nombreArchivo
        });
    });

}

const viewImage = async(request, res = response) => {
    const tipo = request.params.tipo;
    const foto = request.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.status(200).sendFile(pathImg);
    } else {
        const pathImgDefault = path.join(__dirname, `../uploads/no-img.jpg`);
        res.status(200).sendFile(pathImgDefault);
    }
    
    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error. Consulte con el administrador!'
        });
    }
}

module.exports = {
    fileUpload,
    viewImage
}
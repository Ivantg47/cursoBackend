const fs = require('fs')

const archivo = './ejemploPro.txt'

const operacionAsync = async() => {

    await fs.promises.writeFile(archivo, 'SSaludos universo!!')
    const contenido = await fs.promises.readFile(archivo, 'utf-8')
    console.log('CONTENIDO', contenido);

    await fs.promises.appendFile(archivo, 'arriva el imperio')

    const contenidoN = await fs.promises.readFile(archivo, 'utf-8')
    console.log('NUEVO CONTENIDO', contenido);

}

operacionAsync()
const fs = require('fs')

//fs.writeFileSync('./ejemplo.txt', "Hola mundo!!")

const archivo = './ejemplo.txt'

if (fs.existsSync(archivo)) {
    const contenido = fs.readFileSync(archivo, 'utf-8')
    console.log(contenido);

    fs.appendFileSync(archivo, "se agrego texto\n")//agrega contenido
    console.log(contenido);
    //fs.unlinkSync(archivo)//borra

} else {
    console.log('No se encontro el archivo');
}



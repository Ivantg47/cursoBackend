const fs = require('fs')

const archivo = './ejemplo.txt'

fs.writeFile(archivo, 'Adios mundo', (error) => {
    if (error) return console.log('Ocurrio error')
    
    console.log('guardo');

    fs.readFile(archivo, 'utf-8', (error, contenido) => {
        if(error) return console.log('Error al leer');

        console.log('CONTENIDO', contenido);

        fs.appendFile(archivo, 'destruir', (error) => {
            if(error) return console.log('error añadir contenido');

            console.log('añadio contenido');

            fs.unlink(archivo, (error) => {
                if(error) return console.log('no se pudo eliminar');

                console.log('elimino archivo');
            })
        })
    })
    
})
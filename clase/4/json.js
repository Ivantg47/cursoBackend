const fs = require('fs')

const BD = {
    nombre: "Pepe",
    apellido: "Pecas",
    anio: 25
}

const json = JSON.stringify(BD)

fs.promises.writeFile('BD.json', json)
    .then(() => {
        console.log('BD salvado');
    })
    .catch(e => {
        console.log('error', e);
    })

fs.promises.readFile('BD.json', 'utf-8')
    .then(contenido => {
        const json2 = JSON.parse(contenido)
        console.log(json2);
    })
    .catch(e => {
        console.log('error', e);
    })    

    
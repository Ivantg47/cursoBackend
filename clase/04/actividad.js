const fs = require('fs')



// fs.promises.writeFile('package.json', json)
//     .then(() => {
//         console.log('BD salvado');
//     })
//     .catch(e => {
//         console.log('error', e);
//     })

fs.promises.readFile('package.json', 'utf-8')
    .then(contenido => {
        const json2 = JSON.parse(contenido)
        const json3 = JSON.stringify(contenido)
        console.log(json2);
        console.log(json3);
    })
    .catch(e => {
        console.log('error', e);
    }) 

    const info = {
        contenidoStr: '',
        contenidoObj: '',
        size: 0
    }
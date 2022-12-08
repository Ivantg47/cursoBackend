const express = require('express')

const app = express()
app.use(express.urlencoded(extended: true))

app.get('/saludo', (request, response) => {
    response.send('<h1>Hola mundo!!!</h1>')
})

app.get('/bienvenida', (request, response) => {
    response.send('<h1 style="color:blue">Hola mundo!!!</h1>')
})

const obj = {
    nombre: 'pepe',
    apellido: 'pecas',
    anno: 100
}

app.get('/usuario', (request, response) => {
    response.send(obj)
})

app.listen(8080, () => {
    console.log('Puerto 8080 en espera');
})
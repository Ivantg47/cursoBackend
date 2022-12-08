import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

const app = express()

app.engine('handlebars', handlebars.engine())   //inicia motor
app.set('views', __dirname + '/views')          //indica carpeta de vistas
app.set('view engine', 'handlebars')           //indica motor de renderizado

app.get('/', (req, res) => {
    const testUser = {
        name: 'pepe',
        last: 'pecas'
    }

    res.render('index', testUser)
})

app.get('/user', (req, res) => {
    const users = [{
        name: 'pepe',
        last: 'pecas',
        age: 29,
        email: 'pepe@correo.com',
        phone: 1234
    },
    {
        name: 'paco',
        last: 'lopes',
        age: 299,
        email: 'paco@correo.com',
        phone: 123456
    },
    {
        name: 'lola',
        last: 'gato',
        age: 19,
        email: 'lola@correo.com',
        phone: 987654
    }]

    const idxRand = Math.floor(Math.random() * 2)
    const user = users[idxRand]

    res.render('user', user)
})
const server = app.listen(8080, () => console.log("Server running..."))


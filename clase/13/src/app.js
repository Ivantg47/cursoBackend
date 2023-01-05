import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import pokeRouter from './routes/pokeapi.router.js'
import pokeViews from './routes/pokeviews.router.js'
import mongoose from 'mongoose'


const app = express()

//utilizar el post con json
app.use(express.json())

//configura motor de plantilla
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//configura carpeta publica
app.use(express.static(__dirname + '/public'))

//configuracion de rutas
//ruta vistas
app.use('/pokemon', pokeViews)
//ruta api
app.use('/api/pokemon', pokeRouter)

const MONGO_URL = 'mongodb+srv://admin:admin@cluster0.gaqvdp2.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL, error => {
    if (error) {
        console.error('No se pudo conectar a la BD');
        return
    }
    console.log('BD conectada');
    app.listen(8080, () => console.log('Listening...'))
})

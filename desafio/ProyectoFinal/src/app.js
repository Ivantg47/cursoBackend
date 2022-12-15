import express from 'express'
import prodR from './router/product.router.js'
import cartR from './router/cart.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.router.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//const server = app.listen(8080, () => console.log("Server running..."))

app.use('/api/product', prodR)
app.use('/api/carts', cartR)
app.use('/', viewsRouter)
//app.use('/', (req, res) => res.send('HOME'))

const httpServer = app.listen(8080, () => console.log('Listening...'))
const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
    //console.log('hola');
})



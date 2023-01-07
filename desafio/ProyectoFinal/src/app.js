import express from 'express'
// import prodR from './router/product.router.js'
// import cartR from './router/cart.router.js'
import prodR from './router/product.routerBD.js'
import cartR from './router/cart.routerBD.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.router.js'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/product', prodR)
app.use('/api/carts', cartR)
app.use('/', viewsRouter)

const MONGO_URL = 'mongodb+srv://admin:admin@cluster0.gaqvdp2.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL, error => {
    if (error) {
        console.error('No conect', error);
        process.exit()
    }
})

const httpServer = app.listen(8080, () => console.log('Server running...'))
const io = new Server(httpServer)

let messages = []

// io.on('connection', async socket => {
//     console.log(`Nuevo cliente id: ${socket.id}`);

//     io.sockets.emit('lista', await producto.getProducts())
//     const prod = await producto.getProductById()
//     socket.on('updateList', async prod => {
//         io.sockets.emit('lista', await producto.getProducts())
//     })

//     socket.on('message', data => {
//         messages.push(data)

//         io.emit('messageLogs', messages)
//     })

//     socket.on('authenticated', user => {
//         socket.broadcast.emit('allChat', user)

//         socket.emit('mensaje', messages)
//     })
   
// })



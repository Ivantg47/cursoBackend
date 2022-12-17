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

app.use('/api/product', prodR)
app.use('/api/carts', cartR)
app.use('/', viewsRouter)

const httpServer = app.listen(8080, () => console.log('Server running...'))
const io = new Server(httpServer)

let messages = []

io.on('connection', socket => {
    console.log('Nuevo cliente');

    socket.on('addProduct', prod => {
        console.log('Nuevo producto servidor: ');
    //     const list = prodR.get('/')
    //     io.emit('realTimeList', list)
    })

    socket.on('deletProduct', id => {
        console.log('Borrar producto: ', id);
    })

    socket.on('message', data => {
        messages.push(data)

        io.emit('messageLogs', messages)
    })

    socket.on('authenticated', user => {
        socket.broadcast.emit('allChat', user)

        socket.emit('mensaje', messages)
    })
   
})



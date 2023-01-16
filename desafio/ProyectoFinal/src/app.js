import express from 'express'
// import prodR from './router/file_router/product.router.js'
// import cartR from './router/file_router/cart.router.js'
import prodR from './router/BD_router/product.routerBD.js'
import cartR from './router/BD_router/cart.routerBD.js'
import chatR from './router/BD_router/chat.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.router.js'
import mongoose from 'mongoose'
import producto from './dao/bd_manager/productManagerBD.js'
import { mensajes } from './dao/bd_manager/chatManagerBD.js'

const app = express()

const MONGO_URL = 'mongodb+srv://admin:admin@cluster0.gaqvdp2.mongodb.net/?retryWrites=true&w=majority'
const BD = {dbname: 'ecommerce'}
mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL, BD,  error => {
    if (error) {
        console.error('No conect', error);
        process.exit()
    }
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/product', prodR)
app.use('/api/carts', cartR)
app.use('/api/chat', chatR)
app.use('/', viewsRouter)

const httpServer = app.listen(8080, () => console.log('Server running...'))
const io = new Server(httpServer)

app.set("io", io);

io.on('connection', async socket => {
    console.log(`Nuevo cliente id: ${socket.id}`);

    io.sockets.emit('lista', await producto.getProducts({},{}))
    
    socket.on('updateList', async prod => {
        io.sockets.emit('lista', await producto.getProducts({},{}))
    })

    socket.on('authenticated', async user => {
        socket.broadcast.emit('allChat', user)
        //console.log(await mensajes.getMessages());
        socket.emit('messageLogs',await mensajes.getMessages())
    })

})



import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.router.js'

const app = express()

const httpServer = app.listen(8080, () => console.log('Listening...'))
const socketServer = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter)

socketServer.on('connection', socket => {
    console.log('Nuevo cliente');

    socket.on('message', data => {
        console.log('frome cliente: ', data);
    })

    socket.emit('para_uno', 'esto llega a un soket')

    socket.broadcast.emit('para_todos', 'llega a todos')

    socketServer.emit('todos', 'para todos')
})

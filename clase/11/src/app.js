import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.router.js'

const app = express()

const httpServer = app.listen(8080, () => console.log('Listening...'))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter)

let messages = []

io.on('connection', socket => {
    console.log('New client connected ');

    socket.on('message', data => {
        messages.push(data)

        io.emit('messageLogs', messages)
    })

    socket.on('authenticated', user => {
        socket.broadcast.emit('allChat', user)
    })

    socket.on('mensaje', mensage => {
        console.log('hola');
        socket.emit('mLogs', mensage)
    })
})


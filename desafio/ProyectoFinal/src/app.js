import express from 'express'
// import prodR from './router/file_router/product.router.js'
// import cartR from './router/file_router/cart.router.js'
// import prodR from './router/BD_router/product.routerBD.js'
// import cartR from './router/BD_router/cart.routerBD.js'
// import chatR from './router/BD_router/chat.router.js'
// import sessionR from './router/BD_router/session.router.js'
import __dirname, { passportCall } from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views/views.router.js'
import mongoose from 'mongoose'
import producto from './dao/bd_manager/mogo/productManagerBD.js'
import { mensajes } from './dao/bd_manager/mogo/chatManagerBD.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import cookieParser from "cookie-parser";
import config from './config/config.js'
import router from './router/index.js'

const app = express()

app.use(cookieParser(config.COOKIE_SECRET))

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGO_URL, {dbname: config.BD_NAME},  error => {
    if (error) {
        console.error('No connect', error);
        process.exit()
    }
})

app.use(session({
    secret: config.SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        dbName: config.BD_NAME,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
// app.use(cors({origin: , methods: ["PUT", "POST", "GET", "DELETE"]}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// app.use('/api/product', prodR)
// app.use('/api/carts', passportCall('jwt'), cartR)
// app.use('/session', sessionR)
// app.use('/api/chat', chatR)
// app.use('/', viewsRouter)
app.use('/', router)

const httpServer = app.listen(config.PORT, () => console.log('Server running...'))
const io = new Server(httpServer)

app.set("io", io);

io.on('connection', async socket => {
    //console.log(`Nuevo cliente id: ${socket.id}`);
    io.sockets.emit('lista', await producto.getProducts({},{}))
    
    socket.on('updateList', async prod => {
        io.sockets.emit('lista', await producto.getProducts({},{}))
    })

    socket.on('authenticated', async user => {
        
        socket.broadcast.emit('allChat', user)
        socket.emit('messageLogs',await mensajes.getMessages())
    })

})



import express from 'express'
// import prodR from './router/file_router/product.router.js'
// import cartR from './router/file_router/cart.router.js'
// import prodR from './router/BD_router/product.routerBD.js'
// import cartR from './router/BD_router/cart.routerBD.js'
// import chatR from './router/BD_router/chat.router.js'
// import sessionR from './router/BD_router/session.router.js'
// import viewsRouter from './router/views/views.router.js'
// import producto from './dao/bd_manager/mogo/productManagerBD.js'
// import { mensajes } from './dao/bd_manager/mogo/chat_mongoManager.js'
import __dirname, { passportCall } from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import cookieParser from "cookie-parser";
import config from './config/config.js'
import router from './router/index_router.js'
import { ChatService, ProductService } from './repositories/index_repository.js'
import errorHandler from './middlewares/errors/errorHandler.js'
import logger, { addLogger } from './utils/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import  swaggerUiExpress from 'swagger-ui-express'

const app = express()

app.use(addLogger)
app.use(cookieParser(config.COOKIE_SECRET))

const  swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion ecommers",
            description: "documentacion del sitio de compras"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
console.log(`${__dirname}/docs/**/*.yaml`);
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// mongoose.set('strictQuery', false)
// mongoose.connect(config.MONGO_URL, {dbname: config.BD_NAME},  error => {
//     if (error) {
//         console.error('No connect', error);
//         process.exit()
//     }
// })

// app.use(session({
//     secret: config.SESSION_SECRET,
//     store: MongoStore.create({
//         mongoUrl: config.MONGO_URL,
//         dbName: config.BD_NAME,
//         mongoOptions: {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         },
//         ttl: 100
//     }),
//     resave: true,
//     saveUninitialized: true
// }))

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
app.use(errorHandler)

const httpServer = app.listen(config.PORT, () => console.log('Server running...'))
const io = new Server(httpServer)

app.set("io", io);

io.on('connection', async socket => {
    //console.log(`Nuevo cliente id: ${socket.id}`);
    io.sockets.emit('lista', await ProductService.getProducts())
    
    socket.on('updateList', async prod => {
        io.sockets.emit('lista', await ProductService.getProducts())
    })

    socket.on('authenticated', async user => {
        
        socket.broadcast.emit('allChat', user)
        socket.emit('messageLogs',await ChatService.getMessages())
    })

})

app.get('/loggerTest', (req, res) => {
    req.logger.fatal('FATAL ERROR')
    req.logger.error('error on DB')
    req.logger.warning('Dont worry, it\'s just warning')
    req.logger.info('Se llamo a la pagian principal')
    req.logger.http('Http message')
    req.logger.debug('1 + 1 === 2 ???')

    res.send({message: 'Logger testing!!'})
})



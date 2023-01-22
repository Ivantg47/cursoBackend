import express from 'express'
import __dirname from './utils.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
//import FileStore from 'session-file-store'
//import handlebars from 'express-handlebars'
//import { Server } from 'socket.io'
//import viewsRouter from './routes/views.router.js'

const url = 'mongodb+srv://admin:admin@cluster0.gaqvdp2.mongodb.net/?retryWrites=true&w=majority'

const app = express()

app.use(session({
    store: MongoStore.create({
        mongoUrl: url,
        dbName: "sessions",
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 15
    }),
    secret: '123456',
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => res.send('ok'))

function auth(req, res, next) {
    if(req.session?.user) return next()

    return res.status(401).send('Auth Error')
}
app.get('/login', (req, res) => {
    const { username } = req.query

    res.session.user = username

    res.send('Login Success')
})

app.get('/logout', (req, res) => req.session.destroy(err => res.send(err)))
app.get('/private', auth, (req, res) => res.send('Private Page'))
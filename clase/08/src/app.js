import express from 'express'
import usersRouter from './routers/users.router.js' 

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/hola', express.static('public'))
const server = app.listen(8080)

app.use('/api/users', usersRouter)
app.use('/', (req, res) => res.send('HOME'))
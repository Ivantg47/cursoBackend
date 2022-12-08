const express = require('express')
const prodR = require('./router/product.router')
const cartR = require('./router/cart.router')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//app.use('/hola', express.static('public'))
const server = app.listen(8080, () => console.log("Server running..."))

app.use('/api/product', prodR)
app.use('/api/carts', cartR)
app.use('/', (req, res) => res.send('HOME'))




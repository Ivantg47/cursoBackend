const express = require('express')
const ProductManager = require('./productManager')

const app = express()
const producto = new ProductManager('./src/producto.json')
app.use(express.urlencoded({extended: true}))

app.get('/products', async (req, res) => {
    
    if (req.query.limit != null) {
        const prod = await producto.getProducts()
        res.send(prod.slice(0,req.query.limit))
        
    }else {
        res.send(await producto.getProducts())
    }
})

app.get('/products/:pid', async (req, res) => {
    //console.log(req.params.pid);
    res.send(await producto.getProductById(req.params.pid))
})

app.listen(8080, () => {
    console.log('Servidor arriba y escuchando el puerto 8080!!');
})
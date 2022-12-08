const router = require('express').Router()
const ProductManager = require('../productManager')

const producto = new ProductManager('./src/producto.json')

router.get('/', async (req, res) => {
    try {
        const prod = await producto.getProducts()
        if (!prod) {
            return res.status(404).send("not found")
        }
        if (req.query.limit != null) {
            return res.status(200).send(prod.slice(0,req.query.limit))
        }else{
            return res.status(200).send(prod)
        }
    } catch (error) {
        console.log(error);
    }
         
})

router.get('/:pid', async (req, res) => {
    try {
        const prod = await producto.getProductById(req.params.pid)
        if (!prod) {
            return res.status(404).send('not found') 
        }
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req, res) => {
    try {
        const prod = await producto.addProduct(req.body)
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const prod = await producto.updateProduct(req.body)
        if (!prod) {
            return res.status(404).send('not found')
        }
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const prod = await producto.deleteProduct(req.params.id)
        if (!prod) {
            return res.status(404).send('not found')
        }
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

module.exports = router
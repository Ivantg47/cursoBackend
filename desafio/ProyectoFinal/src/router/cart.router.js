const router = require('express').Router()
const CartManager = require('../cartManager')

const carrito = new CartManager('./src/carritos.json')

router.get('/', async (req, res) => {
    try {
        const cart = await carrito.getCarts()
        if (!cart) {
            return res.status(404).send("not found")
        }
        return res.status(200).send(cart)
    } catch (error) {
        return
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cart = await carrito.getCartById(req.params.cid)
        if (!cart) {
            return res.status(404).send("not found")
        }
        return res.status(200).send(cart)
    } catch (error) {
        return
    }
})

router.post('/', async (req, res) => {
    try {
        const cart = await carrito.addCart()
        console.log(cart);
        return res.status(200).send(cart)
    } catch (error) {
        return
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        console.log('hola');
        const cart = await carrito.updaeCart(Number(req.params.cid), Number(req.params.pid))
        console.log(cart);
        if(!cart){
            return res.status(404).send("not found 2") 
        }
        return res.status(200).send(cart)
    } catch (error) {
        return
    }
})

module.exports = router

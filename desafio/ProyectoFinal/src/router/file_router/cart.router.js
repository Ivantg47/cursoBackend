import express from 'express'
const router = express.Router()
import carrito from '../../dao/file_manager/cartManager.js'

router.get('/', async (req, res) => {
    try {
        const cart = await carrito.getCarts()
        if (!cart) {
            return res.status(404).send("not found")
        }
        return res.status(200).send(cart)
    } catch (error) {
        req.logger.error(error.message);
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
        req.logger.error(error.message);
    }
})

router.post('/', async (req, res) => {
    try {
        const cart = await carrito.addCart()
        return res.status(200).send(cart)
    } catch (error) {
        req.logger.error(error.message);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        
        const cart = await carrito.addProdCart(Number(req.params.cid), Number(req.params.pid))
    
        if(!cart){
            return res.status(404).send("not found") 
        }
        return res.status(200).send(cart)
    } catch (error) {
        req.logger.error(error.message);
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        
        const cart = await carrito.deleteCart(Number(req.params.cid))
    
        if(!cart){
            return res.status(404).send("not found") 
        }
        return res.status(200).send(cart)
    } catch (error) {
        req.logger.error(error.message);
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        
        const cart = await carrito.deleteProdCart(Number(req.params.cid), Number(req.params.pid))
    
        if(!cart){
            return res.status(404).send("not found 2") 
        }
        return res.status(200).send(cart)
    } catch (error) {
        req.logger.error(error.message);
    }
})

export default router

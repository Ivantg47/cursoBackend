import express from 'express'
const router = express.Router()

import producto from '../dao/file_manager/productManager.js'
import product from '../dao/bd_manager/productManagerBD.js'

router.get('/', async (req, res) => {

    // let prod = await producto.getProducts()
    let prod = await product.getProducts()
    prod.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
    { style: 'currency', currency: 'MXN' }).format(prod.price))
    res.render('home', {prod})
})

router.get('/realtimeproducts', async (req, res) => {
    
    res.render('realTimeProducts', {title: "list of products"})
})

router.get('/chat', async (req, res) => {
    
    res.render('chat', {})
})

router.get('/products', async (req, res) => {
    let prods = await product.getProducts()
    prods.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
    { style: 'currency', currency: 'MXN' }).format(prod.price))

    res.render('product', {prods})
})

router.get('/carts/:cid', async (req, res) => {
    
    res.render('cart', {title: "Chat"})
})

export default router
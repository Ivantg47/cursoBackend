import express from 'express'
const router = express.Router()

import producto from '../dao/file_manager/productManager.js'
import product from '../dao/bd_manager/productManagerBD.js'

router.get('/', async (req, res) => {

    // let prod = await producto.getProducts()
    let prod = await product.getProducts()
    
    res.render('home', {prod})
})

router.get('/realtimeproducts', async (req, res) => {

    // let prod = await producto.getProducts()
    let prod = await product.getProducts()
    
    res.render('realTimeProducts', {prod})
})

router.get('/chat', async (req, res) => {
    
    res.render('chat', {})
})

export default router
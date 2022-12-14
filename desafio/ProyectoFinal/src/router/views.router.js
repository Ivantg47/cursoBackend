import express from 'express'
const router = express.Router()

import producto from '../dao/productManager.js'

router.get('/', async (req, res) => {

    let prod = await producto.getProducts()
    
    res.render('home', {prod})
})

router.get('/realtimeproducts', async (req, res) => {

    let prod = await producto.getProducts()
    
    res.render('realTimeProducts', {prod})
})

export default router
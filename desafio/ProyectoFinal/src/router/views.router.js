import express from 'express'
const router = express.Router()

import producto from '../manager/productManager.js'

router.get('/', async (req, res) => {

    let prod = await producto.getProducts()
    
    res.render('home', {prod})
})

router.get('/realtimeproducts', async (req, res) => {

    let prod = await producto.getProducts()
    
    res.render('realTimeProducts', {prod})
})

router.get('/chat', async (req, res) => {
    
    res.render('chat', {})
})

export default router
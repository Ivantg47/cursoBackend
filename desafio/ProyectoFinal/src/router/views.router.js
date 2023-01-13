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
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let sort = req.query.sort
    if(!page) page = 1
    if(!limit) limit = 10
    // let page = parseInt(req.query.page)
    // if(!page) page = 1

    // //const result = await userModel.paginate({}, {page, limit: 5, lean: true})

    // let prods = await product.getProducts({page, limit: 5, lean: true})
    // // console.log(typeof prods[0].price)
    // // prods.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
    // // { style: 'currency', currency: 'MXN' }).format(prod.price))
    // // console.log(typeof prods[0].price)
    let prod = await product.getProducts({page, limit})
    console.log(prod);
    // console.log(typeof prods[0].price)
    // prods.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
    // { style: 'currency', currency: 'MXN' }).format(prod.price))
    // console.log(typeof prods[0].price)
    res.render('product', {prod})
})

router.get('/product/:pid', async (req, res) => {
    const data = await product.getProductById(req.params.pid)
    let prod = data.message

    prod.price = new Intl.NumberFormat('es-MX',
    { style: 'currency', currency: 'MXN' }).format(prod.price)

    res.render('productD', {title: prod.title, data: prod})
})

router.get('/carts/:cid', async (req, res) => {
    
    res.render('cart', {title: "Mi carrito"})
})

export default router
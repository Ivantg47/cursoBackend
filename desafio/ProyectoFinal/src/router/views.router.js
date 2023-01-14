import express from 'express'
const router = express.Router()

import producto from '../dao/file_manager/productManager.js'
import product from '../dao/bd_manager/productManagerBD.js'
import carrito from '../dao/bd_manager/cartManagerBD.js'

router.get('/', async (req, res) => {

    let parm = {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit)
    }
    
    if(!parm.page) parm.page = 1
    if(!parm.limit) parm.limit = 3
    if(req.query.sort) parm.sort = {price: req.query.sort}
    
    let prod = await product.getProducts(parm)
    
    if (prod.isValid) {
        prod.prevLink = prod.hasPrevPage ? `/?page=${prod.prevPage}` : ''
        prod.nextLink = prod.hasNextPage ? `/?page=${prod.nextPage}` : ''
        prod.payload.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
        { style: 'currency', currency: 'MXN' }).format(prod.price))

    }

    res.render('home', {title: "Products List", prod})
})

router.get('/realtimeproducts', async (req, res) => {
    
    res.render('realTimeProducts', {title: "Products List"})
})

router.get('/chat', async (req, res) => {
    
    res.render('chat', {})
})

router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let sort = req.query.sort
    if(!page) page = 1
    if(!limit) limit = 2
    //console.log('p: ', page, ' l: ', limit);

    let prod = await product.getProducts({page, limit})
    
    if (prod.isValid) {
        prod.prevLink = prod.hasPrevPage ? `/products?page=${prod.prevPage}` : ''
        prod.nextLink = prod.hasNextPage ? `/products?page=${prod.nextPage}` : ''
        prod.payload.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
        { style: 'currency', currency: 'MXN' }).format(prod.price))
    }
    // console.log(prod);

    res.render('product', {title: 'Catalogo', prod})
})

router.get('/product/:pid', async (req, res) => {
    const data = await product.getProductById(req.params.pid)
    let prod = data.message

    prod.price = new Intl.NumberFormat('es-MX',
    { style: 'currency', currency: 'MXN' }).format(prod.price)

    res.render('productD', {title: prod.title, data: prod})
})

router.get('/carts/:cid', async (req, res) => {
    let data = await carrito.getCartById(req.params.cid)
    let cart = data.message
    
    cart.products.forEach(prod => prod.totalPrice = Intl.NumberFormat('es-MX',
    { style: 'currency', currency: 'MXN' }).format(prod.product.price * prod.quantity))
    //console.log(cart.products.totalPrice);
    cart.products.forEach(prod => prod.product.price = new Intl.NumberFormat('es-MX',
        { style: 'currency', currency: 'MXN' }).format(prod.product.price))
    //console.log(cart.products);
    res.render('cart', {title: "Mi carrito", cart: cart})
})

export default router
import express from 'express'
const router = express.Router()

import producto from '../dao/file_manager/productManager.js'
import product from '../dao/bd_manager/productManagerBD.js'
import carrito from '../dao/bd_manager/cartManagerBD.js'

router.get('/', async (req, res) => {

    let arg = {}
    let parm = {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit)
    }
    
    if(!parm.page) parm.page = 1
    if(!parm.limit) parm.limit = 10
    if(req.query.sort) parm.sort = {price: req.query.sort}
    if(req.query.category) arg = {category: req.query.category}
    if(req.query.status) arg = {status: req.query.status}

    let prod = await product.getProducts(arg, parm)
    
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

router.get('/product', async (req, res) => {
    let arg = {}
    let parm = {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit)
    }
    
    if(!parm.page) parm.page = 1
    if(!parm.limit) parm.limit = 10
    if(req.query.sort) parm.sort = {price: req.query.sort}
    if(req.query.category) arg = {category: req.query.category}
    if(req.query.status) arg = {status: req.query.status}

    let prod = await product.getProducts(arg, parm)
    
    if (prod.isValid) {
        prod.prevLink = prod.hasPrevPage ? `/product?page=${prod.prevPage}` : ''
        prod.nextLink = prod.hasNextPage ? `/product?page=${prod.nextPage}` : ''
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
    console.log(data);
    let cart
    if (data.status == 200) {
        cart = data.message
        cart.isValid = true
        cart.total = 0
        //obtine el valor del subtotal de cada producto
        cart.products.forEach(prod => prod.totalPrice = prod.product.price * prod.quantity)
        //obtine el valor del total de los productos del carrito
        cart.products.forEach(prod => cart.total = cart.total += prod.totalPrice)
        
        //se cambia de valor numerico una cadena en formato moneda MXN del precio, subtotal y total
        //precio
        cart.products.forEach(prod => prod.totalPrice = Intl.NumberFormat('es-MX',
            { style: 'currency', currency: 'MXN' }).format(prod.totalPrice))
        //subtotal
        cart.products.forEach(prod => prod.product.price = new Intl.NumberFormat('es-MX',
            { style: 'currency', currency: 'MXN' }).format(prod.product.price))
        //total
        cart.total = new Intl.NumberFormat('es-MX',
            { style: 'currency', currency: 'MXN' }).format(cart.total)
        console.log(cart);
    }
    
    res.render('cart', {title: "Mi carrito", cart: cart})
})

export default router
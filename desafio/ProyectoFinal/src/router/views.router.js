import express from 'express'
const router = express.Router()

import producto from '../dao/file_manager/productManager.js'
import product from '../dao/bd_manager/productManagerBD.js'
import carrito from '../dao/bd_manager/cartManagerBD.js'

//<<<<<<<<<<<<<<<<<<<<<<<<<<Vistas Producto>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/', async (req, res) => {

    let arg = {}
    let parm = {
        page: parseInt(req.query?.page) || 1,
        limit: parseInt(req.query?.limit) || 10
    }
    const filter = req.query?.query || req.body?.query
    if(filter) arg['$or'] = [
        {title: {$regex: filter}},
        {category: {$regex: filter}}
    ]

    if(filter) arg['title'] = {$regex: filter}
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

    res.render('product/home', {title: "Products List", prod, query: filter})
})

router.get('/realtimeproducts', async (req, res) => {
    
    res.render('product/realTimeProducts', {title: "Products List"})
})

router.get('/product', async (req, res) => {
    let arg = {}
    let parm = {
        page: parseInt(req.query?.page) || 1,
        limit: parseInt(req.query?.limit) || 10
    }
    const filter = req.query?.query || req.body?.query

    if(filter) arg = {title: {$regex: filter}}
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

    res.render('product/product', {title: 'Catalogo', prod, query: filter})
})

router.get('/product/:pid', async (req, res) => {
    const data = await product.getProductById(req.params.pid)
    let prod = data.message

    prod.price = new Intl.NumberFormat('es-MX',
    { style: 'currency', currency: 'MXN' }).format(prod.price)

    res.render('product/productD', {title: prod.title, data: prod})
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<Vistas Carrito>>>>>>>>>>>>>>>>>>>>>>>>>>
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

//<<<<<<<<<<<<<<<<<<<<<<<<<<Vista Chat>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/chat', async (req, res) => {
    
    res.render('chat', {})
})


//<<<<<<<<<<<<<<<<<<<<<<<<<<Vistas sesion>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/sessions/login', async (req, res) => {
    
    res.render('session/login', {title: 'Login'})
})

router.get('/sessions/register', async (req, res) => {
    
    res.render('session/register', {title: 'Register'})
})

export default router
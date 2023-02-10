import express from 'express'
const router = express.Router()

import producto from '../dao/file_manager/productManager.js'
import product from '../dao/bd_manager/productManagerBD.js'
import carrito from '../dao/bd_manager/cartManagerBD.js'


//<<<<<<<<<<<<<<<<<<<<<<<<<<Vistas Producto>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/', async (req, res) => {

    if (!req.session.user) {
        res.redirect('session/login')
    } else {

        let query = {}
        let pagination = {
            page: parseInt(req.query?.page) || 1,
            limit: parseInt(req.query?.limit) || 10
        }
        const filter = req.query?.query || req.body?.query
        const category = req.query?.category || req.body?.category

        if(filter) query['title'] = {$regex: `(?i)${filter}(?i)`}
        if(req.query.sort) pagination.sort = {price: req.query.sort}
        if(req.query.category) query = {category: {$regex: `(?i)${category}(?i)`}}
        if(req.query.status) query = {status: req.query.status}
        
        let prod = await product.getProducts(query, pagination)
        
        if (prod.isValid) {
            prod.prevLink = prod.hasPrevPage ? `/?page=${prod.prevPage}` : ''
            prod.nextLink = prod.hasNextPage ? `/?page=${prod.nextPage}` : ''
            prod.payload.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
            { style: 'currency', currency: 'MXN' }).format(prod.price))

        }
        
        res.render('product/home', {title: "Products List", prod, query: filter, user: req.session.user})
    }
    
    

})

router.get('/realtimeproducts', async (req, res) => {
    
    res.render('product/realTimeProducts', {title: "Products List", user: req.session.user})
})

router.get('/product', async (req, res) => {
    let query = {}
    let pagination = {
        page: parseInt(req.query?.page) || 1,
        limit: parseInt(req.query?.limit) || 10
    }
    const filter = req.query?.query || req.body?.query

    if(filter) query = {title: {$regex: `/${filter}/i`}}
    if(req.query.sort) pagination.sort = {price: req.query.sort}
    if(req.query.category) query = {category: req.query.category}
    if(req.query.status) query = {status: req.query.status}

    let prod = await product.getProducts(query, pagination)
    
    if (prod.isValid) {
        prod.prevLink = prod.hasPrevPage ? `/product?page=${prod.prevPage}` : ''
        prod.nextLink = prod.hasNextPage ? `/product?page=${prod.nextPage}` : ''
        prod.payload.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
        { style: 'currency', currency: 'MXN' }).format(prod.price))
    }
    
    let admin = req.session.user?.role == 'admin'
    
    res.render('product/product', {title: 'Catalogo', prod, query: filter, user: req.session.user, admin})
})

router.get('/product/:pid', async (req, res) => {
    const data = await product.getProductById(req.params.pid)
    
    if (data.status !== 200) return res.status(404).render('error/general', {error: 'Product not found'})
    
    let prod = data.message

    prod.price = new Intl.NumberFormat('es-MX',
    { style: 'currency', currency: 'MXN' }).format(prod.price)

    res.render('product/productD', {title: prod.title, data: prod})
    
})

router.get('/products/register', async (req, res) => {

    res.render('product/registerProd', {title: 'Registrar nuevo producto', user: req.session.user})
    
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<Vistas Carrito>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/carts/:cid', async (req, res) => {
    let data = await carrito.getCartById(req.params.cid)
    
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
        
    }
    
    res.render('cart/cart', {title: "Mi carrito", cart: cart, user: req.session.user})
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<Vista Chat>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/chat', async (req, res) => {
    
    res.render('chat', {})
})

export default router
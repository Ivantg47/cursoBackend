
import express from 'express'
import CartRouter from './cart.router.js'
import ProductRouter from './product.router.js'
const router = express.Router()

const product = new ProductRouter()
const cart = new CartRouter()

router.use('/products', product.getRouter())
router.use('/carts', cart.getRouter())
// router.use('/api/chat', chat.getRouter())
// router.use('/session', session.getRouter())

export default router

import { Router } from 'express'
import { passportCall } from '../utils.js'
import CartRouter from './api_router/cart.router.js'
import ChatRouter from './api_router/chat.router.js'
import MockingRouter from './api_router/mocking.router.js'
import ProductRouter from './api_router/product.router.js'
import SessionRouter from './api_router/session.router.js'
import ViewRouter from './views.router.js'

const router = Router()
const product = new ProductRouter()
const cart = new CartRouter()
const view = new ViewRouter()
const session = new SessionRouter()
const chat = new ChatRouter()
const mocking = new MockingRouter()

router.use('/api/products', product.getRouter())
router.use('/api/carts', cart.getRouter())
router.use('/api/chat', chat.getRouter())
router.use('/', /*passportCall('jwt'),*/ view.getRouter())
router.use('/session', session.getRouter())
router.use('/api/mocking', mocking.getRouter())

export default router
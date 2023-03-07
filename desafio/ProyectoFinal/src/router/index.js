
import { Router } from 'express'
import CartRouter from './cart.router.js'
import ChatRouter from './chat.router.js'
import ProductRouter from './product.router.js'
import SessionRouter from './session.router.js'
import ViewRouter from './views.router.js'

const router = Router()
const product = new ProductRouter()
const cart = new CartRouter()
const view = new ViewRouter()
const session = new SessionRouter()
const chat = new ChatRouter()

router.use('/products', product.getRouter())
router.use('/carts', cart.getRouter())
router.use('/api/chat', chat.getRouter())
router.use('/', view.getRouter())
router.use('/session', session.getRouter())

export default router
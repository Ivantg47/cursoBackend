
import express from 'express' //importo express
import ProductRouter from './product.router.js'
const router = express.Router() //la clase Router del módulo de express

const product = new ProductRouter()

router.use('/products', product.getRouter())
// router.use('/carts', carts) //defino que las rutas de cart contengan "/cart"

export default router //exporto para poder usar el enrrutador principal en app.js
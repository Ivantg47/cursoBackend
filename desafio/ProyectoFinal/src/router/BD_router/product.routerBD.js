
import express from 'express'
const router = express.Router()
import producto from '../../dao/bd_manager/productManagerBD.js'
import uploader from '../../dao/multer.js'

router.get('/', async (req, res, next) => {
    try {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let sort = req.query.sort
        if(!page) page = 1
        if(!limit) limit = 10
        //if(sort && (sort))
        const prod = await producto.getProducts({}, {page, limit})
        //console.log(prod);
        if (!prod.isValid) {
            return res.status(404).send("not found")
        }
        prod.status = 'suucces'
        return res.status(200).send(prod)
    
        // let page = parseInt(req.query.page)
        // if(!page) page = 1

        // let prods = await producto.getProducts({page: page, limit: 5, lean: true})

        return prods
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.get('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        const prod = await producto.getProductById({_id: pid})

        return res.status(prod.status).send(prod.message)
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/', uploader.array('thumbnail'), async (req, res, next) => {
    try {
        let product = req.body
        //console.log(product);
        if(req.files.length === 0) {
            product.thumbnail = ['/img/noimage.jpg']
        } else {
            product.thumbnail = req.files.map(file => file.path.split('\\').slice(1).join('\\'))
        }
        
        const prod = await producto.addProduct(product)
        //console.log(prod);
        if (prod.success) {
            return res.status(200).send(prod)
        } else {
            return res.status(400).send(prod)
        }
        
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.put('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        const newProd = req.body

        const prod = await producto.updateProduct({_id: pid}, newProd)
        
        return res.status(200).send(prod)

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.delete('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        console.log(pid);
        const prod = await producto.deleteProduct({_id: pid})
        
        return res.status(prod.status).send(prod)
        
    } catch (error) {
        console.log(error);
        return next()
    }
})

export default router
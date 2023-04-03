
import express from 'express'
import { ProductService } from '../../repositories/index.js'
import producto from '../../dao/bd_manager/mogo/productManagerBD.js'
import uploader from '../../dao/multer.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        let pagination = {
            page: parseInt(req.query?.page) || 1,
            limit: parseInt(req.query?.limit) || 10
        }
        const filter = req.query?.query || req.body?.query

        let query = {}

        if(req.query.sort) pagination.sort = {price: req.query.sort}
        if(filter) query = {title: {$regex: `/${filter}/i`}}
        if(req.query.category) query = {category: req.query.category}
        if(req.query.status) query = {status: req.query.status}
        
        const prod = await ProductService.getProducts(query, pagination)
        
        if (!prod.isValid) {
            return res.status(404).send("not found")
        }
        return res.status(200).send(prod)

    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})

router.get('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        const prod = await ProductService.getProductById({_id: pid})

        return res.status(prod.status).send(prod.message)
    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})

router.post('/', uploader.array('thumbnail'), async (req, res, next) => {
    try {
        let product = req.body

        if(req.files.length === 0) {
            product.thumbnail = ['/img/noimage.jpg']
        } else {
            product.thumbnail = req.files.map(file => file.path.split('\\').slice(0).join('\\'))
        }
        
        const prod = await ProductService.addProduct(product)

        if (prod.success) {
            return res.status(200).send(prod)
        } else {
            
            return res.status(400).send(prod)
        }
        
    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})

router.put('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        const newProd = req.body

        const prod = await ProductService.updateProduct({_id: pid}, newProd)
        
        return res.status(200).send(prod)

    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})

router.delete('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        const prod = await ProductService.deleteProduct({_id: pid})
        
        return res.status(prod.status).send(prod)
        
    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})

export default router
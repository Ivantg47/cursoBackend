import { initializeApp } from "@firebase/app";
import uploader from "../../dao/multer.js";
import { ProductService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";
//import { getStorage } from 'firebase-admin/storage'
//import db from "../../utils/firebase/storage.js";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import config from "../../config/config.js";
import storage from "../../utils/firebase/storage.js";

export default class ProductRouter extends MiRouter {

    init() {

        this.get('/', ["PUBLIC"], async (req, res) => {
            try {
                // req.logger.debug('llama get')
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
                
                const prod = await ProductService.getPaginate(query, pagination)
                //const prod = await ProductService.getProducts()
                return res.status(prod.code).send(prod.result)

            } catch (error) {
                console.error(error);
                req.logger.error(error.message);
            }
        })

        this.get('/:pid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { pid } = req.params
                const prod = await ProductService.getProductById(pid)
                
                return res.status(prod.code).send(prod.result)

            } catch (error) {
                req.logger.error(error.message);
            }
        })

        this.post('/', ["ADMIN", "PREMIUM"], uploader.array('thumbnail'), async (req, res, next) => {
            try {
                
                const product = req.body
                
                if (req.session.user?.role == 'premium' || req.user?.role == 'premium') {
                    product.owner = req.session.user?.email || req.user?.email    
                }
                
                if(req.files?.length === 0 || !req.files) {
                    product.thumbnail = ['/img/noimage.jpg']
                } else {
                    
                    product.thumbnail = await Promise.all(req.files.map(async (file) => {

                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E2)
                        const storageRef = ref(storage, `/img/products/${product.title}-${uniqueSuffix}`)
                        const metadata = { contentType: file.mimetype, name: `${file.fieldname}-${uniqueSuffix}`}
                        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
                        
                        const downloadURL = await getDownloadURL(snapshot.ref);
                        
                        return downloadURL
                        
                    }))
                }
                
                const prod = await ProductService.addProduct(product)
        
                return res.status(prod.code).send(prod.result)     
                
            } catch (error) {
                // req.logger.error(error.message);
                // req.logger.error(error);
                console.error(error);
                //return next()
            }
        })
        
        this.put('/:pid', ["ADMIN", "PREMIUM","PUBLIC"], async (req, res, next) => {
            try {
                const { pid } = req.params
                const newProd = req.body
                
                if (req.session.user?.role == 'premium' || req.user?.role == 'premium') {
                    const p = await ProductService.getProductById(pid)
                    if (p.owner != req.session.user.email) {
                        return res.status(401).send({status: "error", message: 'Sin autorización'})
                    }
                }

                const prod = await ProductService.updateProduct(pid, newProd)

                return res.status(prod.code).send(prod.result)
        
            } catch (error) {
                req.logger.error(error.message);
                //return next()
            }
        })
        
        this.delete('/:pid', ["ADMIN", "PREMIUM"], async (req, res, next) => {
            try {
                const { pid } = req.params

                if (req.session.user?.role == 'premium' || req.user?.role == 'premium') {
                    const p = await ProductService.getProductById(pid)
                    if (p.owner != req.session.user.email) {
                        return res.status(401).send({status: "error", message: 'Sin autorización'})
                    }
                }
                
                const prod = await ProductService.deleteProduct(pid)
                
                return res.status(prod.code).send(prod.result)
                
            } catch (error) {
                req.logger.error(error.message);
                //return next()
            }
        })
    }
}
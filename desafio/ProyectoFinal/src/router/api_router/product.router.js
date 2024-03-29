import uploader from "../../dao/multer.js";
import { ProductService } from "../../repositories/index_repository.js";
import { generateProduct } from "../../utils.js";
import MiRouter from "../router.js";


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
                
                let product = req.body
                
                if (req.session.user?.role == 'premium' || req.user?.role == 'premium') {
                    product.owner = req.session.user?.email || req.user?.email    
                }
                
                if(req.files?.length === 0 || !req.files) {
                    product.thumbnail = ['/img/noimage.jpg']
                } else {
                    product.thumbnail = req.files.map(file => file.path.split('\\').slice(0).join('\\'))
                }
                
                const prod = await ProductService.addProduct(product)
        
                return res.status(prod.code).send(prod.result)     
                
            } catch (error) {
                req.logger.error(error.message);
                console.error(error);
                //return next()
            }
        })
        
        this.put('/:pid', ["ADMIN", "PREMIUM"], async (req, res, next) => {
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
import uploader from "../dao/multer.js";
import { ProductService } from "../repositories/index.js";
import MiRouter from "./router.js";


export default class ProductRouter extends MiRouter {

    init() {

        this.get('/', ["PUBLIC"], async (req, res) => {
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
                    return res.sendNoFoundError("Not Found")
                }
                return res.sendSuccess(prod)
            } catch (error) {
                console.error(error);
            }
        })

        this.get('/:pid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { pid } = req.params
                const prod = await ProductService.getProductById({_id: pid})
                
                if (!prod) {
                    return res.sendNoFoundError("Not Found")
                }
                return res.sendSuccess(prod)

            } catch (error) {
                console.error(error);
            }
        })

        this.post('/', ["ADMIN"], uploader.array('thumbnail'), async (req, res, next) => {
            try {
                let product = req.body
        
                if(req.files?.length === 0 || !req.files) {
                    product.thumbnail = ['/img/noimage.jpg']
                } else {
                    product.thumbnail = req.files.map(file => file.path.split('\\').slice(0).join('\\'))
                }
                
                const prod = await ProductService.addProduct(product)
        
                if (prod._id) {
                    return res.sendSuccess(prod)
                }
                    
                return res.sendUserError(prod)
                
                
            } catch (error) {
                console.error(error);
                //return next()
            }
        })
        
        this.put('/:pid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { pid } = req.params
                const newProd = req.body
                
                const prod = await ProductService.updateProduct({_id: pid}, newProd)

                return res.status(prod.status).send(prod)
        
            } catch (error) {
                console.error(error);
                //return next()
            }
        })
        
        this.delete('/:pid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { pid } = req.params
                const prod = await ProductService.deleteProduct({_id: pid})
                
                return res.status(prod.status).send(prod)
                
            } catch (error) {
                console.error(error);
                //return next()
            }
        })
    }
}
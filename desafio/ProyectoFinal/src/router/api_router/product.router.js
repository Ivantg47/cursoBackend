import uploader from "../../dao/multer.js";
import { ProductService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";
import { getStorage } from 'firebase-admin/storage'
import firebase from "../../utils/firebase/storage.js";
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
                const storage = getStorage()
                const product = req.body
                console.log(req.files);
                if (req.session.user?.role == 'premium' || req.user?.role == 'premium') {
                    product.owner = req.session.user?.email || req.user?.email    
                }
                
                if(req.files?.length === 0 || !req.files) {
                    product.thumbnail = ['/img/noimage.jpg']
                } else {
                    //const snapshot = await storage.child(fileName);
                    product.thumbnail = req.files.map(async (file) => {
                        
                        const storageRef = storage.bucket('gs://ecommerce-cc190.appspot.com/img/products')
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                        const type = file.originalname.split(".")[1];
                        const fileName = `${file.fieldname}-${uniqueSuffix}.${type}`
                        //const storageRef = storage.ref(`files/~2Fimg~2Fproducts/${file.fieldname}-${uniqueSuffix}`)
                        const metadata = { contentType: file.mimetype }
                        //const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
                        //const fileURL = getDownloadURL(snapshot.ref)
                        //console.log(fileURL);
                        //return fileURL
                        storageRef.file(fileName, )
                        let fileRef = storageRef.child(fileName);
                        await fileRef.put(img.buffer);
                        const singleImgPath = await fileRef.getDownloadURL();
                        imagePaths.push(singleImgPath);

                        if(imagePaths.length == images.length){
                            console.log("got all paths here now: ", imagePaths);
                        }
                    })
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
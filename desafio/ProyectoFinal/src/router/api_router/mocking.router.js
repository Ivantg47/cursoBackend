import { ProductService } from "../../repositories/index_repository.js";
import { generateProduct } from "../../utils.js";
import MiRouter from "../router.js";

export default class MockingRouter extends MiRouter {

    init(){
        this.get('/', ["PUBLIC"], (req, res) => {
            
            return res.send('hola')
        })

        this.get('/mockingproducts', ["PUBLIC"], async (req, res, next) => {
            try {
                
                for (let i = 0; i < 100; i++) {

                    await ProductService.addProduct(generateProduct())
                    
                }

                return res.status(200).send({status: 'success', message: 'Productos generados'})

            } catch (error) {
                console.error(error);
                return res.status(500).send({status: 'error', message: error.message})
            }
        })
    }
}
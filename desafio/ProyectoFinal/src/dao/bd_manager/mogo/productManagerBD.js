import { productModel } from './models/product.model.js'


class ProductManagerBD{

    constructor(){
        
    }

    getProducts = async (query, pagination) => {

        try{
            pagination.lean = true

            const data = await productModel.paginate(query, pagination)
            
            const prods = {
                status: 'success',
                isValid: !(data.page <= 0 || data.page>data.totalPages || data.docs.length === 0),
                payload: data.docs,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage, 
                page: data.page, 
                hasPrevPage: data.hasPrevPage, 
                hasNextPage: data.hasNextPage
            }
            
            if (!prods.isValid) {
                prods.status = 'error'
            }
            
            return prods

        } catch(error) {
            console.error(error);
        }
    }

    getProductById = async(id) => {

        try{
            
            const data = await productModel.findOne({_id: id}).lean().exec()
            
            if (!data) {
                return {status: 404, message: 'Not found'}
            }
            return {status: 200, message: data}
        
        } catch(error) {
            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            console.error(error);
            return error
        }    
    }

    addProduct = async(prod) => {

        try{

            if (!prod.title || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return 'Falta llenar campos'
            }

            const result = await productModel.create(prod)
            
            return result

        } catch(error) {
            console.error(error);
            return error
            
        }    
    }

    deleteProduct = async(id) => {

        try{
            const result = await productModel.deleteOne(id)
            console.log(result);
            if (result.deletedCount == 0) {
                return {status: 404, error: 'Not found'}
            }
            return {status: 200, payload: 'Producto eliminado'}
        
        } catch(error) {
            if (error.name === 'CastError') {
                return {status: 400, error: 'Id invalido'}
            }
            console.error(error);
            return error
        }                            
    }

    updateProduct = async(pid, newProd) => {

        try{
            const result = await productModel.findOneAndUpdate(pid, newProd)
            
            return !result ? {status: 400, error: 'Not Found' } : {status: 200, payload: 'Producto actualizado' }
        
        } catch(error) {
            if (error.name === 'CastError') {
                return {status: 400, error: 'Id invalido' }
            }
            if (error.code === 66) {
                return {status: 400, error: 'El id no se pude modificar' }
            }
            if (error.name === 'MongoServerError' && error.code === 11000) {
                return {status: 400, error: 'Codigo en uso' }
            }
            console.error(error);
            return error
        }                        
    }

}

const producto = new ProductManagerBD()

export default producto

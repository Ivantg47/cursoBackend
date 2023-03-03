import { productModel } from './models/product.model.js'


class ProductManagerBD{

    constructor(){
        
    }

    getProducts = async (query, pagination) => {

        try{
            pagination.lean = true

            const data = await productModel.paginate(query, pagination)
            
            const prods = {
                isValid: !(data.page <= 0 || data.page>data.totalPages || data.docs.length === 0),
                payload: data.docs,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage, 
                page: data.page, 
                hasPrevPage: data.hasPrevPage, 
                hasNextPage: data.hasNextPage
            }
            
            return prods

        } catch(error) {
            
            throw error

        }
    }

    getProductById = async(id) => {

        try{
            
            const data = await productModel.findOne({_id: id}).lean().exec()
            
            return data
        
        } catch(error) {
            
            throw error

        }    
    }

    addProduct = async(prod) => {

        try{

            const result = await productModel.create(prod)
            
            return result

        } catch(error) {
            
            throw error
            
        }    
    }

    deleteProduct = async(id) => {

        try{
            const result = await productModel.deleteOne(id)
            
            return result
        
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
            
            return result
        
        } catch(error) {
            
            throw error

        }                        
    }

}

const producto = new ProductManagerBD()

export default producto

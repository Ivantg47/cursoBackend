import { productModel } from '../models/product.model.js'


class ProductManagerBD{

    constructor(){
        
    }

    getProducts = async() => {

        try{

            const data = await productModel.find().lean().exec()
            return data

        } catch(error) {
            console.log(error);
        }
    }

    getProductById = async(id) => {

        try{
            
            const data = await productModel.findOne({_id: id}).lean().exec()
            //console.log(data);
            if (!data) {
                return {status: 404, message: 'Not found'}
            }
            return {status: 200, message: data}
        
        } catch(error) {
            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            console.log(error)
            return error
        }    
    }

    addProduct = async(prod) => {

        try{
            const prods = await this.getProducts()

            if (!prod.title || !prod.description || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return {success: false, message: 'Falta llenar campos'}
            }

            const result = await productModel.create(prod)
            
            return {success: true, product: result}

        } catch(error) {
            console.log(error)
            return error
            
        }    
    }

    deleteProduct = async(id) => {

        try{
            const result = await productModel.deleteOne(id)

            console.log(result);
            if (result.deletedCount === 0) {
                return {status: 404, message: 'Not found'}
            }
            return {status: 200, message: 'Producto eliminado'}
        
        } catch(error) {
            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            console.log(error)
            return error
        }                            
    }

    updateProduct = async(pid, newProd) => {

        try{
            const result = await productModel.updateOne(pid, newProd)
            //console.log('1: ', result);
            return {success: true, product: 'Producto actualizado'}
        
        } catch(error) {
            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            if (error.code === 66) {
                return {status: 400, message: 'El id no se pude modificar'}
            }
            if (error.name === 'MongoServerError' && error.code === 11000) {
                return {status: 400, message: 'Codigo en uso'}
            }
            console.log(error)
            return error
        }                        
    }

}

const producto = new ProductManagerBD()

export default producto

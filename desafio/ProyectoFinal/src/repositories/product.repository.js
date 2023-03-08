import ProductDTO from '../dao/DTO/product.dto.js'

export default class ProductRepository {

    constructor (dao) {
        this.dao = dao
    }

    getProducts = async() => {
        try {

            const result = await this.dao.getProducts()

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {

            console.error(error);

        }
    }

    getPaginate = async (query, pagination) => {
        try {

            const result = await this.dao.getProducts(query, pagination)

            if (!result.isValid) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {
            
            console.error(error);
            
        }
    }

    getProductById = async(id) => {
        try {

            const result = await this.dao.getProductById(id)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {

            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            console.error(error);

        }       
    }

    addProduct = async(prod) => {
        try {
            const data = new ProductDTO(prod)
            if (!prod.title || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return {code: 400, result: {status: "error", error: 'Falta llenar campos'}}
            }

            const result = await this.dao.addProduct(prod)

            return {code: 200, result: {status: "success", message: 'Producto creado', payload: result} }

        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            // console.error(error);
            // console.error('--',error.name);
            // console.error('--',error.message);
            return {code: 500, result: {status: "error", error: error.message}}

        }
    }

    deleteProduct = async(id) => {
        try {
            
            const result = await this.dao.deleteProduct(id)

            if (result.deletedCount === 0) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Producto eliminado'} }

        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            console.error(error);

        }
    }

    updateProduct = async(pid, newProd) => {
        try {
            
            const result = await this.dao.updateProduct(pid, newProd)

        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            if (error.code === 66) {
                return {status: 400, error: 'El id no se pude modificar' }
            }

            if (error.name === 'MongoServerError' && error.code === 11000) {
                return {status: 400, error: 'Codigo en uso' }
            }

            console.error(error);

        }
    }

    purchase = async(pid, quantity) => {
        try {
            const result = await this.dao.purchase(pid, -quantity)
            
            return result

        } catch (error) {
            
            console.error(error);

        }
    }

}
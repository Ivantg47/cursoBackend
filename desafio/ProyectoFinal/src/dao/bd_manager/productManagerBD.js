import { productModel } from '../models/product.model.js'


class ProductManagerBD{

    constructor(){
        
    }

    getProducts = async (arg, parm) => {

        try{
            // console.log('par: ', parm);
            // const dat = await productModel.find().lean().exec()
            parm.lean = true
            console.log(arg);
            // parm.sort = {price: 'desc'}
            // console.log(parm);
            const data2 = await productModel.aggregate([
                {
                    $match: {category: 'electronico'}
                }

            ])
            console.log('data2: ', data2);
            const data = await productModel.paginate({}, parm)
            
            const prods = {
                status: 'success',
                isValid: !(data.page <= 0 || data.page>data.totalPages),
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
            // console.log(prods);
            // status:success/error
            // payload: Resultado de los productos solicitados
            // totalPages: Total de páginas
            // prevPage: Página anterior
            // nextPage: Página siguiente
            // page: Página actual
            // hasPrevPage: Indicador para saber si la página previa existe
            // hasNextPage: Indicador para saber si la página siguiente existe.
            // prevLink: Link directo a la página previa (null si hasPrevPage=false)
            // nextLink: Link directo a la página siguiente (null si hasNextPage=false)
            //console.log(prods);
            
            
            return prods

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

            if (!prod.title || !prod.description || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return {success: false, message: 'Falta llenar campos'}
            }

            const result = await productModel.create(prod)
            
            return {success: true, product: result, message: 'Producto añadido'}

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
                return {success: false, status: 404, message: 'Not found'}
            }
            return {success: true, status: 200, message: 'Producto eliminado'}
        
        } catch(error) {
            if (error.name === 'CastError') {
                return {success: false, status: 400, message: 'Id invalido'}
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

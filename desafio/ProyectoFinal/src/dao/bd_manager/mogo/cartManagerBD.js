import { cartModel } from "./models/cart.model.js"
import { ticketModel } from "./models/ticket.model.js"
import product from "./productManagerBD.js"

class CartManager{

    constructor(){
    }

    getCarts = async() => {

        try{

            const cart = await cartModel.find().lean().exec()

            return cart

        } catch(error) {

            throw error

        }
    }

    getCartById = async(id) => {

        try{

            const cart = await cartModel.findOne({_id: id}).populate('products.product').lean().exec()

            return cart
        
        } catch(error) {

            throw error

        } 
    }
    
    addCart = async() => {

        try{

            const result = await cartModel.create({})
            
            return result
            
        } catch(error) {

            throw error

        }
    }
    
    deleteCart = async(id) => {
        try {
            
            const result = await cartModel.deleteOne({_id: id})
            
            return result

        } catch(error) {

            throw error

        }
    }

    updateCart = async(cid, prods) => {
        try {
            
            const result = await cartModel.findOneAndUpdate({_id: cid}, {'$set': { "products": prods}})
            
            return result

        } catch (error) {
            
            throw error
        }
    }
    
    addProdCart = async(cid, pid, quantity) => {
        try{

            const prod = await product.getProductById(pid)
            console.log(prod);
            if (!prod) {
                throw new Error('Product not Found')
            }
            const res = await cartModel.findOne({_id: cid, 'products.product': pid}, {"products.$": 1, "_id": 0}).lean().exec()
            let result
            if (res) {
                return result = await cartModel.updateOne({_id: cid, 'products.product': pid}, {'$set': {"products.$.quantity": res.products[0].quantity+quantity}})
            } else {
                return result = await cartModel.updateOne({_id: cid}, {'$push': { products: {product: pid, quantity: quantity}}})
            }
            

        } catch(error) {

            throw error

        } 
    }

    deleteProdCart = async(cid, pid) => {
        try{
            
            // if (!await cartModel.findOne({_id: cid})) {
            //     return {status: 404, message: 'Carrito no encontrado'}
            // }
            const result = await cartModel.findOneAndUpdate({_id: cid, 'products.product': pid}, {'$pull': {products: {product: pid}}}).lean().exec()
            
            return result
            
        
        } catch(error) {

            throw error

        }
    }

    updateProdCart = async(cid, pid, prod) => {
        try {
            if (!await cartModel.findOne({_id: cid})) {
                return {status: 404, message: 'Carrito no encontrado'}
            }

            const result = await cartModel.findOneAndUpdate({_id: cid, 'products.product': pid}, {'$set': {"products.$.quantity": prod.quantity}}).lean().exec()

            if (!result) {
                return {status: 404, message: 'Producto no encontrado'}
            } 
            
            return {status: 200, message: 'Producto actualizado'}

        } catch (error) {
            console.error(error)
            return error
        }
    }

    purchase = async(cid) => {
        body.purchase_datetime = new Date()
        console.log(body);
        const result = await ticketModel.create(body)

        return result
    }

}

const carrito = new CartManager()

export default carrito

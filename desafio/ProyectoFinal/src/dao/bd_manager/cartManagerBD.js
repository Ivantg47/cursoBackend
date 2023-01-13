import { cartModel } from "../models/cart.model.js"


class CartManager {

    constructor(){
    }

    getCarts = async() => {
        try{

            const cart = await cartModel.find().lean().exec()
            return cart

        } catch(error) {

            console.log(error);
            
        }
    }

    getCartById = async(id) => {
        try{
            
            const cart = await cartModel.findOne({_id: id}).lean().exec()
            //console.log('=>',await cartModel.findOne({_id: id, "products.id": "63b4a6ed2af774c4b6a64cf3"}).lean().exec());
            //console.log(cart);
            if (!cart) {
                return {status: 404, message: 'Not found'}
            }

            return {status: 200, message: cart}
        
        } catch(error) {

            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            console.log(error);

        } 
    }
    
    addCart = async() => {
        try{

            const result = await cartModel.create({})
            //console.log(result);
            return {success: true, cart: result}
                    
        } catch(error) {

            console.log(error);

        }
    }
    
    deleteCart = async(id) => {
        try {
        
            const result = await cartModel.deleteOne(id)
    
            //console.log(result);
            if (result.deletedCount === 0) {
                return {status: 404, message: 'Not found'}
            }
            return {status: 200, message: 'Carrito eliminado'}
            
        } catch(error) {

            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            console.log(error)
            return error

        }
    }

    updateCart = async(cid, prods) => {
        try {
            
            const result = await cartModel.updateOne(cid, prods)

        } catch (error) {
            console.log(error)
            return error
        }
    }
    
    addProdCart = async(cid, pid) => {
        try{
            
            let cart = await cartModel.findOne({_id: cid}).lean().exec()
            
            if(!cart){
                return {status: 404, message: 'Not found'}
            }

            const iP = cart.products.map(uProd => JSON.stringify(uProd.product)).indexOf(JSON.stringify(pid._id))

            if (iP !== -1) {
                cart.products[iP].quantity++
            } else {
                cart.products.push({product: pid, quantity: 1})
            }
            
            const result = await cartModel.updateOne(cid, cart)
            
            return {status: 200, message: 'Producto agregado'}

        } catch(error) {

            console.log(error);

        } 
    }

    deleteProdCart = async(cid, pid) => {
        try{
            
            let cart = await cartModel.findOne({_id: cid}).lean().exec()
            
            if(!cart){
                return {status: 404, message: 'Not found'}
            }

            const iP = cart.products.map(uProd => JSON.stringify(uProd.product)).indexOf(JSON.stringify(pid._id))

            if (iP === -1) {
                return {status: 404, message: 'Producto no encontrado'} 
            } 

            cart.products[iP].quantity--

            if (cart.products[iP].quantity === 0) {
                cart.products = cart.products.filter((uProd) => JSON.stringify(uProd.product) != JSON.stringify(pid._id))
            } 
            
            const result = await cartModel.updateOne(cid, cart)
            
            return {status: 200, message: 'Producto eliminado'}
        
        } catch(error) {

            console.log(error);

        } 
    }

    updateProdCart = async(cid, pid, prod) => {
        try {
            
            const result = await cartModel.findOneAndUpdate({_id: cid._id, 'products.product': pid.id}, {'$set': {"products.$.quantity": prod.quantity}})

            return {status: 200, message: result}

        } catch (error) {
            console.log(error)
            return error
        }
    }

}

const carrito = new CartManager()

export default carrito
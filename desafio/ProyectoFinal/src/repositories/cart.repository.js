import CartDTO from '../dao/DTO/cart.dto.js'
import { ProductService, TicketService } from "./index.js"

export default class CartRepository {

    constructor (dao) {
        this.dao = dao
    }

    getCarts = async () => {

        try {

            const result = await this.dao.getCarts()

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {

            console.error(error);

        }
    }

    getCartById = async(id) => {
        try {

            const result = await this.dao.getCartById(id)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }
            

        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            return {code: 500, result: {status: "error", error: error}}

        }
    }

    addCart = async(cart) => {
        try {

            const data = new CartDTO(cart)
            const result = await this.dao.addCart(data)
            
            return {code: 200, result: {status: "success", message: 'Carrito creado', payload: result} }
            
        } catch (error) {
            
            return {code: 500, result: {status: "error", error: error}}

        }
    }

    deleteCart = async(id) => {
        try {

            const result = await this.dao.deleteCart(id)
            
            if (result.deletedCount === 0) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Carrito eliminado'} }
            

        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            return {code: 500, result: {status: "error", error: error}}

        }
    }

    updateCart = async(pid, newcart) => {
        try {
            const result = await this.dao.updateCart(pid, newcart)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }
            
        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            return {code: 500, result: {status: "error", error: error}}

        }
    }

    addProdCart = async(cid, pid, body) => {
        try {
            let quantity = Number(body.quantity) || 1

            const result = await this.dao.addProdCart(cid, pid, quantity)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Producto agregado', payload: result} }
            
        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            
            return {code: 500, result: {status: "error", error: error}}

        }
    }

    deleteProdCart = async(cid, pid) => {
        try {
            const result = await this.dao.deleteProdCart(cid, pid)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Producto eliminado'} }
            
        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            if (error.name === 'MongoServerError' && error.code === 2) {
                return {code: 400, result: {status: "error", error: 'El producto no se encuentra en el carrito'}}
            }
            return {code: 500, result: {status: "error", error: error}}
            
        }
    }

    updateProdCart = async(cid, pid, prod) => {
        try {
            const result = await this.dao.updateProdCart(cid, pid, prod)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success",  message: 'Producto actualizado', payload: result} }
            
        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            
            return {code: 500, result: {status: "error", error: error}}
            
        }
    }

    purchase = async(cid, usernanme) => {
        try {

            let data = await this.dao.getCartById(cid)
            
            if (!data) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            const val = data.products.some(prod => {
                if (prod.product.stock >= prod.quantity) {
                    return true
                } 
            })

            if (!val) {
                return {code: 500, result: {status: "error", error: 'Los artículos seleccionados ya no se encuentran disponibles'}}
            }

            const ticket = await this.validateCart(data)
            
            if (ticket.success) {

                ticket.payload.purchaser = usernanme

                await this.updateCart(data._id, data.products)
                
                const generateTicket = await TicketService.create(ticket.payload)
                
                if (ticket.all) {
                    return {code: 200, result: {status: "success", message: 'Compra realizada', payload: generateTicket} }
                }

                return {code: 200, result: {status: "partial", message: 'Algunos productos no pudieron ser procesados', payload: generateTicket, cart: data.products} }
            }
            
            return {code: 500, result: {status: "error", error: 'No se pudo procesar la compra'}}

        } catch (error) {

            console.error(error);
            console.error(error.message);
            return {code: 500, result: {status: "error", error: error.message}}
            
        }
        
        
        
    }

    validateCart = async (data) => {
        try {

            let ticket = {
                amount:0
            }
            const prods = []

            data.products = data.products.filter((prod) => {

                    if (prod.product.stock >= prod.quantity) {

                        ticket.amount = prod.product.price * prod.quantity
                        prods.push({_id: prod.product._id, quantity: prod.quantity})
                        
                        return false

                    } else {
                        
                        return true

                    }
            })

            prods.forEach(async prod => {await ProductService.purchase(prod._id, prod.quantity)})

            const all = data.products.length === 0

            return {success: true, payload: ticket, all: all}

        } catch (error) {
            
            throw error
            
        }
    }



}
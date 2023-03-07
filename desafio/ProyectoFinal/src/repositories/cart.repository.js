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

            console.error(error);

        }
    }

    addCart = async(cart) => {
        try {
            const data = CartDTO(cart)
            const result = await this.dao.addCart(cart)
            
            return result
            
        } catch (error) {
            
            console.error(error);

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

            console.error(error);

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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
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
                return {code: 500, result: {status: "error", error: 'No se pudo procesar la compra'}}
            }
            const ticket = await this.validateCart(data)
            ticket.payload.purchaser = usernanme
            if (ticket.success) {
                const generateTicket = await TicketService.create(ticket.payload)
                
                if (ticket.all) {
                    return {code: 200, result: {status: "success", message: 'Compra realizada', payload: generateTicket} }
                }
                return {code: 200, result: {status: "partial", message: 'Algunos productos no pudieron ser procesados', payload: generateTicket} }
            }
            
            return {code: 500, result: {status: "error", error: 'No se pudo procesar la compra'}}

        } catch (error) {
            console.error(error);
        }
        
        
        
    }

    validateCart = async (data) => {
        try {

            let ticket = {
                amount:0
            }

            let all = true

            await data.products.forEach(async prod => {
                if (prod.product.stock >= prod.quantity) {
                    ticket.amount = prod.product.price * prod.quantity
                    await ProductService.purchase(prod.product._id, prod.quantity)
                    await this.deleteProdCart(data._id, prod.product._id)
                } else {
                    all = false
                }
            })

            for (let i = data.products.length; i >= 0; i--) {
                if (products[i].product.stock >= products[i].quantity){
                    ticket.amount = products[i].product.price * products[i].quantity
                }
                
            }
            

            return {success: true, payload: ticket, all: all}

        } catch (error) {
            throw error
        }
    }



}
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

            return {code: 200, result: {status: "success", payload: result} }
            
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

            return {code: 200, result: {status: "success", payload: result} }
            
        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            console.error(error);
        }
    }

    purchase = async(cid) => {
        
        const result = await this.dao.purchase(cid)

        return {code: 200, result: {status: "success", payload: result} }
        
    }

}
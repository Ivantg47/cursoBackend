const fs = require('fs')

class CartManager {

    constructor(path){
        this.path = path
    }

    getCarts = async() => {
        try{

            if(fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const cart = JSON.parse(data)

                return cart
            }

            return []

        } catch(error) {
            console.log(error);
        }
    }

    getId = async() => {
        try{
            
            const carts = await this.getCarts()
            const cont = carts.length

            return (cont > 0) ? carts[cont-1].id + 1 : 1

        } catch(error) {
            console.log(error);
        }
    }
    
    getCartById = async(id) => {
        try{
            
            const carts = await this.getCarts()
            const cart = carts.find(c => {
                return c.id === Number(id)
            })
            
            return cart
        
        } catch(error) {
            console.log(error);
        } 
    }
    
    addCart = async() => {
        try{
            
            const carts = await this.getCarts()
            let cart = {
                id: await this.getId(),
                products: []
            }
            
            carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(carts))

            return "Carrito creado"
                    
        } catch(error) {
            console.log(error);
        }
    }
    
    deleteCart = async(id) => {

    }
    
    updaeCart = async(cid, pid) => {
        try{
            
            const carts = await this.getCarts()
            const i = carts.map(uCart => uCart.id).indexOf(cid)
            
            if(i === -1){
                return null
            }
            const iP = carts[i].products.map(uProd => uProd.id).indexOf(pid)
            console.log(iP);
            if (iP !== -1) {
                carts[i].products[iP].quantity++
            } else {
                carts[i].products = {
                    id: pid,
                    quantity: 1
                }
            }
            return 'Producto agregado'
        
        } catch(error) {
            console.log(error);
        } 
    }

}

module.exports = CartManager
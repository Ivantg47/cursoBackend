import fs from 'fs'

class CartFileManager {

    constructor(){
        this.path = '../../json/carritos.json'
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
            console.error(error);
        }
    }

    getId = async() => {
        try{
            
            const carts = await this.getCarts()
            const cont = carts.length

            return (cont > 0) ? carts[cont-1].id + 1 : 1

        } catch(error) {
            console.error(error);
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
            console.error(error);
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
            console.error(error);
        }
    }
    
    deleteCart = async(id) => {
        const carts = await this.getCarts()

            if (!await this.getCartById(id)) {                
                return null
            }
            
            const filtro = carts.filter((cart) => cart.id != id)
            
            fs.promises.writeFile(this.path, JSON.stringify(filtro))
            
            return 'Carrito eliminado'
    }
    
    addProdCart = async(cid, pid) => {
        try{
            
            const carts = await this.getCarts()
            const iC = carts.map(uCart => uCart.id).indexOf(cid)
            
            if(iC === -1){
                return null
            }
            
            const iP = carts[iC].products.map(uProd => uProd.id).indexOf(pid)
            
            if (iP !== -1) {
                carts[iC].products[iP].quantity++
            } else {
                carts[iC].products.push({
                    id: pid,
                    quantity: 1
                })
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return 'Producto agregado'
        
        } catch(error) {
            console.error(error);
        } 
    }

    deleteProdCart = async(cid, pid) => {
        try{
            
            const carts = await this.getCarts()
            const iC = carts.map(uCart => uCart.id).indexOf(cid)
            
            if(iC === -1){
                return null
            }
            
            const iP = carts[iC].products.map(uProd => uProd.id).indexOf(pid)
            
            if (iP === -1) {
                return null 
            } 

            carts[iC].products[iP].quantity--
            if (carts[iC].products[iP].quantity === 0) {
                carts[iC].products = carts[iC].products.filter((prod) => prod.id != pid)
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return 'Producto eliminado'
        
        } catch(error) {
            console.error(error);
        } 
    }

}

const carrito = new CartFileManager()

export default carrito
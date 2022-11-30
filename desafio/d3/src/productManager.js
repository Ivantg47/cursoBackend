const fs = require('fs')

class ProductManager{

    constructor(path){
        this.path = path
    }

    getProducts = async() => {

        try{

            if(fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const prod = JSON.parse(data)

                return prod
            }

            return []

        } catch(error) {
            console.log(error);
        }
    }

    getId = async() => {

        try{
            
            const prods = await this.getProducts()
            const cont = prods.length

            return (cont > 0) ? prods[cont-1].id + 1 : 1

        } catch(error) {
            console.log(error);
        }
    }

    getProductById = async(id) => {

        try{
            
            const prods = await this.getProducts()
            const prod = prods.find(product => {
                // console.log(`${product.id} = ${id}  => ${typeof product.id} = ${typeof id}  => ${product.id === id} => ${product.id == id}`);
                return product.id == id
            })
            console.log(prod);
            return (typeof(prod) === "undefined") ? "Not found" : prod
        
        } catch(error) {
            console.log(error);
        }    
    }

    validateCode = async(code) => {

        try{
            
            const prods = await this.getProducts()

            return typeof(prods.find(product => {
                return product.code === code
                })) === "undefined" //false: en uso -- true: libre
        
        } catch(error) {
            console.log(error);
        }        
    }

    addProduct = async(prod) => {

        try{
            
            const prods = await this.getProducts()

            if (!await this.validateCode(prod.code)) {
                return 'Codigo en uso'
            }
            prod.id =  await this.getId()
            prods.push(prod)
            await fs.promises.writeFile(this.path, JSON.stringify(prods))

            console.log("Producto creado:");

            return prod
                    
        } catch(error) {
            console.log(error);
        }    
    }

    deleteProduct = async(id) => {

        try{
            
            const prods = await this.getProducts()

            if (typeof await this.getProductById(id) === "string") {
                
                return 'Not found'
            }
            
            const filtro = prods.filter((prod) => prod.id != id)
            
            fs.promises.writeFile(this.path, JSON.stringify(filtro))
            
            return 'Producto eliminado'
        
        } catch(error) {
            console.log(error);
        }                            
    }

    updateProduct = async(newProd) => {

        try{
            
            const prods = await this.getProducts()

            const i = prods.map(uProd => uProd.id).indexOf(newProd.id)
            
            if(i === -1){
                return 'Not found'
            }
            const g = (newProd.code == null || (await this.validateCode(newProd.code) && i != prods.map(uProd => uProd.code).indexOf(newProd.code)))
            const h = (i === prods.map(uProd => uProd.code).indexOf(newProd.code) || newProd.code == null)

            if(!(i != -1 && (g || h))){
                return 'Error al actualizar'
            }

            prods[i] = {...prods[i], ...newProd}
            
            fs.promises.writeFile(this.path, JSON.stringify(prods))

            console.log("Producto actualizado:");
            return prods[i]
        
        } catch(error) {
            console.log(error);
        }                        
    }


}

module.exports = ProductManager

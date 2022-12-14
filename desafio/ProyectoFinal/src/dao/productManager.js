import fs from 'fs'

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
                return product.id === Number(id)
            })
            
            return prod
        
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

            if (!prod.title || !prod.description || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return 'Falta llenar campos'
            }

            if (!await this.validateCode(prod.code)) {
                return 'Codigo en uso'
            }
            prod.id =  await this.getId()
            prod.price = Number.parseFloat(prod.price).toFixed(2)
            prod.status = true
            prods.push(prod)
            await fs.promises.writeFile(this.path, JSON.stringify(prods))

            return "Producto creado"
                    
        } catch(error) {
            console.log(error);
        }    
    }

    deleteProduct = async(id) => {

        try{
            
            const prods = await this.getProducts()

            if (!await this.getProductById(id)) {                
                return null
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
                return null
            }
            const g = (newProd.code == null || (await this.validateCode(newProd.code) && i != prods.map(uProd => uProd.code).indexOf(newProd.code)))
            const h = (i === prods.map(uProd => uProd.code).indexOf(newProd.code) || newProd.code == null)

            if(!(g || h)){
                return 'Codigo en uso'
            }

            prods[i] = {...prods[i], ...newProd}
            
            fs.promises.writeFile(this.path, JSON.stringify(prods))

            //console.log("Producto actualizado:");
            //return prods[i]
            return "Producto actualizado"
        
        } catch(error) {
            console.log(error);
        }                        
    }

}

const producto = new ProductManager('./src/json/producto.json')

export default producto

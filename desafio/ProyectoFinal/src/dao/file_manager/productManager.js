import { count } from 'console'
import fs from 'fs'
import __dirname from '../../utils.js'

class ProductManager{

    constructor(){
        this.path = __dirname + '/json/producto.json'
        this.init()
    }

    init = () => {
        try {
            let file = fs.existsSync(this.path,'utf-8')
            if (!file) {
                fs.writeFileSync(this.path,JSON.stringify([]))
            }
            return null
        } catch(error) {
            console.error(error);
        }
    }

    getProducts = async(query, pagination) => {

        try{
            
            const data =  JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            let index, limit
            if (pagination.page == 1) {
                index = 0
                limit = pagination.limit
            } else {
                index = pagination.page * pagination.limit - pagination.limit
                limit = index + pagination.limit
            }
            let total = Math.ceil(data.length / pagination.limit)

            const prods = {
                status: 'success',
                isValid: !(pagination.page <= 0 || pagination.page>total || data.length === 0),
                payload: data.slice(index, limit),
                totalPages: total, 
                page: pagination.page, 
                hasPrevPage: pagination.page !== 1, 
                hasNextPage:  pagination.page < total
            }
            
            if (!prods.isValid) {
                prods.status = 'error'
            }

            return prods

        } catch(error) {
            console.error(error);
        }
    }

    getId = async() => {

        try{
            console.log('id');
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const cont = prods.length
            console.log(cont);
            return (cont > 0) ? prods[cont-1]._id + 1 : 1

        } catch(error) {
            console.error(error);
        }
    }

    getProductById = async(id) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const prod = prods.find(product => {
                return product._id === Number(id)
            })
            
            if (!prod) {
                return null
            }
            return prod
        
        } catch(error) {
            console.error(error);
        }    
    }

    validateCode = async(code) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            return typeof(prods.find(product => {
                return product.code === code
                })) === "undefined" //false: en uso -- true: libre
        
        } catch(error) {
            console.error(error);
        }        
    }

    addProduct = async(prod) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            if (!prod.title || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return 'Falta llenar campos'
            }

            if (!await this.validateCode(prod.code)) {
                return 'Codigo en uso'
            }
            prod._id =  await this.getId()
            prod.status = true
            prod.price = Number(prod.price)
            prod.stock = Number(prod.stock)
            prods.push(prod)
            
            await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 4))
            
            return prod
                    
        } catch(error) {
            console.error(error);
        }    
    }

    deleteProduct = async(id) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            if (!await this.getProductById(id)) {                
                return null
            }
            
            const filtro = prods.filter((prod) => prod.id != id)

            fs.promises.writeFile(this.path, JSON.stringify(filtro))
            
            return {success: true, product: 'Producto eliminado'}
        
        } catch(error) {
            console.error(error);
        }                            
    }

    updateProduct = async(pid, newProd) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            const i = prods.map(uProd => uProd.id).indexOf(pid)

            if(i === -1){
                return null
            }
            const g = (newProd.code == null || (await this.validateCode(newProd.code) && i != prods.map(uProd => uProd.code).indexOf(newProd.code)))
            const h = (i === prods.map(uProd => uProd.code).indexOf(newProd.code) || newProd.code == null)

            if(!(g || h)){
                return {success: false, product: 'Codigo en uso'}
            }
   
            if (!(typeof newProd.id === "undefined" || prods[i].id === newProd.id)) {
                return {success: false, product: 'No se puede cambiar el id'}
            }
            for (const j of Object.keys(newProd)) {
                prods[i][j] = newProd[j]
            }
            
            fs.promises.writeFile(this.path, JSON.stringify(prods))

            return {success: true, product: 'Producto actualizado'}
        
        } catch(error) {
            console.error(error);
        }                        
    }

    paginate = async () => {

    }

}

const producto = new ProductManager('./src/json/producto.json')

export default producto

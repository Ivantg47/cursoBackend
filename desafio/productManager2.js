const fs = require('fs')

class ProductManager{

    //static #idGeneral = 1

    constructor(){
        this.path = 'producto.json'
        this.products = [] //JSON.parse(fs.readFileSync(this.path, 'utf-8'))    
    }

    addProduct = (title = '', description  = '', price = 0, thumbnail  = '', code  = '', stock  = 0) => {
        
        if(title.trim().length != 0){
            if (description.trim().length != 0) {
                if (price > 0 && typeof(price) === "number") {
                    if (thumbnail.trim().length === 0){
                        thumbnail = 'Sin imagen'
                    }                   
                    if (code.trim().length != 0 && this.validateCode(code)) {
                        if(Number.isInteger(stock) && stock >= 0){
                            const product = {

                                id: this.getId(),
                                title,
                                description,
                                price,
                                thumbnail,
                                code,
                                stock
                
                            }
                    
                            this.products.push(product)

                            fs.promises.writeFile(this.path, JSON.stringify(this.products))
                                .then(() => {
                                    console.log('Producto guardado');
                                })
                                .catch(e => {
                                    console.log('error', e);
                                })

                        } else {
                            console.log("Las existencias deben ser ingresadas en valores entero y debe mayor o igual a 0");
                        }
                        
                    } else {
                        console.log("El codigo no ha sido introducido o ya se encuentra en uso");
                    }
                    
                } else {
                    console.log("Se debe introducir un valor numerico mayor a 0");
                }
            } else {
                console.log("Se debe introducir una descripcion");
            }
        } else {
            console.log("Se debe introducir un nombre para el producto");
        }
        
        
    }

    getProducts = () => {

        try {
            const contenido = fs.readFileSync(this.path, 'utf-8')
            // this.products = JSON.parse(contenido)
            // return this.products
            return JSON.parse(contenido)
        } catch (e) {
            console.error('error', e);
        }
       
    }

    getId = () => {
        const cont = this.products.length
        const nID = (cont > 0) ? this.products[cont-1].id + 1 : 1

        return nID

        // const cont = this.products.length
        // return (cont > 0) ? ProductManager.#idGeneral++ : ProductManager.#idGeneral


    }

    validateCode = (code) => {
        return typeof(this.products.find(product => { 
            return product.code === code
            })) === "undefined" //false: en uso -- true: libre
    }

    getProductById = (id) => {
        
        const prod = this.getProducts().find(product => { 
            return product.id === id
        })

        return (typeof(prod) === "undefined") ? "Not found" : prod
        
    }

    updateProduct = (newProd) => {

        try{   
             this.products = this.getProducts()

            const i = this.products.map(uProd => uProd.id).indexOf(newProd.id) 
            if(i != -1){
                const g = (this.validateCode(newProd.code) && i != this.products.map(uProd => uProd.code).indexOf(newProd.code))
                const h = (i === this.products.map(uProd => uProd.code).indexOf(newProd.code))
                //console.log(`val: ${g} ver: ${h}  if: ${(g || h)}  code: 002 n: ${newProd.code}`);
                if((h || g)){
                    
                    this.products[i] = newProd
                    fs.promises.writeFile(this.path, JSON.stringify(this.products))
                                            .then(() => {
                                                console.log('Producto actualizado');
                                            })
                                            .catch(e => {
                                                console.log('error', e);
                                        })
                } else {
                    console.log('Codigo en uso');
                }
            } else {
                console.log('Not found');
            }
        }  catch(e) {
            console.error('error', e);
        }      
    }

    deleteProduct = (id) => {

        try{
            
            const productos = this.getProducts()
            
            if (typeof this.getProductById(id) !== "string") {
                console.log('encontro');
                this.products = productos.filter((prod) => prod.id != id)
                //console.log(filtro);
                fs.promises.writeFile(this.path, JSON.stringify(filtro))
                                        .then(() => {
                                            console.log('Producto eliminado');
                                        })
                                        .catch(e => {
                                            console.log('error', e);
                                    })
            } else {
                console.log('Not found');
            }          

        } catch(e) {
            console.error('error', e);
        }
        
    }

}

let producto = new ProductManager

// producto.addProduct("pc", "computador", 10000, "Sin imagen", "001", 3)
// producto.addProduct("tableta", "computador", 5000, "Sin imagen", "002", 5)
// producto.addProduct("ps4", "juego", 7000, "", "003")
// producto.addProduct("ps5", "juego", 15000, "", "004", 10)

// producto.addProduct()
// producto.addProduct("ps5")
// producto.addProduct("ps5", "juego")
// producto.addProduct("ps5", "juego", 15000) 
// producto.addProduct("ps5", "juego", 15000, "", "001")
// producto.addProduct("ps5", "juego", 15000, "", "004", -10)
// producto.addProduct("ps5", "juego", 15000, "", "004", '10')


//producto.getProducts()
//console.log(producto.getProductById(2));
//console.log('hola: ', producto.getProducts());
//console.log('--------------------------');
// console.log('hola: ', producto.getProducts());


//producto.getProductById(2)
// producto.updateProduct(2)
//producto.deleteProduct(8)
//producto.deleteProduct(2)
//console.log('hola: ', producto.products);
//console.log('hola: ', producto.getProductById(2));

// let product = {

//     id:2,
//     title:"tableta",
//     description:"computador",
//     price:1000,
//     thumbnail:"Sin imagen",
//     code:"002",
//     stock:7

// }

// let product2 = {

//     id:2,
//     title:"tableta",
//     description:"computador",
//     price:1000,
//     thumbnail:"Sin imagen",
//     code:"003",
//     stock:7

// }

// let product3 = {

//     id:2,
//     title:"tableta",
//     description:"computador",
//     price:1000,
//     thumbnail:"Sin imagen",
//     code:"0030",
//     stock:7

// }

//console.log(producto.validateCode('003'));
//console.log(producto.updateProduct(product));
// console.log(producto.updateProduct(product2));
// console.log(producto.updateProduct(product3));
//console.log('hola: ', producto.getProductById(2));
console.log('hola: ', producto.products);
const fs = require('fs')

class ProductManager{

    //static #idGeneral = 1

    constructor(){
        this.products = []
        this.path = 'producto.json'
    }

    addProduct = (title = '', description  = '', price = 0, thumbnail  = '', code  = '', stock  = 0) => {
        
        if(title.trim().length != 0){
            if (description.trim().length != 0) {
                if (price > 0 && typeof(price) === "number") {
                    if (thumbnail.trim().length === 0){
                        thumbnail = 'Sin imagen'
                    }                   
                    if (code.trim().length != 0 && typeof(this.products.find(product => { 
                                                            return product.code === code
                                                            })) === "undefined") {
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
                            
                            // fs.promises.appendFile(this.path, ',' + JSON.stringify(product))
                            //     .then(() => {
                            //         console.log('BD salvado');
                            //     })
                            //     .catch(e => {
                            //         console.log('error', e);
                            //     })
                    
                            this.products.push(product)

                            fs.promises.writeFile(this.path, JSON.stringify(this.products))
                                .then(() => {
                                    console.log('BD salvado');
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

        const pro =fs.promises.readFile(this.path, 'utf-8')
            .then(contenido => {
                console.log(contenido);
                // const prod = JSON.parse(contenido)
                // console.log('PARSE: ', prod);
                JSON.parse(contenido)   
            })
            .catch(e => {
                console.log('error', e);
            })

        // const prod = fs.readFileSync(this.path, 'utf-8')
        // console.log(prod);
        // console.log(JSON.parse(prod));
        return pro
    }

    getId = () => {
        const cont = this.products.length
        const nID = (cont > 0) ? this.products[cont-1].id + 1 : 1

        return nID

        // const cont = this.products.length
        // return (cont > 0) ? ProductManager.#idGeneral++ : ProductManager.#idGeneral


    }

    getProductById = (id) => {
        
        const prod = this.products.find(product => { 
            return product.id === id
        })

        console.log((typeof(prod) === "undefined") ? "Not found" : prod);
    }

    // updateProduct = (id) => {

    // }

    // deleteProduct = (id) => {
        
    // }

}

let producto = new ProductManager

// producto.addProduct("pc", "computador", 10000, "Sin imagen", "001", 3)
// producto.addProduct("tableta", "computador", 5000, "Sin imagen", "002", 5)
// producto.addProduct()
// producto.addProduct("ps5")
// producto.addProduct("ps5", "juego")
// producto.addProduct("ps5", "juego", 15000) 
// producto.addProduct("ps5", "juego", 15000, "", "001")
// producto.addProduct("ps4", "juego", 7000, "", "003")
// producto.addProduct("ps5", "juego", 15000, "", "004", -10)
// producto.addProduct("ps5", "juego", 15000, "", "004", '10')
// producto.addProduct("ps5", "juego", 15000, "", "004", 10)

producto.getProducts()
console.log('--------------------------');
console.log(producto.getProducts());
// producto.getProductById(10)
// producto.getProductById(3)
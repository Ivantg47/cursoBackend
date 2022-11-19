class ProductManager{

    static #idGeneral = 1

    constructor(){
        this.products = []
    }

    addProduct = (title = '', description  = '', price = 0, thumbnail  = 'Sin imagen', code  = '', stock  = 0) => {
        
        if(title.trim().length != 0){
            if (description.trim().length != 0) {
                if (price > 0 && typeof(price) === "number") {                    
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
                    
                            this.products.push(product)
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

        return this.products

    }

    getId = () => {
        // const cont = this.products.length
        // const nID = (cont > 0) ? this.products[cont-1].id + 1 : 1

        // return nID

        const cont = this.products.length
        const nID = (cont > 0) ? ProductManager.#idGeneral + 1 : ProductManager.#idGeneral 
        console.log(nID);
        return (cont > 0) ? ProductManager.#idGeneral++ : ProductManager.#idGeneral

    }

    getProductById = (id) => {
        
        const prod = this.products.find(product => { 
            return product.id === id
        })

        console.log((typeof(prod) === "undefined") ? "Not found" : prod);
    }

}

let producto = new ProductManager

producto.addProduct("pc", "computador", 10000, "Sin imagen", "001", 3)
producto.addProduct("tableta", "computador", 5000, "Sin imagen", "002", 5)
// producto.addProduct()
// producto.addProduct("ps5")
// producto.addProduct("ps5", "juego")
producto.addProduct("ps5", "juego", 15000) 
producto.addProduct("ps5", "juego", 15000, "", "001")
producto.addProduct("ps4", "juego", 7000, "", "003")
// producto.addProduct("ps5", "juego", 15000, "", "004", -10)
// producto.addProduct("ps5", "juego", 15000, "", "004", '10')
// producto.addProduct("ps5", "juego", 15000, "", "004", 10)

// console.log(producto.getProducts());
producto.getProductById(10)
producto.getProductById(3)
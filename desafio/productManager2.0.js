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
                return product.id === id
            })

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
                console.log('Codigo en uso');
                return
            }
            prod.id =  await this.getId()
            prods.push(prod)
            await fs.promises.writeFile(this.path, JSON.stringify(prods))

            return prods
        
        } catch(error) {
            console.log(error);
        }    
    }

    deleteProduct = async(id) => {

        try{
            
            const prods = await this.getProducts()

            if (typeof await this.getProductById(id) === "string") {
                console.log('Not found');
                return
            }
            // console.log('elimina: ');
            const filtro = prods.filter((prod) => prod.id != id)
            // console.log(filtro);
            fs.promises.writeFile(this.path, JSON.stringify(filtro))
                                    .then(() => {
                                        console.log('Producto eliminado');
                                    })
                                    .catch(e => {
                                        console.log('error', e);
                                    })
            
            return filtro
        
        } catch(error) {
            console.log(error);
        }                            
    }

    updateProduct = async(newProd) => {

        try{
            
            const prods = await this.getProducts()

            const i = prods.map(uProd => uProd.id).indexOf(newProd.id)
            console.log(i);
            if(i === -1){
                console.log('Not found');
                return
            }
            const g = (await this.validateCode(newProd.code) && i != prods.map(uProd => uProd.code).indexOf(newProd.code))
            const h = (i === prods.map(uProd => uProd.code).indexOf(newProd.code))
            console.log(`v id: ${prods[i].id} sto: ${prods[i].stock}`);
            console.log(`n id: ${newProd.id} sto: ${newProd.stock}`);
            console.log(`nuevo: ${g}    igual: ${h}    libre: ${(g || h)}    code: ${newProd.code}`);
            console.log(`existe id: ${(i != -1)}    codigo libre: ${(g || h)}    cambio: ${i && (g || h)}`);
            if(!(i && (g || h))){
                console.log('Error al actualizar');
                return
            }

            prods[i] = {...prods[i], ...newProd}
            console.log(`nv id: ${prods[i].id} sto: ${prods[i].stock}`);
            fs.promises.writeFile(this.path, JSON.stringify(prods))
                                    .then(() => {
                                        console.log('Producto actualizado');
                                    })
                                    .catch(e => {
                                        console.log('error', e);
                                })

            return prods
        
        } catch(error) {
            console.log(error);
        }                        
    }


}



const run = async() => {

    const producto = new ProductManager('./producto.json')

    //console.log(await producto.getProducts());

    // await producto.addProduct({
    //     id: null,
    //     title:"PC",
    //     description:"computador",
    //     price:10000,
    //     thumbnail:"Sin imagen",
    //     code:"001",
    //     stock:3
    // })

    // await producto.addProduct({
    //     id: null,
    //     title: 'tableta',
    //     description: 'computador',
    //     price: 5000,
    //     thumbnail: 'Sin imagen',
    //     code: '002',
    //     stock: 5
    // })

    // await producto.addProduct({
    //     id: null,
    //     title: 'ps4',
    //     description: 'juego',
    //     price: 7000,
    //     thumbnail: 'Sin imagen',
    //     code: '003',
    //     stock: 0
    // })

    // await producto.addProduct({
    //     id: null,
    //     title: 'ps5',
    //     description: 'juego',
    //     price: 15000,
    //     thumbnail: 'Sin imagen',
    //     code: '004',
    //     stock: 10
    // })

    // await producto.addProduct({
    //     id: null,
    //     title:"P90",
    //     description:"computador",
    //     price:5000,
    //     thumbnail:"Sin imagen",
    //     code:"007",
    //     stock:1
    // })

    // await producto.addProduct({
    //     id: null,
    //     title:"RTX",
    //     description:"computador",
    //     price:20000,
    //     thumbnail:"Sin imagen",
    //     code:"005",
    //     stock:2
    // })

    // console.log(await producto.getProducts());
    // console.log(await producto.getProductById(3));
    // console.log(await producto.getProductById(2));
    // await producto.deleteProduct(6);
    // console.log(await producto.getProductById(3));
    // console.log(await producto.getProducts());

    await producto.updateProduct({
        id: 20,
        stock: 0
    })

    await producto.updateProduct({
        id: 1,
        stock: 10
    })

    // await producto.updateProduct({
    //     id: 3,
    //     title: 'ps4',
    //     description: 'juego',
    //     price: 7000,
    //     thumbnail: 'Sin imagen',
    //     code: '003',
    //     stock: 0
    // })

    // await producto.updateProduct({
    //     id: 2,
    //     title: 'ps4',
    //     description: 'juego',
    //     price: 7000,
    //     thumbnail: 'Sin imagen',
    //     code: '0030',
    //     stock: 0
    // })

    // await producto.updateProduct({
    //     id: 3,
    //     title: 'ps4',
    //     description: 'juego',
    //     price: 7000,
    //     thumbnail: 'Sin imagen',
    //     code: '004',
    //     stock: 0
    // })

    //console.log(await producto.getProductById(1));
    //console.log(await producto.getProducts());

}

console.log(run());




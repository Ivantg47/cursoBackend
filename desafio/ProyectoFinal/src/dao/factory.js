import credentials from "../config/credentials.js";
import mongoose from "mongoose";

export let Products
export let Carts
export let Chat

switch (credentials.PERCISTRENCE) {

    case 'MONGO':
        console.log('Mongo connect');
        
        mongoose.set('strictQuery', false)
        mongoose.connect(credentials.MONGO_URL, {dbname: credentials.BD_NAME},  error => {
            if (error) {
                console.error('No connect', error);
                process.exit()
            }
        })

        const { default: ProductsMongo } = await import('./bd_manager/mogo/productManagerBD.js')
        const { default: CartsMongo } = await import('./bd_manager/mogo/cartManagerBD.js')
        const { default: ChatMongo } = await import('./bd_manager/mogo/chatManagerBD.js')

        Products = ProductsMongo
        Carts = CartsMongo
        Chat = ChatMongo
        
        break;

    case 'FILE':
        console.log('File percistance');

        const { default: ProductsFile } = await import('./file_manager/productManager.js')
        const { default: CartsFile } = await import('./file_manager/cartManager.js')
        //const { default: ChatFile } = await import('./file_manage')

        Products = ProductsFile
        Carts = CartsFile
        //Chat = ChatFile
        
        break;
    default:
        console.log('Memory percistance');
        break;
}
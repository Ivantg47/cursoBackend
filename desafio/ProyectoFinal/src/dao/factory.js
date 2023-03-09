import config from "../config/config.js";
import mongoose from "mongoose";
import FileStore from "session-file-store"
import MongoStore from 'connect-mongo'
import session from 'express-session'
import __dirname from "../utils.js";

export let Products
export let Carts
export let Chat
export let Session
export let User
export let Ticket

switch (config.PERCISTRENCE) {

    case 'MONGO':
        console.log('Mongo connect');
        
        mongoose.set('strictQuery', false)
        mongoose.connect(config.MONGO_URL, {dbname: config.BD_NAME,
        autoIndex: true},  error => {
            if (error) {
                console.error('No connect', error);
                process.exit()
            }
        })


        const { default: ProductsMongo } = await import('./bd_manager/mogo/productManagerBD.js')
        const { default: CartsMongo } = await import('./bd_manager/mogo/cartManagerBD.js')
        const { default: ChatMongo } = await import('./bd_manager/mogo/chatManagerBD.js')
        const { default: UserMongo } = await import('./bd_manager/mogo/userManagerBD.js')
        const { default: TicketMongo } = await import('./bd_manager/mogo/ticketManagerBD.js')

        Session = {
            secret: config.SESSION_SECRET,
            store: MongoStore.create({
                mongoUrl: config.MONGO_URL,
                dbName: config.BD_NAME,
                mongoOptions: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                ttl: 100
            })
        }

        Products = ProductsMongo
        Carts = CartsMongo
        Chat = ChatMongo
        User = UserMongo
        Ticket = TicketMongo

        break;

    case 'FILE':
        console.log('File percistance');
        const fileStore = FileStore(session)
        const { default: ProductsFile } = await import('./file_manager/product_fileManager.js')
        const { default: CartsFile } = await import('./file_manager/cart_fileManager.js')
        const { default: ChatFile } = await import('./file_manager/chat_fileManager.js')
        const { default: UserFile } = await import('./file_manager/user_fileManage.js')
        const { default: TicketFile } = await import('./file_manager/ticket_fileManager.js')

        Session = {
            secret: config.SESSION_SECRET,
            store: new fileStore({path: __dirname + '/json/sessions.json', ttl:100, retries:0}),
            resave: false,
            saveUninitialized: false
        }

        Products = ProductsFile
        Carts = CartsFile
        Chat = ChatFile
        User = UserFile
        Ticket = TicketFile

        break;
    default:
        console.log('Memory percistance');

        Session = {
            secret: config.SESSION_SECRET,
            resave: true,
            saveUninitialized: true
        }

        break;
}
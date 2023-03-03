import { CartService } from "../repositories/index.js";
import MiRouter from "./router.js";
import nodemailer from 'nodemailer'
import __dirname from "../utils.js";

export default class CartRouter extends MiRouter {

    init () {
        this.get('/', ["PUBLIC"], async (req, res, next) => {
            try {
                const cart = await CartService.getCarts()

                return res.status(cart.code).send(cart.result)
            } catch (error) {
                console.error(error);
            }
        })

        this.get('/:cid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.getCartById({_id: cid})
                
                return res.status(cart.code).send(cart.result)

            } catch (error) {
                console.error(error);
                return next()
            }
        })

        this.post('/', ["PUBLIC"], async (req, res, next) => {
            try {
                const cart = await CartService.addCart()
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                console.error(error);
                return next()
            }
        })

        this.delete('/:cid', ["USER"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.deleteCart(cid)

                return res.status(cart.code).send(cart.result)

            } catch(error) {
                console.error(error);
                return next()
            }
        })

        this.put('/:cid', ["USER"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.updateCart(cid, req.body)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                console.error(error);
                return next()
            }
        })

        this.post('/:cid/product/:pid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const { pid } = req.params
                const cart = await CartService.addProdCart({_id: cid}, {_id: pid}, req.body)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                console.error(error);
                return next()
            }
        })

        this.delete('/:cid/product/:pid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const { pid } = req.params
                const cart = await CartService.deleteProdCart({_id: cid}, pid)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                console.error(error);
                return next()
            }
        })

        this.put('/:cid/product/:pid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const { pid } = req.params

                const cart = await CartService.updateProdCart({_id: cid}, pid, req.body)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                console.error(error);
                return next()
            }
        })

        this.get('/:cid/purchase', ["PUBLIC"], async (req, res, next) => {
            try {
                console.log('purchase');
                const { cid } = req.params
                const cart = await CartService.purchase(cid)
                
                return res.status(cart.code).send(cart.result)

            } catch (error) {
                console.error(error);
                return next()
            }
        })

        this.get('/:cid/mail',  ["PUBLIC"],async (req, res, next) => {

            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: 'ivan.toga93@gmail.com',
                    pass: 'hciuvvisniyyhtsr'
                }
            })

            const result = await transport.sendMail({
                from: 'ivan.toga93@gmail.com',
                to: 'ivan.toga93@gmail.com',
                subject: 'Saludo',
                html: `
                    <div>
                        <h1>Hola mundo!!</h1>
                        <img src:"cid:" />
                    </div>
                    `,
                attachments: [{
                    filename: 'mundo.jpg',
                    path: './public/img/mundo.jpg',
                    cid: 'mundo'
                }]
            })

            console.log(result);

            res.send('envio')
        })
    }
}
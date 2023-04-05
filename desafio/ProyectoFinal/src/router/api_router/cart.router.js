import { CartService } from "../../repositories/index_repository.js";
import MiRouter from "../router.js";
import nodemailer from 'nodemailer'
import __dirname from "../../utils.js";
import config from "../../config/config.js";

export default class CartRouter extends MiRouter {

    init () {
        this.get('/', ["PUBLIC"], async (req, res, next) => {
            try {
                const cart = await CartService.getCarts()

                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
            }
        })

        this.get('/:cid', ["PUBLIC"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.getCartById(cid)
                
                return res.status(cart.code).send(cart.result)

            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.post('/', ["PUBLIC"], async (req, res, next) => {
            try {
                const cart = await CartService.addCart()
                
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.delete('/:cid', ["USER"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.deleteCart(cid)

                return res.status(cart.code).send(cart.result)

            } catch(error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.put('/:cid', ["USER"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.updateCart(cid, req.body)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.post('/:cid/product/:pid', ["USER"], async (req, res, next) => {
            try {
                const { cid, pid } = req.params
                const { quantity } = req.body

                if (req.session.user.role == 'premium') {
                    const p = await ProductService.getProductById(pid)
                    if (p.owner == req.session.user.email) {
                        return res.status(401).send({status: "error", message: 'Sin autorización'})
                    }
                }
                const cart = await CartService.addProdCart(cid, pid, quantity)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.delete('/:cid/product/:pid', ["USER"], async (req, res, next) => {
            try {
                const { cid, pid } = req.params

                const cart = await CartService.deleteProdCart(cid, pid)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.put('/:cid/product/:pid', ["USER"], async (req, res, next) => {
            try {
                const { cid, pid } = req.params
                const { quantity } = req.body

                const cart = await CartService.updateProdCart(cid, pid, quantity)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.get('/:cid/purchase', ["USER"], async (req, res, next) => {
            try {
                
                const { cid } = req.params
                const email = req.session.user?.email
                
                const cart = await CartService.purchase(cid, email)
                
                return res.status(cart.code).send(cart.result)

            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

    }
}
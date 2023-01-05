import express from 'express'
import mongoose from 'mongoose'
import { cartModel } from '../models/cart.model.js'
import { productModel } from '../models/product.model.js'


const router = express.Router()

router.get('/', async(req, res) => {
    // res.send('ok')
    try {
        const prod = await productModel.find()
        res.send({
            result: 'success',
            payload: prod
        })
    } catch (error) {
        console.error('Cant get product', error);
    }
})

router.post('/', async(req, res) => {
    try {
        const result = await productModel.create(req.body)
        res.send({
            result: 'success',
            payload: result
        })
    } catch (error) {
        console.error('Cant add product', error);
    }
})

router.put('/:uuid', async (req, res) => {
    const { uuid } = req.params

    const productToReplace = req.body

    const result = await productModel.updateOne({_id: uuid}, productToReplace)

    res.send({status: 'success', payload: result})
})

router.post('/cart', async(req, res) => {
    try {
        const result = await cartModel.create(req.body)
        res.send({
            result: 'success post',
            payload: result
        })
    } catch (error) {
        console.error('Cant add product', error);
    }
})

router.get('/cart', async(req, res) => {
    // res.send('ok')
    try {
        const cart = await cartModel.find()
        res.send({
            result: 'success get',
            payload: cart
        })
    } catch (error) {
        console.error('Cant get carts', error);
    }
})

router.post('/cart/:cid/product/:pid', async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    console.log( `c: ${typeof cid} p: ${typeof pid}`);

    const cart = await cartModel.find({_id: cid, "product.id": pid})
    // if (cart) {
    //     const prod = await cartModel.find({_id: cid, "product.id": pid})
    //     if (prod) {
    //         prod.qu
    //     }
    // }
    res.send({status: 'success', payload: cart})
})
export default router


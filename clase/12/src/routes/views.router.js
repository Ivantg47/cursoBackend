import express from 'express'
import mongoose from 'mongoose'
import { productModel } from '../models/product.model.js'


const router = express.Router()

router.get('/', async(req, res) => {
    // res.send('ok')
    try {
        console.log('hola');
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

export default router


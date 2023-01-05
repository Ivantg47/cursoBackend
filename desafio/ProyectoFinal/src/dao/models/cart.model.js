import mongoose from "mongoose";

const cartCollection = 'carts' 

const cartSchema = new mongoose.Schema({
    product: [{
        //id: mongoose.Schema.Types.ObjectId,
        id: {type: mongoose.Types.ObjectId, ref: 'products'},
        quantity: Number
    }]
})

export const cartModel = mongoose.model(cartCollection, cartSchema)
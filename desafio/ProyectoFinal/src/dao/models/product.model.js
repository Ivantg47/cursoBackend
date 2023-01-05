import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    description: { type: String, required: true, trim: true},
    price: Number,
    thumbnail: [{type: String}],
    code: { type: String, required: true, trim: true, unique: true},
    stock: Number,
    category: String,
    status: Boolean
})

export const productModel = mongoose.model(productCollection, productSchema)
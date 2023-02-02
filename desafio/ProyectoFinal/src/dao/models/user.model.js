import mongoose from "mongoose";

const userCollection = 'users' 

const userSchema = new mongoose.Schema({
    first_name: { type: String, trim: true},
    last_name: { type: String, trim: true},
    email:{ type: String, unique: true},
    password: { type: String, trim: true},
    age:{ type: Number, trim: true},
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts'
    },
    role:{ type: String, trim: true, default: 'user'},
    method: { type: String, trim: true}
})

export const userModel = mongoose.model(userCollection, userSchema)
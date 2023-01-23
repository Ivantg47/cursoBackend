import mongoose from "mongoose";

const userCollection = 'users' 

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true},
    last_name: { type: String, required: true, trim: true},
    email:{ type: String, required: true},
    password: { type: String, required: true} 
})

export const userModel = mongoose.model(userCollection, userSchema)
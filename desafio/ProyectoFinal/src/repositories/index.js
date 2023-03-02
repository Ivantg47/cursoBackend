import { Carts, Products, User } from "../dao/factory.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from './product.repository.js'
import UserRepository from "./user.repository.js";

export const ProductService = new ProductRepository(Products)
export const CartService = new CartRepository(Carts)
export const UserService = new UserRepository(User)
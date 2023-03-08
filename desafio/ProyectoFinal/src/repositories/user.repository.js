import UserDTO from '../dao/DTO/user.dto.js'
import { CartService } from "./index.js"

export default class UserRepository {

    constructor (dao) {
        this.dao = dao
    }

    getUsers = async () => {

        const result = await this.dao.getUsers()

        return result
    }

    getUserById = async(id) => {
        
        const result = await this.dao.getUserById(id)

        return result
    }

    getUserByEmail = async(username) => {
        
        const result = await this.dao.getUserById(username)

        return result
    }

    addUser = async(user) => {
        const cart = await CartService.addCart()
        
        user.cart = cart.result.payload._id
        const data = UserDTO(user)
        const result = this.dao.create(data)

        return result
    }

    deleteUser = async(username) => {

        const result = this.dao.delete(username)

        return result
    }

    updateUser = async(username, newUser) => {

        const result = this.dao.update(username, newUser)

        return result
    }

}
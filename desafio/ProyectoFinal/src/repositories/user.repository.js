import UserDTO from '../dao/DTO/user.dto.js'
import { CartService } from "./index_repository.js"
import Mail from '../modules/mail.js'

export default class UserRepository {

    constructor (dao) {
        this.dao = dao
        this.mail = new Mail()
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
        
        const result = await this.dao.getUserByEmail(username)

        return result
    }

    addUser = async(user) => {
        console.log('hola user rep');
        const cart = await CartService.addCart()
        
        user.cart = cart.result.payload._id
        const data = new UserDTO(user)
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

    sendMail = async (username, html, subject) => {
        const user = await this.dao.getUserByEmail(username)

        if (user) {
            this.mail.send(user, subject, html)
        }
        
    }

}
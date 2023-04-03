import UserDTO from '../dao/DTO/user.dto.js'
import { CartService } from "./index_repository.js"
import Mail from '../modules/mail.js'
import logger from '../utils/logger.js'

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
        try {
            const result = this.dao.update(username, newUser)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            
            return {code: 200, result: {status: "success", message: 'Usuario actualizado', payload: result} }

        } catch (error) {
            logger.error(error)
        }
        

        return result
    }

    sendMail = async (username, html, subject) => {
        const user = await this.dao.getUserByEmail(username)

        if (user) {
            this.mail.send(user, subject, html)
        }
        
    }

    setUserRole = async(username) => {
        
        try {
            const user = await this.dao.getUserById(username)

            if (!user) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            user.role = user.role == 'user' ? 'premium' : 'user'

            const result = await this.dao.update(username, user)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            logger.debug(result)
            return {code: 200, result: {status: "success", message: 'Role actualizado', payload: result} }

        } catch (error) {
            logger.error(error.message)
        }
    }

}
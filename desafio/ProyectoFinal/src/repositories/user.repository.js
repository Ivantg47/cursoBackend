import UserDTO from '../DTO/user.dto.js'
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
        
        if (!result) {
            return {code: 404, result: {status: "error", error: 'Not found'}}
        }

        result.forEach(user => {
            delete user.password
            delete user.cart
            delete user.documents
        });
        
        return {code: 200, result: {status: "success", payload: result} }
        
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
        
        const cart = await CartService.addCart()
        
        user.cart = cart.result.payload._id || cart.result.payload.id
        const data = new UserDTO(user)
        const result = await this.dao.create(data)
        
        return result
    }

    deleteUser = async(username) => {

        const result = await this.dao.delete(username)

        return result
    }

    updateUser = async(username, newUser) => {
        try {
            const result = await this.dao.update(username, newUser)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            delete result.password
            return {code: 200, result: {status: "success", message: 'Usuario actualizado', payload: result} }

        } catch (error) {
            logger.error(error.message)
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
            
            if (user.documents === 3 && user.role == 'user') {
                user.role = 'premium'    
            } else if (user.role == 'premium') {
                user.role = 'user'
            } else {
                return {code: 400, result: {status: "Error", message: 'El usuario no cuenta con todos los documentos para cambiar a premium', payload: user.documents} }
            }
            
            
            const result = await this.dao.update(username, user)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            //logger.debug(JSON.stringify(result))
            delete result.password

            return {code: 200, result: {status: "success", message: 'Role actualizado', payload: result} }

        } catch (error) {
            logger.error(error.message)
            logger.error(error)
        }
    }

    limpiar = async () => {
        try {
            
            const users = await this.dao.getUsers()
            
            for (let i = 0; i < users.length; i++) {
                const date1 = new Date(users[i].last_connection);
                const date2 = new Date()
                if ((date2 - date1)/86400000 > 2) {
                    await this.sendMail(users[i].email, html, "Cuenta eliminada")                   
                    await this.dao.deleteUser(users[i].id)
                    console.log(`Usuario con id: ${users[i].id} fue eliminado`);
                }

                
            }

            return {code: 200, result: {status: "success", message: 'Role actualizado', payload: users} }
        } catch (error) {
            logger.error(error)
        }
    }

}
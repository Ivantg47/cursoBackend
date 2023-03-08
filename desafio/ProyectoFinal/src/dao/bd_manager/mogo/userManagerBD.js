import { userModel } from "./models/user.model.js"

class UserManager {

    constructor () {
    }

    getUsers = async () => {

        try {
            
            const result = await userModel.find().lean().exec()

            return result

        } catch (error) {

            throw error

        }
    }

    getUserById = async (id) => {

        try {
            
            const result = await userModel.findById({_id: id}).lean().exec()

            return result

        } catch (error) {
            
            throw error

        }
    }

    getUserByEmail = async (username) => {

        try {
            
            const result = await userModel.findOne({email: username}).lean().exec()

            return result

        } catch (error) {
            
            throw error

        }
    }

    create = async (user) => {

        try {
            
            const result = await userModel.create(user)
            
            return result

        } catch (error) {
            
            throw error
            
        }
    }

    update = async () => {

        try {
            
        } catch (error) {
            
            throw error
            
        }
    }

    delete = async () => {

        try {
            
        } catch (error) {
            
            throw error
            
        }
    }
}

const user = new UserManager()

export default user
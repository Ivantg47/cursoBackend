import { messageModel } from "./models/chat.model.js"

class MessageManagerBD{

    getMessages = async () => {

        try {
            
            const data = await messageModel.find().lean().exec()

            return data

        } catch (error) {

            throw error

        }
    }

    addMessage = async (data) => {
        try {
            
            const result = await messageModel.create(data)

            return result

        } catch (error) {

            throw error

        }
    }
}

export const mensajes = new MessageManagerBD()
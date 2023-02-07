import { messageModel } from "../models/chat.model.js"

class MessageManagerBD{

    getMessages = async () => {

        try {
            
            const data = await messageModel.find().lean().exec()
            return data

        } catch (error) {

            console.error(error);
            return error

        }
    }

    addMessage = async (data) => {
        try {
            if (!data.user || !data.message) {
                return {status: 400, message: 'Falta llenar campos'}
            }
            
            const result = await messageModel.create(data)

            return {status: 200, message: 'Mensaje enviado', loadout: result}

        } catch (error) {

            console.error(error);
            return error
        }
    }
}

export const mensajes = new MessageManagerBD()
import ChatDTO from '../dao/DTO/chat.dto.js'

export default class ChatRepository {

    constructor (dao) {
        this.dao = dao
    }

    getMessages = async () => {

        try {
            
            const data = this.dao.getMessages()

            return data

        } catch (error) {

            console.error(error);
            return error

        }
    }

    addMessage = async (data) => {
        try {
            const message = ChatDTO(data)

            console.log(data);
            if (!message.user || !message.message) {
                return {status: 400, message: 'Falta llenar campos'}
            }
            
            const result = await messageModel.create(message)

            return {status: 200, message: 'Mensaje enviado', loadout: result}

        } catch (error) {

            console.error(error);
            return error
        }
    }
}
import { messageModel } from "../models/chat.model"

class MessageManagerBD{

    getMessages = async () => {

        try {
            
            const data = await messageModel.find().lean().exec()
            return data

        } catch (error) {

            console.log(error);
            
        }
    }
}

export const message = new MessageManagerBD()
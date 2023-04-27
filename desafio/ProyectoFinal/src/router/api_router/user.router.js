import uploader from "../../dao/multer.js";
import { UserService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";

export default class UserRouter extends MiRouter {
    init () {
        this.get('/premium/:uid', ["ADMIN"], async (req, res) => {

            const { uid } = req.params

            const result = await UserService.setUserRole(uid)

            return res.status(result.code).send(result.result)
            
        })

        this.post('/:uid/documents', ["USER", "PREMIUM","ADMIN"], uploader.any(), async (req, res) => {

            const data = req.body
            console.log('data: ', data);
            res.send({ststus: "success", payload: data})
        })

        
    }
}
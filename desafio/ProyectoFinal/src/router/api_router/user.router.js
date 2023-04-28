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

        this.post('/:uid/documents', ["USER", "PREMIUM","ADMIN"], uploader.fields([{name:'domicilio', maxCount:1}, {name:'estadoCuenta', maxCount:1}]), async (req, res) => {
            try {
                console.log('post');
                const data = req.body
                const file = req.files
                console.log('data: ', data);
                console.log('file: ', file);
                res.send({ststus: "success", payload: data})   
            } catch (error) {
                console.error(error);
            }
        })

        
    }
}
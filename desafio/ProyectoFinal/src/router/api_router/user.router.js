import { UserService } from "../../repositories/index_repository.js";
import MiRouter from "../router.js";

export default class UserRouter extends MiRouter {
    init () {
        this.get('/premium/:uid', ["ADMIN"], async (req, res) => {

            const { uid } = req.params

            const result = await UserService.setUserRole(uid)

            return res.status(result.code).send(result.result)
            
        })
    }
}
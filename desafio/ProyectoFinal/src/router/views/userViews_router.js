import MiRouter from "../router.js";

export default class UserViewRouter extends MiRouter {

    init () {

        this.get('/', ["PUBLIC"], async (req, res) => {
            res.render('user/documentos', {title: "Documentos", user: req.session?.user || req.user})
        })
    }
}
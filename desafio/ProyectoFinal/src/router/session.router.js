import MiRouter from "./router.js";
import passport from 'passport'
import config from "../config/config.js";
import { createHash } from "../utils.js";
import { UserService } from "../repositories/index.js";

export default class SessionRouter extends MiRouter {
    init () {
        this.get('/login', ["PUBLIC"], async (req, res) => {
    
            res.render('session/login', {title: 'Login'})
        
        })
        
        this.post('/login', ["PUBLIC"], passport.authenticate('login', {failureRedirect: '/session/faillogin'}), (req, res) => {
            try {
                
                if (!req.user) {
                    return res.status(401).render('error/general', {error: 'Correo incorrecto'})
                }
        
                req.session.user = req.user
        
                res.cookie(config.COOKIE_NAME_JWT, req.user.token).redirect('/product')
                    
            } catch (error) {
                console.error(error);
                return next()
            }
        })
        
        this.get('/github', ["PUBLIC"], passport.authenticate('github', {scope:['user:email']}), async(req, res) => {})
        
        this.get('/githubcallback', ["PUBLIC"],  passport.authenticate('github', {failureRedirect: '/session/login'}), async(req, res) => {
            req.session.user = req.user
            res.redirect('/product')
        })
        
        this.get('/faillogin', ["PUBLIC"], (req, res) => {
            res.render('error/general',{error: 'Failed login'})
        })
        
        this.get('/failregister', ["PUBLIC"], (req, res) => {
            res.render('error/general',{error: 'Failed to register'})
        })
        
        //<<<<<<<<<<<<<<<<<<<<<<<<<<cerrar usuario>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/logout', ["PUBLIC"], async (req, res, next) => {
            try {
                req.session.destroy(err => {
                    if(err) return res.status(500).render('error/general', {error: err})
                })
                //return res.status(200).send('Logout success')
                res.clearCookie(config.COOKIE_NAME_JWT).redirect("/session/login");
        
            } catch (error) {
                console.error(error);
                return next()
            }
        })
        
        
        //<<<<<<<<<<<<<<<<<<<<<<<<<<restaurar contraseña>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/restor', ["PUBLIC"], async (req, res) => {
            
            res.render('session/restaurar', {title: 'Recuperar Contrasseña'})
        })
        
        this.post('/restorPass', ["PUBLIC"], async (req, res, next) => {
            try {
                const {email, password} = req.body
                
                const result = await UserService.updateUser(email, createHash(password))
                //const result = await userModel.findOneAndUpdate({email: email, method: 'local'}, {'$set': {password: createHash(password)}})
        
                if (!result) {
                    res.status(404).redirect('/session/restor')
                } else {
                    res.status(200).redirect('/session/login')
                }
        
            } catch (error) {
                console.error(error);
                return next()
            }
        })
        
        this.get('/current', ["USER"], async (req, res, next) => {
            const user = req.session?.user || null
            //console.log('user', user);
            if (user) {
                if(!user.cart) user.cart = 'No cart'
            }
            
            res.status(200).render('session/profile', {title: "Perfil", user})
        })
    }
}
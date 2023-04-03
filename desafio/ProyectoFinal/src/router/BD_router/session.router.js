import express from 'express'
import passport from 'passport'
import config from '../../config/config.js'
import { userModel } from '../../dao/bd_manager/mogo/models/user.model.js'
import { createHash, generateToken, isValidPassword } from '../../utils.js'

const router = express.Router()

//<<<<<<<<<<<<<<<<<<<<<<<<<<Crear usuario>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/register', async (req, res) => {
    
    res.render('session/register', {title: 'Register'})
})

router.post('/register', passport.authenticate('register', {failureRedirect: '/session/failregister'}), async (req, res, next) => {
    res.redirect('/session/login')
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<iniciar usuario>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/login', async (req, res) => {
    
    res.render('session/login', {title: 'Login'})

})

router.post('/login', passport.authenticate('login', {failureRedirect: '/session/faillogin'}), (req, res) => {
    try {
        
        if (!req.user) {
            return res.status(401).render('error/general', {error: 'Correo incorrecto'})
        }

        req.session.user = req.user

        res.cookie(config.COOKIE_NAME_JWT, req.user.token).redirect('/product')
            
    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/session/login'}), async(req, res) => {
    req.session.user = req.user
    res.redirect('/product')
})

router.get('/faillogin', (req, res) => {
    res.render('error/general',{error: 'Failed login'})
})

router.get('/failregister', (req, res) => {
    res.render('error/general',{error: 'Failed to register'})
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<cerrar usuario>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if(err) return res.status(500).render('error/general', {error: err})
        })
        //return res.status(200).send('Logout success')
        res.clearCookie(config.COOKIE_NAME_JWT).redirect("/session/login");

    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})


//<<<<<<<<<<<<<<<<<<<<<<<<<<restaurar contraseña>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/restor', async (req, res) => {
    
    res.render('session/restaurar', {title: 'Recuperar Contrasseña'})
})

router.post('/restorPass', async (req, res, next) => {
    try {
        const {email, password} = req.body
        
        const result = await userModel.findOneAndUpdate({email: email, method: 'local'}, {'$set': {password: createHash(password)}})

        if (!result) {
            res.status(404).redirect('/session/restor')
        } else {
            res.status(200).redirect('/session/login')
        }

    } catch (error) {
        req.logger.error(error.message);
        return next()
    }
})

router.get('/current', async (req, res, next) => {
    const user = req.session?.user || null
    //console.log('user', user);
    if (user) {
        if(!user.cart) user.cart = 'No cart'
    }
    
    res.status(200).render('session/profile', {title: "Perfil", user})
})

export default router
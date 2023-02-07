import express from 'express'
import passport from 'passport'
const router = express.Router()

import { userModel } from '../../dao/models/user.model.js'
import { createHash, generateToken, isValidPassword } from '../../utils.js'
import { COOKIE_NAME_JWT } from "../../config/credentials.js";

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
        
        req.session.user.rol = (req.user.email == 'adminCoder@coder.com') ? 'admin' : 'usuario'


        res.cookie(COOKIE_NAME_JWT, req.user.token).redirect('/product')
            

    } catch (error) {
        console.error(error);
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
        res.clearCookie(COOKIE_NAME_JWT).redirect("/session/login");

    } catch (error) {
        console.error(error);
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
        console.error(error);
        return next()
    }
})

router.get('/current', async (req, res, next) => {

})

export default router
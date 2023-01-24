import express from 'express'
import passport from 'passport'
const router = express.Router()

import { userModel } from '../../dao/models/user.model.js'
import { createHash, isValidPassword } from '../../utils.js'

router.post('/create', passport.authenticate('login', {failureRedirect: '/session/faillogin'}), async (req, res, next) => {
    try {
        
        const newUser = req.body
        //console.log(newUser);
        
        if(!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password){
            return res.status(400).render('error/general', {error: 'Todos los campos son obligatorios'})
        }
        newUser.password = createHash(newUser.password)
        //console.log(newUser);
        const result = await userModel.create(newUser)
        //console.log(result);
        res.redirect('/login')

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/session/faillogin'}), async (req, res) => {
    try {
        
        console.log('no entra');
        if (!req.user) {
            return res.status(401).render('error/general', {error: 'Correo incorrecto'})
        }

        req.session.user = req.user
        
        req.session.user.rol = (req.user.email == 'adminCoder@coder.com') ? 'admin' : 'usuario'
        
        res.redirect('/product')
        //res.status(200)
            

    } catch (error) {
        console.log(error);
        //return next()
    }
})

router.get('/faillogin', (req, res) => {
    res.json({error: 'Failed login'})
})

router.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if(err) return res.status(500).render('error/general', {error: err})
        })
        //return res.status(200).send('Logout success')
        res.redirect("/login");

    } catch (error) {
        console.log(error);
        return next()
    }
})

export default router
import express from 'express'
const router = express.Router()

import { userModel } from '../../dao/models/user.model.js'

router.post('/create', async (req, res, next) => {
    try {
        
        const newUser = req.body 
        
        if(!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password){
            return res.status(400).render('error/general', {error: 'Todos los campos son obligatorios'})
        }
        const result = await userModel.create(newUser)
        //console.log(result);
        res.redirect('/login')

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/login', async (req, res, next) => {
    try {
        
        const { email, password } = req.body
        const user = await userModel.findOne({email, password}).lean().exec()

        if (!user) {
            return res.status(401).render('error/general', {error: 'Error en email y/o contraseña'})
        }
        //console.log(user);
        req.session.user = user
        req.session.user.rol = (user.email == 'adminCoder@coder.com') ? 'admin' : 'usuario'
        //console.log(req.session.user);
        res.redirect('/product')
            

    } catch (error) {
        console.log(error);
        return next()
    }
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
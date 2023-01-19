import express from 'express'
const router = express.Router()

import producto from '../../dao/bd_manager/productManagerBD.js'
import uploader from '../../dao/multer.js'

router.get('/login', async (req, res, next) => {
    try {
        req.session.user = {
            username: 'Pepe'
        }
        return res.status(200).send('Login success')

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if(err) return res.send('Logout fail')
        })
        return res.status(200).send('Logout success')

    } catch (error) {
        console.log(error);
        return next()
    }
})

export default router
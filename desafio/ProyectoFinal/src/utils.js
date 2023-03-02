import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from './config/config.js'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user) => {
    const token = jwt.sign({user}, config.JWT_PRIVATE_KEY, {expiresIn: '24h'})

    return token
}
export const authToken = (req, res, next) => {
    
    const authToken = req.cookies[config.COOKIE_NAME_JWT]
    
    if(!authToken) return res.status(401).render('error/general', {error: "Not Auth"})

    jwt.verify(token, config.JWT_PRIVATE_KEY, (error, config) => {
        if(error) return res.status(403).render('error/general', {error: 'Not authorized'})
        req.user = config.user
        next()
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err)
            if (!user) {
                return res.status(401).render('error/general',{
                    error: info.messages ? info.messages : info.toString()
                })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[config.COOKIE_NAME_JWT] : null
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

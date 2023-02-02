import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import { Strategy } from 'passport-local'
import passport from 'passport'
import jwt from 'jsonwebtoken'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'})

    return token
}
export const authToken = (req, res, next) => {
    const authToken = req.cookies.coderCookieToken
    
    if(!authToken) {
        return res.status(401).send({
            error: "Not Auth"
        })
    }

    const token = authToken.split(' ')[1] // Bearer ${TOKEN}
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: 'Not authorized'})

        req.user = credentials.user
        next()
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) {
                return res.status(401).send({
                    error: info.messages ? info.messages : info.toString()
                })
            }

            req.user = user
            next()
        })(req, res, next)
    }
}
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

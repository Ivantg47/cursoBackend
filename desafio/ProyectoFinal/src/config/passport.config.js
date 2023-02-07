import passport, { Passport } from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { userModel } from '../dao/models/user.model.js'
import { createHash, extractCookie, generateToken, isValidPassword } from '../utils.js'
import { COOKIE_NAME_JWT, JWT_PRIVATE_KEY } from "./credentials.js";

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy ({

        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY

    }, async (jwt_payload, done) => {
        try {

            return done(null, jwt_payload)

        } catch (error) {

            return done(error)

        }
    }))

    passport.use('github', new GitHubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALL_BACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            
            try {
                
                let user = await userModel.findOne({email: profile._json.email})
                if (!user) {
                    let newUser = {
                        first_name: profile._json.name, 
                        last_name: '', 
                        email: profile._json.email,
                        password: '',
                        method: 'github'
                    }
                    let result = userModel.create(newUser)
                    return done(null, result)
                } else {
                    return done(null, user)
                }
                
            } catch (error) {
                return done('error to login with github' + error)
            }
        }
    ))

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            const {first_name, last_name, email} =  req.body //req.query
            
            try {
                const user = await userModel.findOne({email: username})
                if (user) {
                    
                    return done(null, false)
                }

                const newUser = {
                    first_name, 
                    last_name, 
                    email,
                    password: createHash(password),
                    method: 'local'
                }

                let result = await userModel.create(newUser)
                return done(null, result)
                
            } catch (error) {
                return done('[LOCAL] Error al registrar '+ error)
            }
        }
    ))
    
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async (username, password, done) => {
            try {
                
                const user = await userModel.findOne({email: username}).lean().exec()
                
                if (!user) {
                    console.error('User no exite');
                    return done(null,false)
                }
                
                if(!isValidPassword(user, password)) return done(null,false)
                delete user.password
                user.token = generateToken(user)
                
                return done(null,user)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        return done(null,user)
    })

}

export default initializePassport
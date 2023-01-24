import passport, { Passport } from 'passport'
import local from 'passport-local'
import { userModel } from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            const {first_name, last_name, email} = req.query //req.body
            try {
                const user = await userModel.findOne({email: username})
                if (user) {
                    console.log('Existe');
                    return done(null, false)
                }

                const newUser = {
                    first_name, 
                    last_name, 
                    email,
                    password: createHash(Passport)
                }

                let result = await userModel.create(newUser)
                return done(null, result)
                
            } catch (error) {
                return done('Error al registrar '+ error)
            }
        }
    ))
    
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async (username, password, done) => {
            try {
                //console.log('passport: ', username, ' ', password);
                const user = await userModel.findOne({email: username}).lean().exec()
                
                if (!user) {
                    console.error('User no exite');
                    return done(null,false)
                }
                //console.log(isValidPassword(user, password));
                if(!isValidPassword(user, password)) return done(null,false)
                delete user.password
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
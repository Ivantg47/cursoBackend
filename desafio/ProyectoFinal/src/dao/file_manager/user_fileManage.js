import fs from 'fs'
import __dirname from '../../utils.js'

class UserFileManager {

    constructor(){
        this.path = __dirname + '/json/user.json'
        this.init()
    }

    init = () => {
        try {
            let file = fs.existsSync(this.path,'utf-8')
            if (!file) {
                fs.writeFileSync(this.path,JSON.stringify([]))
            }
            return null
        } catch(error) {
            throw error
        }
    }

    getUsers = async() => {

        try{
            
            const data =  JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            return data

        } catch(error) {
            throw error
        }
    }

    getId = async() => {
        try{
            
            const users = await this.getUsers()
            const cont = users.length

            return (cont > 0) ? users[cont-1].id + 1 : 1

        } catch(error) {
            throw error
        }
    }

    getUserById = async(id) => {
        try{
            
            const users = await this.getUsers()
            const user = users.find(u => {
                return u.id === Number(id)
            })
            
            return user
        
        } catch(error) {
            throw error
        } 
    }

    getUserByEmail = async(email) => {
        try{
            
            const users = await this.getUsers()
            const user = users.find(u => {
                return u.email === email
            })
            
            return user
        
        } catch(error) {
            throw error
        } 
    }
    
    create = async(user) => {
        try{
            
            const users = await this.getUsers()

            user.id = await this.getId()
            users.push(user)

            await fs.promises.writeFile(this.path, JSON.stringify(users))

            return user
                    
        } catch(error) {
            throw error
        }
    }
    
    delete = async(email) => {

        try {
            if (!await this.getUserByEmail(email)) {                
                return null
            }

            const users = await this.getUsers()

            const filtro = users.filter((user) => user.email != email)

            fs.promises.writeFile(this.path, JSON.stringify(filtro))
            
            return 'Usuaio eliminado'

        } catch (error) {
            throw error
        }     
    }

    update = async(email, newdata) => {

        try {

            if (!await this.getUserByEmail(email)) {                
                return null
            }

            if (email !== newdata.email) {
                return 'No se puede modificar el correo'
            }

            const users = await this.getUsers()

            users.map(user => user.email === email ? user : newdata)

            fs.promises.writeFile(this.path, JSON.stringify(filtro))
            
            return 'Usuario modificado'

        } catch (error) {
            throw error
        }     
    }
}

const user = new UserFileManager()

export default user
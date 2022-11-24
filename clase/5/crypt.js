const fs = require('fs')
const crypto = require('crypto')

const filename = './userInfo.json'

class UserManager {

    getUser = async() => {
        
        if(fs.existsSync(filename)){
            const data = await fs.promises.readFile(filename, 'utf-8')
            const user = JSON.parse(data)

            return user
        }

        return []
    }

    creatUser = async(user) => {
        
        const users = await this.getUser()

        user.salt = crypto.randomBytes(128).toString('base64')
        user.paswd = crypto.createHmac('sha256', user.salt).update(user.paswd).digest('hex')

        users.push(user)
        await fs.promises.writeFile(filename, JSON.stringify(users))

        return users

    }

    validateUser = async(username, pswd) => {
        const users = await this.getUser()
        const user = users.find(u => username)

        if (!user) {
            console.log('Not found');
            return
        }

        const newHash = crypto.createHmac('sha256', user.salt).update(pswd).digest('hex')
        if (newHash === user.pswd) console.log('Inicio');
        else console.log('pass invalido');
        
    }
}

module.exports = UserManager
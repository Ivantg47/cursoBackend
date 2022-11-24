const UserManager = require('./crypt')

const run = async() => {
    const manager = new UserManager()
    
    await manager.creatUser({
        nombre: 'pepe',
        lastname: 'pecas',
        userName: 'pepe',
        paswd: '12345'
    })

    console.log(await manager.getUser());

    await manager.validateUser('pepe', '12345')
}

console.log(run());
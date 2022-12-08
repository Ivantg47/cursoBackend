const http = require('http')

const server = http.createServer((request, response) => {
    response.end('hola mundo!!!')
})

server.listen(8080, () => {
    console.log('escucha');
})
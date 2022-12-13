const socket = io()

socket.emit('message', 'soy pepe!!')

socket.on('para_uno', data => {
    console.log(data);
})

socket.on('para_todos', data => {
    console.log(data);
})

socket.on('todos', data => {
    console.log(data);
})
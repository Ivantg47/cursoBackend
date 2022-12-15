const socket = io()

let user
let chatBox = document.getElementById('chatBox')
Swal.fire({
    title: 'Identificate',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Requierde de un nombre'
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value
    let TxtUserName = document.getElementById('username')
    TxtUserName.innerHTML = user
    socket.emit('authenticated', user)

})

chatBox.addEventListener('keyup', event => {
    if (event.key == 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', {
                user,
                message: chatBox.value
            })
            chatBox.value = ''   
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    console.log(log);
    let messages = ''

    data.forEach(message => {
        messages += `<b>${message.user}</b>: ${message.message}<br>`
    })
    console.log(messages);
    socket.emit('mensaje', messages)

    log.innerHTML = messages
})

socket.on('allChat', user => {
    Swal.fire({
        text: user + ' ingreso a la sala',
        toast: true,
        position: 'top-right'
    })
})

socket.on('mLogs', message => {
    console.log('nuevo');
    log.innerHTML = message
})
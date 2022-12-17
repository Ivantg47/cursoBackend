const socket = io()

addProduct = async(data) => {

    const prod = {
        titile: document.getElementById("titile").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    }

    socket.emit('addProduct', prod)
    return false
}

deletProduct = async (id) => {

    socket.emit('deletProduct', document.getElementById("delet").value)
    return false
}









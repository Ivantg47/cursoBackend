const socket = io()

const tabla = document.getElementById('listaTiempo')
const form = document.getElementById('formProd')

socket.on('lista', lista => {

    const lProducts = lista.map(prod => 
    `<tr>
        <td>${prod.id}</td>
        <td>${prod.title}</td>
        <td>${prod.description}</td>
        <td>$ ${prod.price}</td>
        <td>${prod.thumbnail}</td>
        <td><button type="submit" id="delet" onclick="return deletProduct()" value="${prod.id}">Delete</button></td>
    </tr>`
    ).join(' ')

    tabla.innerHTML = lProducts
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('agrega');
    const prod = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    }
    
    console.log('envia');
    socket.emit('addProduct', prod)
})

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
    console.log(prod);
    await fetch('/api/product', prod)
    socket.emit('addProduct', prod)
    return false
}

deletProduct = async (id) => {

    // socket.emit('deletProduct', document.getElementById("delet").value)
    console.log(document.getElementById("delet").value);
    await fetch(`/api/product/${document.getElementById("delet").value}`, {method: 'DELETE'})
    return false
}









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
        <td><img src="${prod.thumbnail}" alt="No image" width="72" height="72" style="vertical-align:middle"></td>
        <td><a href="" onclick="deletProduct(${prod.id})">❌</a></td>
    </tr>`
    ).join(' ')

    tabla.innerHTML = lProducts
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const prod = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value.trim(),
        code: document.getElementById("code").value.trim(),
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value.trim()    
    }

    socket.emit('addProduct', prod)
    return false
})

// addProduct = async(data) => {

//     const prod = {
//         titile: document.getElementById("titile").value,
//         description: document.getElementById("description").value,
//         price: document.getElementById("price").value,
//         thumbnail: document.getElementById("thumbnail").value,
//         code: document.getElementById("code").value,
//         stock: document.getElementById("stock").value,
//         category: document.getElementById("category").value
//     }
//     console.log(prod);
//     const response = await fetch("/api/product", {
//         body: JSON.stringify(prod),
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//     return false
// }

deletProduct = (id) => {
    event.preventDefault();
    socket.emit('deletProduct', id)
    //console.log('id: ', id);
    //const respon = await fetch(`/api/product/${id}`, {method: 'DELETE'})   
    return false
}







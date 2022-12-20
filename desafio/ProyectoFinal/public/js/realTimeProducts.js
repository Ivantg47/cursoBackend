const socket = io()

const tabla = document.getElementById('listaTiempo')
const formProd = document.getElementById('formProd')

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

formProd.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(formProd);

    // console.log(product);
    // console.log(formData);
    const response = await fetch("/api/product", {
        body: formData,
        method: "POST",        
    });

    const res = await response.json()
    
    if(res.success){
        Swal.fire({
            icon: 'success',
            text: res.product,
            toast: true
        })

        formProd.reset()
        socket.emit('updateList')
    } else {
        Swal.fire({
            icon: 'error',
            text: res.product
        })
    }

    //console.log(res);
})

deletProduct = async (id) => {
    event.preventDefault();
    
    const response = await fetch(`/api/product/${id}`, {method: 'DELETE'}) 

    const res = await response.json()
    
    if(res.success){
        Swal.fire({
            icon: 'success',
            text: res.product
        })
        socket.emit('updateList')
    } else {
        Swal.fire({
            icon: 'error',
            text: res.product
        })
    }
  
    return false
}







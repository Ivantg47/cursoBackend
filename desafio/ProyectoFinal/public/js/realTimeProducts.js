const socket = io()

const tabla = document.getElementById('listaTiempo')
const formProd = document.getElementById('formProd')

socket.on('lista', lista => {

    const lProducts = lista.map(prod => 
    `<tr>
        <td style="display:none">${prod._id}</td>
        <td>${prod.title}</td>
        <td>${prod.description}</td>
        <td>$ ${prod.price}</td>
        <td><img src="${prod.thumbnail[0]}" alt="No image" width="72" height="72" style="vertical-align:middle"></td>
        <td style="text-align: center;"><button class="btn btn-outline-danger"  onclick="deletProduct('${prod._id}')"><i class="bi bi-x-lg" width="32" height="32" fill="red"></i></button></td>
    </tr>`
    ).join(' ')
    
    tabla.innerHTML = lProducts
})

formProd.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(formProd);

    // console.log(product);
    console.log(formData);
    const response = await fetch("/api/product", {
        body: formData,
        method: "POST",        
    });

    const res = await response.json()
    console.log(res);
    if(res.success){
        Swal.fire({
            icon: 'success',
            text: res.message
        })
        ocultar()
        formProd.reset()
        socket.emit('updateList')
    } else {
        Swal.fire({
            icon: 'error',
            text: res.message
        })
    }
    

    //console.log(res);
})

document.addEventListener('click', (e) => { 
    
    if (e.target.matches('a')) {
        e.preventDefault();
      //e.preventImmediatePropagation(); // might not be necessary
    }
})

deletProduct = async (id) => {

    const response = await fetch(`/api/product/${id}`, {method: 'DELETE'}) 

    const res = await response.json()
    console.log(res);
    if(res.success){
        Swal.fire({
            icon: 'success',
            text: res.message
        })
        socket.emit('updateList')
    } else {
        Swal.fire({
            icon: 'error',
            text: res.message
        })
    }

    return false
}

ocultar = () => {
    const div = document.getElementById('ocultar')
    const bt = document.getElementById('bt')
    if (div.style.display === 'none') {
        div.style.display = 'block'
        bt.style.display = 'none'
    } else {
        div.style.display = 'none'
        bt.style.display = 'inline'
    }
}






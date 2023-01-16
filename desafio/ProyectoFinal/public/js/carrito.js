addProduct = async (cid, pid, quantity) => {
    console.log('add', pid);
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {method: 'POST'})
    console.log(response);
    if (response.status == 200) {
        alert('Producto añadido')
    } else {
        alert('Error al añadir')
    }
    
}



//btn btn-outline-dark mt-auto
addProduct = async (cid, pid, quantity) => {
    //console.log('add', pid);
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {method: 'POST'})
    console.log(response);
    if (response.status == 200) {
        alert('Producto añadido')
    } else {
        alert('Error al añadir')
    }
    
}

deleteProduct = async (pid) => {
    //console.log('add', pid);
    const cid = document.getElementById('cart').innerText
    //console.log(cid);
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {method: 'DELETE'})
    //console.log(response);
    
    if (response.status == 200) {
        alert('Producto eliminado')
        window.location.reload();
    } else {
        alert('Error al eliminar')
    }
    
}



//btn btn-outline-dark mt-auto
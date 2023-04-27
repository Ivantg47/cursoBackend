formDocs.addEventListener("submit", async (e) => {
    e.preventDefault()
    const id = document.getElementById('id').textContent
    const formData = new FormData(formDocs);

    const url = `/api/users/${id}/documents`
    // console.log(product);
    // console.log(formData);
    const response = await fetch(url, {
        method: "POST",        
        body: formData,
    });

    const res = await response.json()
    // console.log(res);
    if(res.success){
        Swal.fire({
            icon: 'success',
            text: res.message
        })
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
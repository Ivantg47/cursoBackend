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
    
    if(res.status == "success"){
        Swal.fire({
            icon: 'success',
            text: res.message
        })
        formDocs.reset()
    } else {
        Swal.fire({
            icon: 'error',
            text: res.message
        })
    }
    

    //console.log(res);
})
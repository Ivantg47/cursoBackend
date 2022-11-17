const mostrarLista = array => {

    if(array.length == 0) {
        return "Lista vacia."
        
    } else {

        array.forEach(element => {
            console.log(element);    
        });

        return `La lomgitud de la lista es ${array.length}`
    }
}

console.log(mostrarLista([1, 2, 3]));
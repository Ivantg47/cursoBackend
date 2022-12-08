const contador = (collback) => {
    let count = 1
    console.log('Inicia contador');
    const timer = setInterval (() => {
        console.log(count++)
        if (count > 5) {
           clearInterval(timer) 
        }
    }, 2000)
}

console.log('Inicia');
contador()
console.log('fin');
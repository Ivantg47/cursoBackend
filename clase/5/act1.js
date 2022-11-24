
const numeros = {}

for (let index = 0; index < 10000; index++) {
    let n = parseInt(Math.random()*20)
    //console.log(n);
    if (!numeros[n]) {
        numeros[n] = 1
    }else {
        numeros[n]++
    }
}

console.log(numeros);


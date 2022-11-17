const suma = (num1, num2) => {
    return new Promise((resolve, reject) => {
        if(num1 == 0 || num2 == 0) reject('Operacion inecesaria')
        else if(num1 < 0 || num2 < 0) reject('Solo puede usar numeros positivos')
        else resolve(num1 + num2)
    })
}

const resta = () => {
    return new Promise((resolve, reject) => {
        if(num1 == 0 || num2 == 0) return reject('Operacion inecesaria')
        const result = num1 - num2
        if(result < 0) return reject('Solo devuelve numeros positivos')
        return resolve(result)
    })
}

const multiplicacion = () => {
    return new Promise((resolve, reject) => {
        if(num1 < 0 || num2 < 0) return reject('Solo puede utilisar numeros positivos')
        return resolve(num1 * num2)
    })
}

const division = () => {
    return new Promise((resolve, reject) => {
        if(num2 < 0) return reject('No se puede dividir entre 0')
        return resolve(num1 / num2)
    })   
}

const funcAsync = async() => {

    try{
        console.log(await suma(34, 12));
        console.log(await resta(34, 12));
        console.log(await multiplicacion(34, 12));
        console.log(await division(34, 12));
    } catch (error) {
        console.log('Error: ', error);
    }
}

funcAsync()

suma(12, 2)
    .then(result => console.log(result))
    .catch(e => console.error(e))
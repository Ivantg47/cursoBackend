class Contador{

    

    constructor(responsable){
        this.responsable = responsable
        this.cont_local = 0
    }

    static count_global = 0

    getResponsable = () => {
        return this.responsable
    }

    cont = () => {
        this.cont_local++
        Contador.count_global++
    }

    getContLocal = () => {return this.cont_local}
    getContGlobal = () => {return this.count_global}

}


const pedro = new Contador('pedro')
const paco = new Contador('paco')
const luis = new Contador('luis')

pedro.cont()
pedro.cont()
paco.cont()
luis.cont()
luis.cont()
luis.cont()
luis.cont()

console.log(`${pedro.getResponsable()}: ${pedro.getContLocal()}`);
console.log(`${paco.getResponsable()}: ${paco.getContLocal()}`);
console.log(`${luis.getResponsable()}: ${luis.getContLocal()}`);
console.log(Contador.count_global);
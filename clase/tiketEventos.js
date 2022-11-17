class TiketManager {

    #presioBaseDeGanancia


    constructor(){

        this.evnetos = []
        this.#presioBaseDeGanancia = 0.15

    }

    getEventos = () => {
        return eventos    
    }

    getId = () => {
        const cont = this.evnetos.length
        const nID = (cont > 0) ? this.evnetos[cont-1].id + 1 : 1

        return nID

    }

    agregarEvento = (nombre, lugar, precio, capacidad, fecha = new Date().toDateString()) => {

        const event = {
            id: this.getId(),
            nombre,
            lugar,
            precio: precio + this.#presioBaseDeGanancia,
            capacidad: capacidad ?? 50,
            fecha: fecha ?? new Date().toDateString(),
            participantes: []
        } 

        this.evnetos.push(event)
    }
}
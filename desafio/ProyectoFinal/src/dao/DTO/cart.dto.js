export default class CartDTO {

    constructor(cart) {
        console.log('hola');
        this.id = cart?.id || null
        this.product = cart?.products || []
    }
    
}
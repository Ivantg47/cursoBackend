export default class CartDTO {

    constructor(cart) {
        this.id = cart.id
        this.product = cart?.products || []
    }
    
}
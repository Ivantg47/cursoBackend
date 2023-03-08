export default class CartDTO {

    constructor(cart) {
        
        this.id = cart?.id || null
        this.product = cart?.products || []
    }
    
}
export default class ProductDTO {

    constructor(product) {
        this.title = product.title
        this.description = product.description
        this.price = Number(product.price)
        this.thumbnail = product.thumbnail
        this.code = product.code
        this.stock = Number(product.stock)
        this.category = product.category
        this.status = product.status || true
    }
    
}
export default class ProductRepository {

    constructor (dao) {
        this.dao = dao
    }

    getProducts = async (query, pagination) => {

        const result = await this.dao.getProducts(query, pagination)

        return result
    }

    getProductById = async(id) => {

        const result = await this.dao.getProductById(id)

        return result
    }

    addProduct = async(prod) => {

        const result = this.dao.addProduct(prod)

        return result
    }

    deleteProduct = async(id) => {

        const result = this.dao.deleteProduct(id)

        return result
    }

    updateProduct = async(pid, newProd) => {

        const result = this.dao.updateProduct(pid, newProd)

        return result
    }

}
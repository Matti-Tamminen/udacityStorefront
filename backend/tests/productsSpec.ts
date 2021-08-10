import Product from '../src/models/products'

const products = new Product()

describe('Testing products', () => {
    it('required functions to be defined', () => {
        expect(products.createOneProduct).toBeDefined()
        expect(products.readOneProduct).toBeDefined()
        expect(products.readAllProducts).toBeDefined()
        expect(products.updateOneProduct).toBeDefined()
        expect(products.deleteOneProduct).toBeDefined()
        expect(products.top5products).toBeDefined()
        expect(products.categories).toBeDefined()
    })

    it('createOneProduct creates entry', async () => {
        const res = await products.createOneProduct('test1', 6, 'supply')
        const res2 = await products.createOneProduct('test2', 5.55, 'supply')
        const res3 = await products.createOneProduct('test3', 8.55, null)

        expect(res.name).toEqual('test1')
        expect(res2.price.toString()).toEqual('5.55')
        expect(res3.category).toEqual(null)
    })

    it('readProducts to find right products', async () => {
        const res = await products.readAllProducts()
        const res2 = await products.readOneProduct(res[0].id)

        expect(res.length).toEqual(3)
        expect(res2.id).toEqual(res[0].id)
    })

    it('updateOneProduct updates value', async () => {
        const res = await products.readAllProducts()
        const res2 = await products.updateOneProduct(res[0].id, 'test', null, null)
        const res3 = await products.updateOneProduct(res[0].id, null, 1.55, null)
        const res4 = await products.updateOneProduct(res[0].id, null, null, 'stuff')

        expect(res2.name).toEqual('test')
        expect(res2.price).toEqual(res[0].price)
        expect(res3.price.toString()).toEqual('1.55')
        expect(res3.category).toEqual(res[0].category)
        expect(res4.category).toEqual('stuff')
        expect(res4.name).toEqual('test')
    })

    it('categories to display only selected', async () => {
        const res = await products.readAllProducts()
        const res2 = await products.categories('stuff')
        const res3 = await products.categories('supply')

        expect(res2.length).toEqual(1)
        expect(res3.length).toEqual(1)
    })

    it('deleteOneProduct deletes entry', async () => {
        const res = await products.readAllProducts()
        const res2 = await products.deleteOneProduct(res[0].id)
        const res3 = await products.deleteOneProduct(res[1].id)
        const res4 = await products.deleteOneProduct(res[2].id)
        const res5 = await products.readAllProducts()

        expect(res2.id).toEqual(res[0].id)
        expect(res5).toEqual([])
    })
})
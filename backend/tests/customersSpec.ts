import Customer from "../src/models/customers"

const customers = new Customer()

describe('Testing customers', () => {
    it('required functions to be defined', () => {
        expect(customers.createOneCustomer).toBeDefined()
        expect(customers.readOneCustomer).toBeDefined()
        expect(customers.readAllCustomers).toBeDefined()
        expect(customers.deleteOneCustomer).toBeDefined()
    })

    it('createOneCustomer to create entry', async () => {
        const res = await customers.createOneCustomer('test', 'address', 11111, 'Pori')
        const res2 = await customers.createOneCustomer('test2', null, null, 'Pori')
        const res3 = await customers.createOneCustomer(null, null, null, null)

        expect(res.name).toEqual('test')
        expect(res2.city).toEqual('Pori')
        expect(res3).not.toBeNull()
    })

    it('readCustomers to find right customers', async () => {
        const res = await customers.readAllCustomers()
        const res2 = await customers.readOneCustomer(res[0].id)

        expect(res.length).toEqual(3)
        expect(res2.id).toEqual(res[0].id)
    })

    it('deleteCustomer deletes entry', async () => {
        const res = await customers.readAllCustomers()
        const res2 = await customers.deleteOneCustomer(res[0].id)
        const res3 = await customers.deleteOneCustomer(res[1].id)
        const res4 = await customers.deleteOneCustomer(res[2].id)
        const res5 = await customers.readAllCustomers()

        expect(res2.id).toEqual(res[0].id)
        expect(res3).not.toBeNull()
        expect(res5).toEqual([])
    })
})
import Order from '../src/models/orders'
import User, { UserType } from '../src/models/users'
import Customer, { CustomerType } from '../src/models/customers'

const users = new User()
const customers = new Customer()

const orders = new Order()

let user1: UserType
let user2: UserType
let cust1: CustomerType
let cust2: CustomerType

const initModels = async () => {
    // to pass constraints
    user1 = await users.createUser('matti', 'tamminen', 'mattam', 'password')
    user2 = await users.createUser(null, 'testing', 'test', 'secret')
    cust1 = await customers.createOneCustomer('test', 'address', 11111, 'Pori')
    cust2 = await customers.createOneCustomer('test2', null, null, 'Pori')
}
const cleanModels = async () => {
    // clean users and customers
    await users.deleteOneUser(user1.id)
    await users.deleteOneUser(user2.id)
    await customers.deleteOneCustomer(cust1.id)
    await customers.deleteOneCustomer(cust2.id)
}

describe('Testing orders', () => {
    initModels()

    it('required functions to be defined', () => {
        expect(orders.createHeader).toBeDefined()
        expect(orders.addRow).toBeDefined()
        expect(orders.readHeader).toBeDefined()
        expect(orders.readRow).toBeDefined()
        expect(orders.readAllHeaders).toBeDefined()
        expect(orders.readAllRows).toBeDefined()
        expect(orders.updateOneHeader).toBeDefined()
        expect(orders.updateOneRow).toBeDefined()
        expect(orders.deleteOneHeader).toBeDefined()
        expect(orders.deleteOneRow).toBeDefined()
        expect(orders.userOrders).toBeDefined()
    })

    it('createOrders to create an entry', async () => {
        const res = await orders.createHeader(cust1.id, user1.id)
        const res2 = await orders.createHeader(cust2.id, user1.id)
        const res3 = await orders.createHeader(cust1.id, user2.id)
        const res4 = await orders.addRow('5', '1', 5)
        const res5 = await orders.addRow('7', '1', 2)
        const res6 = await orders.addRow('5', '2', 5)

        expect(res.customer_id).toEqual(cust1.id)
        expect(res2.active).toEqual(true)
        expect(res3.user_id).toEqual(user2.id)
        expect(res4.product_id).toEqual('5')
        expect(res5.order_id).toEqual('1')
        expect(res6.quantity).toEqual(5)
    })

    it('readOrders to find right orders', async () => {
        const res = await orders.readAllHeaders()
        const res1 = await orders.readHeader(res[0].id)
        const res2 = await orders.readAllRows()
        const res3 = await orders.readRow(res2[0].id)

        expect(res.length).toEqual(3)
        expect(res1.id).toEqual(res[0].id)
        expect(res2.length).toEqual(3)
        expect(res3.id).toEqual(res2[0].id)
    })

    it('updateOrders to update values', async () => {
        const res = await orders.readAllHeaders()
        const res2 = await orders.updateOneHeader(res[0].id, null, null, false)
        const res3 = await orders.updateOneHeader(res[0].id, cust2.id, null, true)
        const res4 = await orders.readAllRows()
        const res5 = await orders.updateOneRow(res4[0].id, 1)

        expect(res2.active).toEqual(false)
        expect(res3.customer_id).toEqual(cust2.id)
        expect(res5.quantity).toEqual(1)
    })

    it('userOrders to find right orders', async () => {
        const res = await orders.userOrders('2')

        expect(res).not.toBeFalsy()
    })

    it('deleteOrders to delete entries', async () => {
        const res = await orders.readAllRows()
        const res2 = await orders.deleteOneRow(res[0].id)
        const res3 = await orders.deleteOneRow(res[1].id)
        const res4 = await orders.deleteOneRow(res[2].id)
        const res5 = await orders.readAllHeaders()
        const res6 = await orders.deleteOneHeader(res5[0].id)
        const res7 = await orders.deleteOneHeader(res5[1].id)
        const res8 = await orders.deleteOneHeader(res5[2].id)
        const res9 = await orders.readAllRows()
        const res10 = await orders.readAllHeaders()

        expect(res2.id).toEqual(res[0].id)
        expect(res6).not.toBeFalsy()
        expect(res9).toEqual([])
        expect(res10).toEqual([])
    })

    cleanModels()
})


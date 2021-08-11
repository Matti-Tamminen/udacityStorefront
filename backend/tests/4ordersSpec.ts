import Order from '../src/models/orders'
import User from '../src/models/users'
import Customer from '../src/models/customers'
import Product from '../src/models/products'

const users = new User()
const customers = new Customer()
const products = new Product()

const orders = new Order()

describe('Testing orders', () => {
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
		const cust = await customers.readAllCustomers()
		const user = await users.readAllUsers()
		const prod = await products.readAllProducts()
		const res = await orders.createHeader(cust[0].id, user[0].id)
		const res2 = await orders.createHeader(cust[1].id, user[0].id)
		const res3 = await orders.createHeader(cust[0].id, user[1].id)
		const res4 = await orders.addRow(prod[0].id, res.id, 5)
		const res5 = await orders.addRow(prod[1].id, res.id, 2)
		const res6 = await orders.addRow(prod[0].id, res2.id, 5)

		expect(res.customer_id).toEqual(cust[0].id)
		expect(res2.active).toEqual(true)
		expect(res3.user_id).toEqual(user[1].id)
		expect(res4.product_id).toEqual(prod[0].id)
		expect(res5.order_id).toEqual(res.id)
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
		const res6 = await customers.readAllCustomers()
		const res = await orders.readAllHeaders()
		const res2 = await orders.updateOneHeader(res[0].id, null, null, false)
		const res3 = await orders.updateOneHeader(res[0].id, res6[0].id, null, true)
		const res4 = await orders.readAllRows()
		const res5 = await orders.updateOneRow(res4[0].id, 1)

		expect(res2.active).toEqual(false)
		expect(res3.customer_id).toEqual(res6[0].id)
		expect(res5.quantity).toEqual(1)
	})

	it('userOrders to return object', async () => {
		const cust = await users.readAllUsers()
		const res = await orders.userOrders(cust[0].id)

		expect(res).not.toBeFalsy()
	})

	it('top5products to return list', async () => {
		const res = await products.top5products()

		expect(res.length).toEqual(2)
	})

	it('details to return object', async () => {
		const res = await orders.readAllHeaders()
		const res2 = await orders.details(res[0].id)

		expect(res2).not.toBeFalsy()
	})

	it('deleteOrders to delete entries', async () => {
		const res = await orders.readAllRows()
		const res2 = await orders.deleteOneRow(res[0].id)
		await orders.deleteOneRow(res[1].id)
		await orders.deleteOneRow(res[2].id)
		const res5 = await orders.readAllHeaders()
		const res6 = await orders.deleteOneHeader(res5[0].id)
		await orders.deleteOneHeader(res5[1].id)
		await orders.deleteOneHeader(res5[2].id)
		const res9 = await orders.readAllRows()
		const res10 = await orders.readAllHeaders()

		expect(res2.id).toEqual(res[0].id)
		expect(res6).not.toBeFalsy()
		expect(res9).toEqual([])
		expect(res10).toEqual([])
	})

	it('other deletes delete all entries', async () => {
		const cus = await customers.readAllCustomers()
		const c1 = await customers.deleteOneCustomer(cus[0].id)
		await customers.deleteOneCustomer(cus[1].id)
		await customers.deleteOneCustomer(cus[2].id)
		const cusf = await customers.readAllCustomers()

		const usr = await users.readAllUsers()
		const u1 = await users.deleteOneUser(usr[0].id)
		await users.deleteOneUser(usr[1].id)
		await users.deleteOneUser(usr[2].id)
		const usrf = await users.readAllUsers()

		const pro = await products.readAllProducts()
		const p1 = await products.deleteOneProduct(pro[0].id)
		await products.deleteOneProduct(pro[1].id)
		await products.deleteOneProduct(pro[2].id)
		const prof = await products.readAllProducts()

		expect(c1.id).toEqual(cus[0].id)
		expect(u1.id).toEqual(usr[0].id)
		expect(p1.id).toEqual(pro[0].id)
		expect(cusf).toEqual([])
		expect(usrf).toEqual([])
		expect(prof).toEqual([])
	})

})

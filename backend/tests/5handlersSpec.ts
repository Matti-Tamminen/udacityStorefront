import express, {  Request, Response } from 'express'
import request from 'supertest'
import { productRoutes } from '../src/handlers/productsHandler'
import { userRoutes } from '../src/handlers/usersHandler'
import { customerRoutes } from '../src/handlers/customersHandler'
import { orderRoutes } from '../src/handlers/ordersHandler'

describe('testing endpoints', () => {
	const app = express()

	app.use(express.json())

	app.use(express.urlencoded({ extended: true }))

	app.get('/', function (_req: Request, res: Response) {
		res.json('ok')
	})

	productRoutes(app)
	userRoutes(app)
	customerRoutes(app)
	orderRoutes(app)

	// used id-nums
	let user: string
	let prod: string
	let cust: string

	it('users endpoints work', async () => {
		const res = await request(app).post('/users/create').send({ first_name: 'mat', last_name: 'tam', username: 'mattam', password: 'pass' }).expect(201)
		expect(res.body).not.toBeFalsy()
		user = res.body.id
		const res2 = await request(app).post('/login').send({ username: 'mattam', password: 'pass' }).expect(200)
		expect(res2.body).not.toBeFalsy()
		const res3 = await await request(app).post('/login').send({ username: 'mattam', password: 'wrong' }).expect(401)
		expect(res3.body).toContain('Error')
		const res4 = await request(app).get('/users').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res4.body.length).toEqual(1)
		
	})

	it('products endpoints work', async () => {
		const res = await request(app).post('/products/create').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').send({ name: 'test', price: 12.55, category: 'cat' }).expect(201)
		expect(res.body).not.toBeFalsy()
		prod = res.body.id
		const res2 = await request(app).get('/products').expect(200)
		expect(res2.body.length).toEqual(1)
		const res3 = await request(app).get(`/products/${res.body.id}`).expect(200)
		expect(res3.body).not.toBeFalsy()
		const res4 = await request(app).get('/products/category/cat').expect(200)
		expect(res4.body).not.toBeFalsy()
		const res5 = await request(app).get('/products/top5').expect(404)
		expect(res5.body).not.toBeNull()
		const res6 = await request(app).put(`/products/update/${res.body.id}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').send({ name: null, price: null, category: 'cat2'}).expect(200)
		expect(res6.body).not.toBeFalsy()
		
	})

	it('customers endpoints work', async () => {
		const res = await request(app).post('/customers/create').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').send({ name: 'testname', street_address: 'street', postal_code: 11111, city: 'Pori' }).expect(201)
		expect(res.body).not.toBeFalsy()
		cust = res.body.id
		const res2 = await request(app).get('/customers').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res2.body.length).toEqual(1)
		const res3 = await request(app).get(`/customers/${res.body.id}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res3.body).not.toBeFalsy()
		
	})

	it('orders endpoints work', async () => {
		const res = await request(app).post('/orders/headers/create').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').send({ customer_id: cust, user_id: user }).expect(201)
		expect(res.body).not.toBeFalsy()
		const res2 = await request(app).post(`/orders/headers/${res.body.id}/add`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').send({ product_id: prod, quantity: 3 }).expect(201)
		expect(res2.body).not.toBeFalsy()
		const res3 = await request(app).get(`/orders/user/${user}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res3.body).not.toBeFalsy()
		const res4 = await request(app).get(`/orders/details/${res.body.id}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res4.body).not.toBeFalsy()
		const res5 = await request(app).delete(`/orders/rows/delete/${res2.body.id}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res5.body).not.toBeFalsy()
		const res6 = await request(app).delete(`/orders/headers/delete/${res.body.id}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res6.body).not.toBeFalsy()
	})

	it('deletes all the test-entries', async () => {
		const res4 = await request(app).delete(`/customers/delete/${cust}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res4.body).not.toBeFalsy()
		const res5 = await request(app).delete(`/products/delete/${prod}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res5.body).not.toBeFalsy()
		const res6 = await request(app).delete(`/users/delete/${user}`).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyOTIsImZpcnN0X25hbWUiOiJtYXQiLCJsYXN0X25hbWUiOiJ0YW0iLCJ1c2VybmFtZSI6Im1hdHRhbSIsInBhc3N3b3JkIjoiJDJiJDEwJDlxM2suYjY2SklpWmR3NUFEaVlGVU8ybWlaYVp5Yko2SHQ2a2FPZTlzT0Y2YXc3R3c0WDlPIn0sImlhdCI6MTYyODg0Mzg1NH0.D10vKlGZbPfSrm5EdJHwdFxHw58x-lrMoN6LWV97KvQ').expect(200)
		expect(res6.body).not.toBeFalsy()
	})
})
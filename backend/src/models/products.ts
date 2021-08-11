import { QueryResult } from 'pg'
import client from '../db'

export type ProductType = {
    id: string,
    name: string,
    price: number,
    category: string | null
}

export default class Product {
	async createOneProduct(name: ProductType['name'], price: ProductType['price'], category: ProductType['category']): Promise<ProductType> {
		const connection = await client.connect()
		const sql = 'INSERT INTO store.products (name, price, category) VALUES ($1, $2, $3) RETURNING *;'
		const res = await client.query(sql, [name, price, category])
		connection.release()

		return res.rows[0]
	}

	async readOneProduct(id: ProductType['id']): Promise<ProductType> {
		const connection = await client.connect()
		const sql = 'SELECT * FROM store.products WHERE id = $1;'
		const res = await client.query(sql, [id])
		connection.release()

		return res.rows[0]
	}

	async readAllProducts(): Promise<ProductType[]> {
		const connection = await client.connect()
		const sql = 'SELECT * FROM store.products;'
		const res = await client.query(sql)
		connection.release()

		return res.rows
	}

	async updateOneProduct(id: ProductType['id'], name: ProductType['name'] | null, price: ProductType['price'] | null, category: ProductType['category'] | null): Promise<ProductType> {
		const connection = await client.connect()
		let res1: QueryResult | null = null
		let res2: QueryResult | null = null
		let res3: QueryResult | null = null

		// check which columns to update
		if (name != null) {
			const sql = 'UPDATE store.products SET name = $2 WHERE id = $1 RETURNING *;'
			res1 = await client.query(sql, [id, name])
		}
		if (price != null) {
			const sql = 'UPDATE store.products SET price = $2 WHERE id = $1 RETURNING *;'
			res2 = await client.query(sql, [id, price])
		}
		if (category != null) {
			const sql = 'UPDATE store.products SET category = $2 WHERE id = $1 RETURNING *;'
			res3 = await client.query(sql, [id, category])
		}
		connection.release()

		// return value based on last update
		if (res3 !== null) {
			return res3.rows[0]
		} else if (res2 !== null && res3 === null) {
			return res2.rows[0]
		} else if (res1 !== null && res2 === null && res3 === null) {
			return res1.rows[0]
		}
		throw new Error('At least one column must be set to update...')
	}

	async deleteOneProduct(id: ProductType['id']): Promise<ProductType> {
		const connection = await client.connect()
		const sql = 'DELETE FROM store.products WHERE id = $1 RETURNING *;'
		const res = await client.query(sql, [id])
		connection.release()

		return res.rows[0]
	}

	async top5products(): Promise<Record<string, unknown>[]> {
		const connection = await client.connect()
		const sql = `SELECT store.products.id, store.products.name, store.products.price, COUNT(store.order_rows.product_id) FROM store.order_rows 
        INNER JOIN store.products ON store.order_rows.product_id = store.products.id 
        GROUP BY store.products.id, store.products.name, store.products.price 
        ORDER BY COUNT(product_id) DESC LIMIT(5);`
		const res = await client.query(sql)
		connection.release()

		return res.rows
	}

	async categories(category: ProductType['category']): Promise<ProductType[]> {
		const connection = await client.connect()
		const sql = 'SELECT * FROM store.products WHERE category = $1;'
		const res = await client.query(sql, [category])
		connection.release()

		return res.rows
	}
}
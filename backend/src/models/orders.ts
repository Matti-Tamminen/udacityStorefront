import { QueryResult } from "pg"
import client from "../db"

export type OrowType = {
    id: string,
    product_id: string,
    order_id: string,
    quantity: number
}

export type OheaderType = {
    id: string,
    customer_id: string,
    user_id: string,
    active: boolean
}

export default class Order {
    async createHeader(customer_id: OheaderType['customer_id'], user_id: OheaderType['user_id']): Promise<OheaderType> {
        const connection = await client.connect()
        const sql = `INSERT INTO store.order_headers (customer_id, user_id) VALUES ($1, $2) RETURNING *;`
        const res = await client.query(sql, [customer_id, user_id])
        connection.release()

        return res.rows[0]
    }

    async addRow(product_id: OrowType['product_id'], order_id: OrowType['order_id'], quantity: OrowType['quantity']): Promise<OrowType> {
        const connection = await client.connect()
        const sql = `INSERT INTO store.order_rows (product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING *;`
        const res = await client.query(sql, [product_id, order_id, quantity])
        connection.release()

        return res.rows[0]
    }

    async readHeader(id: OheaderType['id']): Promise<OheaderType> {
        const connection = await client.connect()
        const sql = `SELECT * FROM store.order_headers WHERE id = $1;`
        const res = await client.query(sql, [id])
        connection.release()

        return res.rows[0]
    }

    async readRow(id: OrowType['id']): Promise<OrowType> {
        const connection = await client.connect()
        const sql = `SELECT * FROM store.order_rows WHERE id = $1;`
        const res = await client.query(sql, [id])
        connection.release()

        return res.rows[0]
    }

    async readAllHeaders(): Promise<OheaderType[]> {
        const connection = await client.connect()
        const sql = `SELECT * FROM store.order_headers;`
        const res = await client.query(sql)
        connection.release()

        return res.rows
    }

    async readAllRows(): Promise<OrowType[]> {
        const connection = await client.connect()
        const sql = `SELECT * FROM store.order_rows;`
        const res = await client.query(sql)
        connection.release()

        return res.rows
    }

    async updateOneHeader(id: OheaderType['id'], customer_id: OheaderType['customer_id'] | null, user_id: OheaderType['user_id'] | null, active: OheaderType['active'] | null): Promise<OheaderType> {
        const connection = await client.connect()
        let res1: QueryResult | null = null
        let res2: QueryResult | null = null
        let res3: QueryResult | null = null

        // check which to update
        if (customer_id != null) {
            const sql = `UPDATE store.order_headers SET customer_id = $2 WHERE id = $1 RETURNING *;`
            res1 = await client.query(sql, [id, customer_id])
        }
        if (user_id != null) {
            const sql = `UPDATE store.order_headers SET user_id = $2 WHERE id = $1 RETURNING *;`
            res2 = await client.query(sql, [id, user_id])
        }
        if (active != null) {
            const sql = `UPDATE store.order_headers SET active = $2 WHERE id = $1 RETURNING *;`
            res3 = await client.query(sql, [id, active])
        }
        connection.release()

        if (res3 !== null) {
            return res3.rows[0]
        } else if (res2 !== null && res3 === null) {
            return res2.rows[0]
        } else if (res1 !== null && res2 === null && res3 === null) {
            return res1.rows[0]
        }
        throw new Error(`At least one column must be set to update...`)
    }

    async updateOneRow(id: OrowType['id'], quantity: OrowType['quantity']): Promise<OrowType> {
        const connection = await client.connect()
        const sql = `UPDATE store.order_rows SET quantity = $2 WHERE id = $1 RETURNING *;`
        const res = await client.query(sql, [id, quantity])
        connection.release()

        return res.rows[0]
    }

    async deleteOneHeader(id: OheaderType['id']): Promise<object> {
        const connection = await client.connect()
        //delete rows first
        const sql1 = `DELETE FROM store.order_rows WHERE order_id = $1 RETURNING *;`
        const res1 = await client.query(sql1, [id])
        // then header
        const sql2 = `DELETE FROM store.order_headers WHERE id = $1 RETURNING *;`
        const res2 = await client.query(sql2, [id])
        connection.release()

        return { order: res2.rows[0], rows: res1.rows }
    }

    async deleteOneRow(id: OrowType['id']): Promise<OrowType> {
        const connection = await client.connect()
        const sql = `DELETE FROM store.order_rows WHERE id = $1 RETURNING *;`
        const res = await client.query(sql, [id])
        connection.release()

        return res.rows[0]
    }

    async userOrders(user_id: OheaderType['user_id']): Promise<object> {
        const connection = await client.connect()
        const sql = `SELECT COUNT(id) as all_orders FROM store.order_headers WHERE user_id = $1;`
        const all = await client.query(sql, [user_id])

        const sql2 = `SELECT COUNT(id) as actives FROM store.order_headers WHERE user_id = $1 AND active = true;`
        const actives = await client.query(sql2, [user_id])

        const sql3 = `SELECT COUNT(id) as inactives FROM store.order_headers WHERE user_id = $1 AND active = false;`
        const inactives = await client.query(sql3, [user_id])

        const sql4 = `SELECT store.order_headers.id, customer_id, user_id, active, COUNT(store.order_rows.id) as rows FROM store.order_headers 
        INNER JOIN store.order_rows ON store.order_headers.id = store.order_rows.order_id WHERE user_id = $1
        GROUP BY store.order_headers.id, customer_id, user_id, active;`
        const orders = await client.query(sql4, [user_id])
        connection.release()

        const full = [{}]
        full[0] = all.rows[0]
        full[1] = actives.rows[0]
        full[2] = inactives.rows[0]
        full[3] = orders.rows
        return full
    }

    async details(id: OheaderType['id']): Promise<object> {
        const connection = await client.connect()
        const sql = `SELECT active, first_name, last_name, name, street_address, postal_code, city FROM store.order_headers 
        INNER JOIN store.customers ON store.order_headers.customer_id = store.customers.id 
        INNER JOIN store.users ON store.order_headers.user_id = users.id
        WHERE store.order_headers.id = $1;`
        const order = await client.query(sql, [id])

        const sql2 = `SELECT name, category, price, quantity, SUM(quantity * price) as sum FROM store.order_rows 
        INNER JOIN store.products ON store.order_rows.product_id = store.products.id
        WHERE order_id = $1
        GROUP BY name, category, price, quantity;`
        const products = await client.query(sql2, [id])

        const sql3 = `SELECT SUM(quantity * price) as total FROM store.order_rows INNER JOIN store.products ON store.order_rows.product_id = store.products.id WHERE order_id = $1;`
        const total = await client.query(sql3, [id])
        connection.release()

        const detail = [{}]
        detail[0] = order.rows[0]
        detail[1] = products.rows
        detail[2] = total.rows[0]
        return detail
    }
}
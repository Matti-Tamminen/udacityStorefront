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
        try {
            const connection = await client.connect()
            const sql = `INSERT INTO store.order_headers (customer_id, user_id, active) VALUES ($1, $2, true) RETURNING *;`
            const res = await client.query(sql, [customer_id, user_id])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from createHeader: ${err}`)
            throw new Error
        }
    }

    async addRow(product_id: OrowType['product_id'], order_id: OrowType['order_id'], quantity: OrowType['quantity']): Promise<OrowType> {
        try {
            const connection = await client.connect()
            const sql = `INSERT INTO store.order_rows (product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING *;`
            const res = await client.query(sql, [product_id, order_id, quantity])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from createRow: ${err}`)
            throw new Error
        }
    }

    async readHeader(id: OheaderType['id']): Promise<OheaderType> {
        try {
            const connection = await client.connect()
            const sql = `SELECT * FROM store.order_headers WHERE id = $1;`
            const res = await client.query(sql, [id])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from readHeader: ${err}`)
            throw new Error
        }
    }

    async readRow(id: OrowType['id']): Promise<OrowType> {
        try {
            const connection = await client.connect()
            const sql = `SELECT * FROM store.order_rows WHERE id = $1;`
            const res = await client.query(sql, [id])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from readRow: ${err}`)
            throw new Error
        }
    }

    async readAllHeaders(): Promise<OheaderType[]> {
        try {
            const connection = await client.connect()
            const sql = `SELECT * FROM store.order_headers;`
            const res = await client.query(sql)
            connection.release()

            return res.rows
        } catch (err) {
            console.log(`Error from readAllHeaders: ${err}`)
            throw new Error
        }
    }

    async readAllRows(): Promise<OrowType[]> {
        try {
            const connection = await client.connect()
            const sql = `SELECT * FROM store.order_rows;`
            const res = await client.query(sql)
            connection.release()

            return res.rows
        } catch (err) {
            console.log(`Error from readAllRows: ${err}`)
            throw new Error
        }
    }

    async updateOneHeader(id: OheaderType['id'], customer_id: OheaderType['customer_id'] | null, user_id: OheaderType['user_id'] | null, active: OheaderType['active'] | null): Promise<OheaderType> {
        try {
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
        } catch (err) {
            console.log(`Error from updateOneHeader: ${err}`)
            throw new Error
        }
    }

    async updateOneRow(id: OrowType['id'], quantity: OrowType['quantity']): Promise<OrowType> {
        try {
            const connection = await client.connect()
            const sql = `UPDATE store.order_rows SET quantity = $2 WHERE id = $1 RETURNING *;`
            const res = await client.query(sql, [id, quantity])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from updateOneRow: ${err}`)
            throw new Error
        }
    }

    async deleteOneHeader(id: OheaderType['id']): Promise<object> {
        try {
            const connection = await client.connect()
            //delete rows first
            const sql1 = `DELETE FROM store.order_rows WHERE order_id = $1 RETURNING *;`
            const res1 = await client.query(sql1, [id])
            // then header
            const sql2 = `DELETE FROM store.order_headers WHERE id = $1 RETURNING *;`
            const res2 = await client.query(sql2, [id])
            connection.release()

            return { order: res2.rows[0], rows: res1.rows }
        } catch (err) {
            console.log(`Error from deleteOneHeader: ${err}`)
            throw new Error
        }
    }

    async deleteOneRow(id: OrowType['id']): Promise<OrowType> {
        try {
            const connection = await client.connect()
            const sql = `DELETE FROM store.order_rows WHERE id = $1 RETURNING *;`
            const res = await client.query(sql, [id])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from deleteOneRow: ${err}`)
            throw new Error
        }
    }

    async userOrders(user_id: OheaderType['user_id'], actives: boolean): Promise<OheaderType[] | []> {
        try {
            const connection = await client.connect()
            let res: QueryResult | [] = []
            if (actives) {
                const sql = `SELECT * FROM store.order_headers WHERE user_id = $1 AND active = true;`
                res = await client.query(sql, [user_id])
            } else {
                const sql = `SELECT * FROM store.order_headers WHERE user_id = $1;`
                res = await client.query(sql, [user_id])
            }
            connection.release()

            return res.rows
        } catch (err) {
            console.log(`Error from userOrders: ${err}`)
            throw new Error
        }
    }

    async rowCounts(order_id: OrowType['order_id']): Promise<number> {
        try {
            const connection = await client.connect()
            const sql = `SELECT COUNT(id) FROM store.order_rows WHERE order_id = $1;`
            const res = await client.query(sql, [order_id])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from rowCounts: ${err}`)
            throw new Error
        }
    }

    async totalPrice(order_id: OrowType['order_id']): Promise<number> {
        try {
            const connection = await client.connect()
            const sql = `SELECT SUM(quantity * price) FROM store.order_rows INNER JOIN store.products ON store.order_rows.product_id = store.products.id WHERE order_id = $1`
            const res = await client.query(sql, [order_id])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from totalPrice: ${err}`)
            throw new Error
        }
    }
}
import client from "../db"

export type CustomerType = {
    id: string,
    name: string | null,
    street_address: string | null,
    postal_code: number | null,
    city: string | null
}

export default class Customer {
    async createOneCustomer(name: CustomerType['name'], street_address: CustomerType['street_address'], postal_code: CustomerType['postal_code'], city: CustomerType['city']): Promise<CustomerType> {
        const connection = await client.connect()
        const sql = `INSERT INTO store.customers (name, street_address, postal_code, city) VALUES ($1, $2, $3, $4) RETURNING *;`
        const res = await client.query(sql, [name, street_address, postal_code, city])
        connection.release()

        return res.rows[0]
    }

    async readOneCustomer(id: CustomerType['id']): Promise<CustomerType> {
        const connection = await client.connect()
        const sql = `SELECT * FROM store.customers WHERE id = $1;`
        const res = await client.query(sql, [id])
        connection.release()

        return res.rows[0]
    }

    async readAllCustomers(): Promise<CustomerType[]> {
        const connection = await client.connect()
        const sql = `SELECT * FROM store.customers;`
        const res = await client.query(sql)
        connection.release()

        return res.rows
    }

    async deleteOneCustomer(id: CustomerType['id']): Promise<CustomerType> {
        const connection = await client.connect()
        const sql = `DELETE FROM store.customers WHERE id = $1 RETURNING *;`
        const res = await client.query(sql, [id])
        connection.release()

        return res.rows[0]
    }
}
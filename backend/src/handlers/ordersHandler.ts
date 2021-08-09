import express, { Request, Response } from 'express'
import Order, { OheaderType, OrowType } from '../models/orders'
import { authOperation } from '../services/auth'

const orders = new Order()

const createHeader = async (req: Request, res: Response) => {
    const { customer_id, user_id } = req.body

    try {
        const result = await orders.createHeader(customer_id, user_id)

        res.status(201).json(result)
    } catch (err) {
        res.status(400).json('CANNOT CREATE HEADER')
    }
}

const addRow = async (req: Request, res: Response) => {
    const product_id = req.body.product_id
    const { order_id } = req.params
    let quantity = req.body.quantity

    try {
        quantity = parseInt(quantity)
        // check that header is made and its active before inserting rows
        const check = await orders.readHeader(order_id)

        if (check.active) {
            const result = await orders.addRow(product_id, order_id, quantity)

            res.status(201).json(result)
            return
        }
        res.status(400).json('Create an active order header before adding rows...')
    } catch (err) {
        res.status(400).json('CANNOT ADD ROW')
    }
}

const readHeader = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.readHeader(id)

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND HEADER')
    }
}

const readRow = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.readRow(id)

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND ROW')
    }
}

const readAllHeaders = async (req: Request, res: Response) => {
    try {
        const result = await orders.readAllHeaders()

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND HEADERS')
    }
}

const readAllRows = async (req: Request, res: Response) => {
    try {
        const result = await orders.readAllRows()

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND ROWS')
    }
}

const userOrders = async (req: Request, res: Response) => {
    const { user_id } = req.params
    const actives = req.body.actives
    const prices = req.body.prices

    try {
        const order = await orders.userOrders(user_id, actives)
        let full_order: object[] = []
        for (let i = 0; i < order.length; i++) {
            const rows = await orders.rowCounts(order[i].user_id)
            if (prices) {
                const total_price = await orders.totalPrice(user_id)
                full_order[i] = ({ order: order[i], rows: rows, total_price: total_price })
            } else {
                full_order[i] = ({ order: order[i], rows: rows })
            }
        }

        res.json(full_order)
    } catch (err) {
        res.status(400).json('CANNOT FIND USER ORDERS')
    }
}

const updateOneHeader = async (req: Request, res: Response) => {
    const { id } = req.params
    const { customer_id, user_id, active } = req.body

    try {
        const result = await orders.updateOneHeader(id, customer_id, user_id, active)

        res.json(result)
    } catch (err) {
        res.status(400).json('CANNOT UPDATE HEADER')
    }
}

const updateOneRow = async (req: Request, res: Response) => {
    const { id } = req.params
    let quantity = req.body.quantity

    try {
        quantity = parseInt(quantity)
        const result = await orders.updateOneRow(id, quantity)

        res.json(result)
    } catch (err) {
        res.status(400).json('CANNOT UPDATE ROW')
    }
}

const deleteOneHeader = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.deleteOneHeader(id)

        res.json(result)
    } catch (err) {
        res.status(400).json('CANNOT DELETE HEADER')
    }
}

const deleteOneRow = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.deleteOneRow(id)

        res.json(result)
    } catch (err) {
        res.status(400).json('CANNOT DELETE ROW')
    }
}

export const orderRoutes = (app: express.Application) => {
    app.post('/orders/headers/create', authOperation, createHeader)
    app.post('/orders/headers/:order_id/add', authOperation, addRow)
    app.get('/orders/headers/:id', readHeader)
    app.get('/orders/rows/:id', readRow)
    app.get('/orders/headers', readAllHeaders)
    app.get('/orders/rows', readAllRows)
    app.get('/orders/user/:user_id', userOrders)
    app.put('/orders/headers/update:id', authOperation, updateOneHeader)
    app.put('/orders/rows/update/:id', authOperation, updateOneRow)
    app.delete('/orders/headers/delete/:id', authOperation, deleteOneHeader)
    app.delete('/orders/rows/delete/:id', authOperation, deleteOneRow)
}
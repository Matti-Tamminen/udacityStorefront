import express, { Request, Response } from 'express'
import Order, { OheaderType, OrowType } from '../models/orders'
import { authOperation } from '../services/auth'

const orders = new Order()

const createHeader = async (req: Request, res: Response) => {
    const { customer_id, user_id } = req.body

    try {
        const result = await orders.createHeader(customer_id as OheaderType['customer_id'], user_id as OheaderType['user_id'])

        res.status(201).json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const addRow = async (req: Request, res: Response) => {
    const product_id = req.body.product_id
    const { order_id } = req.params
    let quantity = req.body.quantity

    try {
        quantity = parseInt(quantity)
        // check that header is made and its active before inserting rows
        const check = await orders.readHeader(order_id as OheaderType['id'])

        if (check.active) {
            const result = await orders.addRow(product_id as OrowType['product_id'], order_id as OrowType['order_id'], quantity as OrowType['quantity'])

            res.status(201).json(result)
            return
        }
        res.status(400).json('Create an active order header before adding rows...')
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const readHeader = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.readHeader(id as OheaderType['id'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(404).json(error)
    }
}

const readRow = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.readRow(id as OrowType['id'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(404).json(error)
    }
}

const readAllHeaders = async (req: Request, res: Response) => {
    try {
        const result = await orders.readAllHeaders()

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(404).json(error)
    }
}

const readAllRows = async (req: Request, res: Response) => {
    try {
        const result = await orders.readAllRows()

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(404).json(error)
    }
}

const userOrders = async (req: Request, res: Response) => {
    const { user_id } = req.params
    const actives = req.body.actives
    const prices = req.body.prices

    try {
        const order = await orders.userOrders(user_id as OheaderType['user_id'])

        res.json(order)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const updateOneHeader = async (req: Request, res: Response) => {
    const { id } = req.params
    const { customer_id, user_id, active } = req.body

    try {
        const result = await orders.updateOneHeader(id as OheaderType['id'], customer_id as OheaderType['customer_id'], user_id as OheaderType['user_id'], active as OheaderType['active'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const updateOneRow = async (req: Request, res: Response) => {
    const { id } = req.params
    let quantity = req.body.quantity

    try {
        quantity = parseInt(quantity)
        const result = await orders.updateOneRow(id as OrowType['id'], quantity as OrowType['quantity'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const deleteOneHeader = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.deleteOneHeader(id as OheaderType['id'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const deleteOneRow = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.deleteOneRow(id as OrowType['id'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const orderDetails = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await orders.details(id)

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

export const orderRoutes = (app: express.Application) => {
    app.post('/orders/headers/create', authOperation, createHeader)
    app.post('/orders/headers/:order_id/add', authOperation, addRow)
    app.get('/orders/headers/:id', authOperation, readHeader)
    app.get('/orders/rows/:id', authOperation, readRow)
    app.get('/orders/headers', authOperation, readAllHeaders)
    app.get('/orders/rows', authOperation, readAllRows)
    app.get('/orders/user/:user_id', userOrders)
    app.get('/orders/details/:id', orderDetails)
    app.put('/orders/headers/update/:id', authOperation, updateOneHeader)
    app.put('/orders/rows/update/:id', authOperation, updateOneRow)
    app.delete('/orders/headers/delete/:id', authOperation, deleteOneHeader)
    app.delete('/orders/rows/delete/:id', authOperation, deleteOneRow)
}
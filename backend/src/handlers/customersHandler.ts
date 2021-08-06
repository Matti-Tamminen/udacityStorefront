import express, { Request, Response } from 'express'
import Customer, { CustomerType } from '../models/customers'
import { authOperation } from '../services/auth'

const customers = new Customer()

const createOne = async (req: Request, res: Response) => {
    const name = req.body.name
    const street_address = req.body.street_address
    let postal_code = req.body.postal_code
    const city = req.body.city

    try {
        if (postal_code != undefined) {
            postal_code = parseInt(postal_code)
        }
        const result = await customers.createOneCustomer(name as CustomerType['name'], street_address as CustomerType['street_address'], postal_code as CustomerType['postal_code'], city as CustomerType['city'])

        res.status(201).json(result)
    } catch (err) {
        res.status(400).json('CANNOT CREATE CUSTOMER')
    }
}

const readOne = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await customers.readOneCustomer(id as CustomerType['id'])

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND CUSTOMER')
    }
}

const readAll = async (req: Request, res: Response) => {
    try {
        const result = await customers.readAllCustomers()

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND CUSTOMERS')
    }
}

const deleteOne = async (req: Request, res: Response) => {
    const id = req.body.id

    try {
        const result = await customers.deleteOneCustomer(id as CustomerType['id'])

        res.json(result)
    } catch (err) {
        res.status(400).json('CANNOT DELETE CUSTOMER')
    }
}

export const customerRoutes = (app: express.Application) => {
    app.post('/customers/create', authOperation, createOne)
    app.get('/customers/:id', readOne)
    app.get('/customers', readAll)
    app.delete('/customers/delete', authOperation, deleteOne)
}
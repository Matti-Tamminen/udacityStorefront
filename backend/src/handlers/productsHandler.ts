import express, { Request, Response } from 'express'
import Product, { ProductType } from '../models/products'
import { authOperation } from '../services/auth'

const products = new Product()

const createOne = async (req: Request, res: Response) => {
    const name = req.body.name
    let price = req.body.price
    const category = req.body.category

    try {
        price = parseInt(price)
        const result = await products.createOneProduct(name as ProductType['name'], price as ProductType['price'], category as ProductType['category'])

        res.status(201).json(result)
    } catch (err) {
        res.status(400).json('CANNOT CREATE PRODUCT')
    }
}

const readOne = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await products.readOneProduct(id as ProductType['id'])

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND PRODUCT')
    }
}

const readAll = async (req: Request, res: Response) => {
    try {
        const result = await products.readAllProducts()

        res.json(result)
    } catch (err) {
        res.status(404).json('CANNOT FIND PRODUCTS')
    }
}


const updateOne = async (req: Request, res: Response) => {
    const { id } = req.params
    const name = req.body.name
    let price = req.body.price
    const category = req.body.category

    try {
        if (price != undefined) {
            price = parseInt(price)
        }
        const result = await products.updateOneProduct(id as ProductType['id'], name as ProductType['name'] | null, price as ProductType['price'] | null, category as ProductType['category'] | null)

        res.json(result)
    } catch (err) {
        res.status(400).json('CANNOT UPDATE PRODUCT')
    }
}

const deleteOne = async (req: Request, res: Response) => {
    const id = req.body.id

    try {
        const result = await products.deleteOneProduct(id as ProductType['id'])

        res.json(result)
    } catch (err) {
        res.status(400).json('CANNOT DELETE PRODUCT')
    }
}

export const productRoutes = (app: express.Application) => {
    app.post('/products/create', authOperation, createOne)
    app.get('/products/:id', readOne)
    app.get('/products', readAll)
    app.put('/products/update/:id', authOperation, updateOne)
    app.delete('/products/delete', authOperation, deleteOne)
}
import express, { Request, Response } from 'express'
import User, { UserType } from '../models/users'
import { authOperation } from '../services/auth'

const users = new User()

const createOne = async (req: Request, res: Response) => {
    const { first_name, last_name, username, password } = req.body

    try {
        const result = await users.createUser(first_name as UserType['first_name'], last_name as UserType['last_name'], username as UserType['username'], password as UserType['password'])

        res.status(201).json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
        const result = await users.authenticate(username as UserType['username'], password as UserType['password'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(401).json(error)
    }
}

const readOne = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await users.readOneUser(id as UserType['id'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(404).json(error)
    }
}

const readAll = async (req: Request, res: Response) => {
    try {
        const result = await users.readAllUsers()

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(404).json(error)
    }
}

const userIndex = async (req: Request, res: Response) => {
    try {
        const result = await users.safeUsers()

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(404).json(error)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await users.deleteOneUser(id as UserType['id'])

        res.json(result)
    } catch (err) {
        const error = `${err}`
        res.status(400).json(error)
    }
}

export const userRoutes = (app: express.Application) => {
    app.post('/login', login)
    app.post('/users/create', createOne) // add middleware to secure
    app.get('/users/:id', authOperation, readOne)
    app.get('/users', authOperation, readAll)
    app.get('/index', userIndex)
    app.delete('/users/delete/:id', authOperation, deleteUser)
}
import client from "../db"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const salt = process.env.SALT_ROUNDS
const pepper = process.env.BCRYPT_PASSWORD
const TOKEN_SECRET = process.env.TOKEN_SECRET

export type UserType = {
    id: string,
    first_name: string | null,
    last_name: string,
    username: string,
    password: string
}

export default class User {
    async createUser(first_name: UserType['first_name'], last_name: UserType['last_name'], username: UserType['username'], password: UserType['password']): Promise<UserType> {
        try {
            const connection = await client.connect()
            const sql = `INSERT INTO store.users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *;`
            // password hashing
            const hash = bcrypt.hashSync(
                password + pepper as string,
                parseInt(salt as string)
            )
            const res = await client.query(sql, [first_name, last_name, username, hash])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from model createUser: ${err}`)
            throw new Error
        }
    }

    async authenticate(username: UserType['username'], password: UserType['password']): Promise<object> {
        try {
            const connection = await client.connect()
            const sql = `SELECT * from store.users WHERE username = $1;`
            const res = await client.query(sql, [username])
            connection.release()

            const appUser: UserType = res.rows[0]
            if (appUser) {
                if (bcrypt.compareSync(password + pepper, appUser.password)) {
                    const token = jwt.sign({ user: appUser }, TOKEN_SECRET as string)

                    return { login: "success", token: token }
                }
            }
            throw new Error
        } catch (err) {
            console.log(`Error from model authenticate: ${err}`)
            throw new Error
        }
    }

    async readOneUser(id: UserType['id']): Promise<UserType> {
        try {
            const connection = await client.connect()
            const sql = `SELECT * FROM store.users WHERE id = $1;`
            const res = await client.query(sql, [id])
            connection.release()

            return res.rows[0]
        } catch (err) {
            console.log(`Error from model readOneUser: ${err}`)
            throw new Error
        }
    }

    async readAllUsers(): Promise<UserType[]> {
        try {
            const connection = await client.connect()
            const sql = `SELECT * FROM store.users;`
            const res = await client.query(sql)
            connection.release()

            return res.rows
        } catch (err) {
            console.log(`Error from model readAllUsers: ${err}`)
            throw new Error
        }
    }

    async safeUsers(): Promise<UserType[]> {
        try {
            const connection = await client.connect()
            const sql = `SELECT first_name, last_name FROM store.users;`
            const res = await client.query(sql)
            connection.release()

            return res.rows
        } catch (err) {
            console.log(`Error from model safeUsers: ${err}`)
            throw new Error
        }
    }

    //async updateOneUser(): 
    //async deleteOneUser():
}

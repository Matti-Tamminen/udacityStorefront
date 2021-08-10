import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    PORT,
    ENV
} = process.env

let client: Pool

if (ENV?.toString().trim() == 'test') { // testing
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB_TEST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: PORT as number | undefined
    })
    console.log(`Test DB-connection started`)
} else if (ENV?.toString().trim() == 'dev') { // development
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: PORT as number | undefined
    })
    console.log(`Development DB-connection started`)
} else { // production
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: PORT as number | undefined
    })
    console.log(`Production DB-connection started`)
}

export default client
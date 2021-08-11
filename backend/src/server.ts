import express, { Response, Request } from 'express'
import cors, { CorsOptions } from 'cors'
import { productRoutes } from './handlers/productsHandler'
import { customerRoutes } from './handlers/customersHandler'
import { userRoutes } from './handlers/usersHandler'
import { orderRoutes } from './handlers/ordersHandler'

const whitelist = ['http://localhost:3000/'] // add your safe domain
const corsOptions: CorsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin as string) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

const app = express()
const port = 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.get('/', cors(corsOptions), (_req: Request, res: Response) => {
	res.send('Welcome!')
})

// import routes from handlers
productRoutes(app)
customerRoutes(app)
userRoutes(app)
orderRoutes(app)

app.listen(port, () => {
	console.log(`Server listening on port: ${port}`)
})
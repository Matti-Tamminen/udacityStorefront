import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'


export const authOperation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string)

        next()
    } catch (err) {
        res.status(401).json('AUTHENTICATION FAILED')
        return
    }
}

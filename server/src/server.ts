import 'dotenv/config'
import db from './config'
import express from 'express'
import session from 'express-session'
import http from 'http'
import cors from 'cors'
import getError from './utils/getError'
import io from 'socket.io'
import * as routes from './route'
import { rateLimit } from 'express-rate-limit'
import { initSocket } from './utils/socket'
import mongooseStore from 'connect-mongo'

declare module 'express-session' {
    interface SessionData {
      socketId?: string;
    }
}

const port = process.env.PORT || 3030

const app = express()
const server = http.createServer(app)
// const connectMongo = mongooseStore()

db.once('open', async () => {
    console.log(`\x1b[35m> Ready!\x1b[0m Connected to DB`);
    try {
        const limiter = rateLimit({
            windowMs: 3 * 60 * 1000, // 3 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        })

        initSocket(server) // Socket.io initialization

        // app.use(session({ // might remove
        //     secret: process.env.SESSION_SECRET || 'secret',
        //     cookie: {
        //         maxAge: 1000 * 60 * 60 * 8, // 8 hours
        //         httpOnly: true,
        //         secure: true,
        //         sameSite: 'lax' // Update the value to "lax"
        //     },
        //     store: mongooseStore.create({
        //         mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/chatapp',
        //         ttl: 8 * 60 * 60 // 8 hours
        //     }),
        //     resave: false,
        //     saveUninitialized: true
        // }))
        app.use(cors())
        app.use(limiter)
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use('/', routes.default)

        server.listen(port, () => {
            console.log(`\x1b[35m> Ready!\x1b[0m Server running on port ${port}`)
        })

        } catch (err: unknown) {
            getError(err as Error)
            process.exit(1)
        }
})

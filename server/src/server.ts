import 'dotenv/config'
import db from './config'
import express from 'express'
import http from 'http'
import cors from 'cors'
import getError from './utils/getError'
import io from 'socket.io'
import * as routes from './route'
import { rateLimit } from 'express-rate-limit'

const port = process.env.PORT || 3030

const app = express()
export const server = http.createServer(app)
const ioServer = new io.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

db.once('open', async () => {
    console.log(`\x1b[35m> Ready!\x1b[0m Connected to DB`);
    try {
        const limiter = rateLimit({
            windowMs: 3 * 60 * 1000, // 5 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        })

        app.use(cors())
        app.use(limiter)
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        // app.use('/', routes.default)

        ioServer.on('connection', (socket) => {
            const client = socket.id

            socket.on('join', (room) => {           
                socket.join(room)
                ioServer.to(room).emit('join', room)
                console.log(`\x1b[33m> Client ${client} connected to room:\x1b[0m`, room);
            })

            socket.on('message', (message, room) => {
                socket.to(room).emit('message', message)
                console.log(`\x1b[33m> ${client}\x1b[0m`, message, room);
            })

            socket.on('disconnect', () => {
                console.log(`\x1b[33m> ${client} disconnected\x1b[0m`)
            })
        })

        server.listen(port, () => {
            console.log(`\x1b[35m> Ready!\x1b[0m Server running on port ${port}`)
        })

    } catch (err: unknown) {
        getError(err as Error)
        process.exit(1)
    }
})

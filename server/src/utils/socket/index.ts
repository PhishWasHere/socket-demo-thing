import io, { Socket } from 'socket.io'
import { Server } from 'http'

let ioServer: io.Server;

export const initServer = (server: Server) => {
    ioServer = new io.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }   
    })
    
    ioServer.on('connection', (socket: Socket) => {
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
    
    return ioServer
}

export const getSocket = () => {
    if (!ioServer) {
        throw new Error('Socket.io not initialized!')
    }
    return ioServer
}
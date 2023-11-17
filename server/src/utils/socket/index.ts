import io, { Socket } from 'socket.io'
import { Server } from 'http'
import { User } from '../../models'

let ioServer: io.Server;

export const initSocket = (server: Server) => {
    ioServer = new io.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }   
    })
    
    ioServer.on('connection', (socket: Socket) => {
        const client = socket.id

        socket.on('login', async (username) => {
            const user = await User.findOneAndUpdate({ username }, { socket_id: client })
            if (!user) {
                socket.emit('login', false)
                return
            }
            socket.emit('login', true)
            console.log(`\x1b[33m> Client ${client} logged in:\x1b[0m`, username);
        })

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
            const user = User.findOneAndUpdate({ socket_id: client }, { socket_id: '' })
            if (!user) {
                return
            }
            console.log(`\x1b[33m> ${client} disconnected\x1b[0m`)
        })
    })
    
    return ioServer
}


export const getSocket = (clientId: string) => {
    const clients = ioServer.sockets.sockets;
    console.log(clients);
    
    if (!clients.has(clientId)) {
        throw new Error('Client not found!')
    }
    return clients.get(clientId);
 }
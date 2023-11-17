import io from 'socket.io'
import { server } from '../../server'

export default function ioServer(server: any) {
    const ioServer = new io.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }   
    })
    
    ioServer.on('connection', (socket) => {

        socket.on('join', (room) => {           
            socket.join(room)

            ioServer.to(room).emit('join', room)
            
            console.log(`\x1b[33m> Socket connected\x1b[0m`, room);
        })
        
        socket.on('message', (message, room) => {
            socket.to(room).emit('message', message)
            console.log(`\x1b[33m> Socket connected\x1b[0m`);
            
        })

        socket.on('disconnect', () => {
            console.log(`\x1b[33m> Socket disconnected\x1b[0m`)
        })
    })
    return ioServer
}


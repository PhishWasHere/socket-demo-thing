import io, { Socket } from 'socket.io'
import { Server } from 'http'
import { User, Room, Message } from '../../models'

let ioServer: io.Server;

export const initSocket = async (server: Server) => {
    ioServer = new io.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }   
    })
    console.log(`\x1b[35m> Ready!\x1b[0m Socket Initialised`);
    
    ioServer.on('connection', (socket: Socket) => {
        const client = socket.id
        
        // socket.on('login', async (_id) => {                        
        //     // const user = await User.findOneAndUpdate({ _id }, { socket_id: client })
        //     // if (!user) {
        //     //     socket.emit('login', false)
        //     //     return
        //     // }
            
        //     // const client: { client_id: string, user_id: string } = {} as any;

        //     // client.client_id = socket.id;
        //     // client.user_id = _id;

        //     socket.emit('login', true);
        //     // console.log(`\x1b[33m> Client ${client} logged in:\x1b[0m`, _id);
        // })


        socket.on('join', (room) => {
            socket.join(room)
            ioServer.to(room).emit('join', room)
            // console.log(`\x1b[33m> Client ${client} connected to room:\x1b[0m`, room);
        })

        socket.on('message', async ( _id, username, message, room) => {
            try {
                const data = await Message.create({
                    user: _id,
                    room,
                    message
                })
                
                await Room.findByIdAndUpdate(room, {$push: {messages: data._id}})
            } catch (error) {
                return socket.to(room).emit('message', 'Message could not be sent')
            }
            socket.to(room).emit('message', username, message)
            console.log(`\x1b[33m> ${client}\x1b[0m`, username, message);

        })

        socket.on('disconnect', (data) => {
            // console.log(`\x1b[33m> ${client} disconnected\x1b[0m`)
        })
    })
    
    return ioServer
}


// export const getSocket = async (clientId: string) => {
//     const clients = ioServer.sockets.sockets;
    
//     if (!clients.has(clientId)) {
//         throw new Error('Client not found!')
//     }
//     return clients.get(clientId);
// }
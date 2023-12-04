import io, { Socket } from "socket.io-client";
const api = process.env.API_URL || "http://localhost:3030";


export const initSocket = async (room: string | number, userId: string) => {
    const socket = io(api, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 20,
        forceNew: true,
        query: {
            room
        }
    })
    
    socket.on('connect', () => {
        // console.log(`Connecting socket...`);
        
        socket.emit('login', userId) // probably not needed
        // console.log(`Logged in as ${userId}`);
        socket.emit('join', room)

        socket.on('join', (room) => { // probably not needed
            console.log(`Joined room ${room}`);
        })
        
        socket.on('message', async ( _id, username, message, room) => {
            console.log('message', message, room);
        })

        socket.on('connectError', (error) => {
            // console.log('Connection error:', error);
        });

        socket.on('reconnect', (attemptNumber) => {
            // console.log('Reconnected to the server. Attempt:', attemptNumber);
        });

        socket.on('reconnectError', (error) => {
            // console.log('Reconnection error:', error);
        });

        socket.on('reconnectFailed', () => {
            // console.log('Failed to reconnect to the server');
        });
    })

    return socket
};

// probably not needed
export const joinRoom = async (socket: Socket, room: string | number) => {
    socket.emit('join', room)
    // console.log(`Joined room ${room}`);
};

export const sendMessage = async (socket: Socket, _id: string, username: string, message: string, room: string | number) => {
    if(!socket) return console.log('Socket not found')
    socket.emit('message', _id, username, message, room)
    // console.log('Message sent:', message);
};


export const disconnectSocket = async (socket: Socket) => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
};
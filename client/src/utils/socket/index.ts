import io, { Socket } from "socket.io-client";

export const initSocket = (async (room: string | number | null) => {
    const socket = io('http://localhost:3030', {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 20,
        forceNew: false,
        query: {
            room
        }
    })

    socket.on('connect', () => {
        console.log(`Connecting socket...`);

        socket.emit('join', room)

        socket.on('join', (room) => {
            console.log(`Joined room ${room}`);
        })
        
        socket.on('message', (message) => {
            console.log(message);
        })

        socket.on('connectError', (error) => {
            console.log('Connection error:', error);
        });

        socket.on('reconnect', (attemptNumber) => {
            console.log('Reconnected to the server. Attempt:', attemptNumber);
        });

        socket.on('reconnectError', (error) => {
            console.log('Reconnection error:', error);
        });

        socket.on('reconnectFailed', () => {
            console.log('Failed to reconnect to the server');
        });
    })

    return socket
})

export const disconnectSocket = (socket: Socket) => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
}
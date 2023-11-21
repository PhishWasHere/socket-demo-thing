'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Socket } from "socket.io-client";
import { initSocket, disconnectSocket } from '../socket';

type SocketContextType = { // TODO: add types, this no work
    socket: Socket<any, any> | undefined;
    joinRoom: (roomId: string) => void;
}
 
const SocketContext = createContext<any>(undefined);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: any) => { // TODO: add types
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    (async () => {
      const socket = await initSocket(roomId)
      setSocket(socket)
    })()

    return () => {
      if (socket) disconnectSocket(socket)
    }
  }, [])

  const joinRoom = (roomId: string) => {
    setRoomId(roomId)
    socket!.emit('join', roomId)
  }

  const disconnect = () => {
    if (socket) disconnectSocket(socket)
  }

  return (
    <SocketContext.Provider value={{ socket, joinRoom, disconnect }}>
      {children}
    </SocketContext.Provider>
  )
}

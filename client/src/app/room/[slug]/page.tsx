'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { initSocket, disconnectSocket } from '@/utils/socket'
import { Socket } from 'socket.io-client'
import { sendMessage } from '@/utils/socket'
import axios from 'axios'
import getError from '@/utils/getError'
import { checkToken } from '@/utils/auth'
const api = process.env.API_URL || "http://localhost:3030";
let socket: Socket | null  = null

export default function Page() {
  const path = usePathname()
  const roomId = path.split('/')[2] // removes '/room/' from path
  const { push } = useRouter()
  const [isConnected, setIsConnected] = useState(socket?.connected || false)

  const [ formData, setformData ] = useState({
    _id: '',
    username: '',
    message: '',
  });
  const [ messageData, setMessageData ] = useState([{_id: '', username: '', message: ''}])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value })
  }
  
  useEffect(() => {
    (async () => {
      try {
        const userData = await checkToken()
        if (userData === null || !userData) return push('/login')
        
        
        const { token, decodedToken } = userData
        socket = await initSocket(roomId, decodedToken._id!)
        
        socket.on('connect', () => {
          setIsConnected(true)
        })

        socket.on('message', async (_id, username, message, room) => {
          console.log('message', _id, username, message, room);
          
          setMessageData((prev) => {
            const newMessage = {_id, username, message};
            console.log(newMessage);
            return [...prev, newMessage];
          })
        })

        setformData((prev) => ({
          ...prev,
          _id: decodedToken._id!,
          username: decodedToken.username!,
        }));

        const res = await axios.post(`${api}/room/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
          room_id: roomId,
          _id: decodedToken._id
        })

        if (!res.data || res.status != 200) throw new Error('No data returned from server')
        await res.data.messageData.forEach((i: { _id: string; username: string; message: string }) => {
          // setMessageData((prev) => [...prev, i])
        });

        
      } catch (err) {
        const errMsg = getError(err)
        console.log(errMsg)
      }
    })();
    
    return () => {
      if (socket) {
        disconnectSocket(socket)
        setIsConnected(false)
      }
    }
}, [])

const handleSend = (async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()    
    await sendMessage(socket!, formData._id, formData.username, formData.message, roomId)
    // socket!.emit('message', 'message test client')

    setformData((prev) => ({
      ...prev,
      message: '',
    }));
  }) 

  return(
    <div>
      <h1>slug</h1>
      <form>
        <input className='text-black' type="text" name="message" placeholder='message' value={formData.message} onChange={handleChange} />
        <button onClick={(e) => handleSend(e)}>submit</button>
      </form>
      {
        messageData ? messageData.map((i) => {
          return (
            <div key={i._id}>
              <p>{i.username}: {i.message}</p>
            </div>
          )
        }) : null
      }
    </div>
  )
}
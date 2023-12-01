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
// let socket: Socket | null  = null

export default function Page() {
  const path = usePathname()
  const roomId = path.split('/')[2] // removes '/room/' from path
  const { push } = useRouter()
  let socket = useRef<Socket | null>(null); // useRef is used to persist data between renders... idk if it fixes any issues need to test later

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
        socket.current = await initSocket(roomId, decodedToken._id!)
        
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

      } catch (err) {
        const errMsg = getError(err)
        console.log(errMsg)
      }
    })();

    return () => {
      if (socket.current) disconnectSocket(socket.current)
    }
  }, [])

  useEffect(() => {
    if (socket.current) {
      socket.current!.on('message', (data) => {
        console.log(data);
        
        setMessageData((prev) => [...prev, {_id: data[0], username: data[1], message: data[2]}])
      })
    }
    console.log(messageData);
    
  }, [socket.current])

  const handleSend = (async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    // console.log(formData.username);
    await sendMessage(socket.current!, formData._id, formData.username, formData.message, roomId)
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
            <div key={i.username}>
              <p>{i.username}: {i.message}</p>
            </div>
          )
        }) : null
      }
    </div>
  )
}
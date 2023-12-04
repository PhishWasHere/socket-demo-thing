'use client'
import { checkToken } from '../utils/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import getError from '@/utils/getError'
import axios from 'axios'
const api = process.env.API_URL || "http://localhost:3030";

export default function Home() {
  const { push } = useRouter()
  const [ userData, setUserData ] = useState({
    username: '',
    token: '',
  })

  const [ roomData, setRoomData ] = useState([{_id: '', room_name: ''}])

  const [formData, setformData] = useState({
    room_name: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value })
  }

  // being called twice for some reason
  useEffect(() => {
    (async () => {
      const userData = await checkToken()
      if (userData === null || !userData) return push('/login')
      
      const { token, decodedToken } = userData     
       
      try {
        const res = await axios.post(`${api}/room`, { 
          headers: { Authorization: `Bearer ${token}` },
          _id: decodedToken._id
        })
        
        if (!res.data || res.status != 200) throw new Error('No data returned from server')
        
        setUserData((prev) => ({
          ...prev,
          username: decodedToken.username!,
          token: token,
        }));

        res.data.forEach((i: { _id: string; room_name: string }) => {
          setRoomData((prev) => [...prev, i])
        })
        
      } catch (err) {
        const errMsg = getError(err)
        console.log(errMsg)
      }
    })()

    return () => {
      if (roomData) setRoomData((prev) => [...prev, {
        _id: '',
        room_name: '',
      }])// resets roomData on unmount 
    }
  }, [])

  const handleSend = (async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    
    const data = await axios.post(`${api}/room/create`, {
      headers: { Authorization: `Bearer ${userData.token}` },
      room_name: formData.room_name,
    });

    if (!data.data || data.status != 200) throw new Error('No data returned from server')
  }) 
  
  return (
    <>
      <h1>User: {userData.username}</h1>

      <form>
        <input className='text-black' type="text" name="room_name" placeholder='room name' value={formData.room_name} onChange={handleChange} />
        <button onClick={(e) => handleSend(e)}>submit</button>
      </form>

      {
        roomData ? roomData.map((i) => {
          return (
            <div key={i._id}>
              <Link href={`/room/${i._id}`}>{i.room_name}</Link>
            </div>
          )
        }) : null  
      }
    </>
  )
}

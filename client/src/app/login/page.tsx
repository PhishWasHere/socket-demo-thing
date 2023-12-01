'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'
import { initSocket, disconnectSocket } from '../../utils/socket'
import { login, checkToken } from '../../utils/auth'

// TODO
 // add password validation regex
let socket: Socket | undefined // might init socket in home route

export default function Page() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const { push } = useRouter()

  useEffect(() => {
    (async () => {
      const token = await checkToken()
      if (token) push('/')
    })()
    return () => {
      if (socket) disconnectSocket(socket) // disconnects socket on unmount
    }
  }, [])

  const [showPassword, setShowPassword] = useState('password')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
    
  const handleSend = (async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const userData = await login(formData.username, formData.password)
    
    if(!userData) return

    push('/')
    
    // assigns socked to user
    // can init on every room join prob wont init here
    // socket = await initSocket(formData.username)
  })

  const passwordToggle = () => {
    showPassword === 'password' ? setShowPassword('text') : setShowPassword('password') // toggle password visibility
  }

  return (
    <main className="">
      <form>
        <input className='text-black' type="text" name="username" placeholder='username' value={formData.username} onChange={handleChange} />
        <input className='text-black' type={showPassword} name="password" placeholder='password' value={formData.password} onChange={handleChange} />
        <input className='' type='checkbox' name='showPassword' onClick={() => passwordToggle()}/>Show Password
        <button onClick={(e) => handleSend(e)}>submit</button>
      </form>
      {/* <button onClick={(e) => disconnect(e)}>disconnect</button> */}
    </main>
  )
}
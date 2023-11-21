'use client'
import { useState, useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'
import { initSocket, disconnectSocket } from '../../utils/socket'
import { login } from '../../utils/auth'
let socket: Socket | undefined
 // TODO
  // add password validation regex

export default function Page() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  useEffect(() => {


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
    // assigns socked to user
    const userData = await login(formData.username, formData.password)

    if(!userData) return

    socket = await initSocket(formData.username)

    // console.log(formData);
    socket!.emit('login', formData.username)
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
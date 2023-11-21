'use client'
import Image from 'next/image'
import { useState, useEffect, ReactComponentElement } from 'react'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'
import { initSocket, disconnectSocket } from '../../utils/socket'

let socket: Socket | undefined

export default function Page() {
  const [formData, setFormData] = useState({
    text: '',
  })
  useEffect(() => {
    (async () => {
      const id = Math.floor(Math.random() * 1000000000)
      socket = await initSocket(id) 
    })()

    return () => {
      disconnectSocket(socket!)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSend = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if(!socket) return

    console.log(formData.text);
    socket!.emit('message', formData.text)
  }

  const disconnect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if(!socket) return

    socket!.disconnect()
  }


  return (
    <main className="">
      <form>
        <input className='text-black' type="text" name="text" onChange={handleChange} />
        <button onClick={(e) => handleSend(e)}>submit</button>
      </form>

      <button onClick={(e) => disconnect(e)}>disconnect</button>

    </main>
  )
}

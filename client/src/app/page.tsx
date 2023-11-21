'use client'
import { checkToken } from '../utils/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initSocket, disconnectSocket } from '../utils/socket'

export default function Home() {
  const { push } = useRouter()
  
  useEffect(() => {
    (async () => {
      const token = await checkToken()
      if (token === null || !token) push('/login')
    })()

  }, [])

  return (
    <>
    
    </>
  )
}

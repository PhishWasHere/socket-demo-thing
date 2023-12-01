'use client'
import { useEffect, useState } from 'react'
import { signup, checkToken } from "@/utils/auth"
import { useRouter } from 'next/navigation'
// TODO
  // add password validation regex
  // add matching password check

export default function Page() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState('password')

  const { push } = useRouter()

  useEffect(() => {
    (async () => {
      const token = await checkToken()
      // if (token === null || !token) push('/login')
    })()
  }, [])

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
    
  const handleSend = (async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    // assigns socked to user
    const userData = await signup(formData.username, formData.password)

    if(!userData) return // return some sort of err

    push('/login') // if login succeful, redirect to login page
  })
  
  const passwordToggle = () => {
    showPassword === 'password' ? setShowPassword('text') : setShowPassword('password') // toggle password visibility
  }

  return (
    <main className="">
      <form>
        <input className='text-black' type="text" name="username" placeholder='username' value={formData.username} onChange={handleChange} />
        <input className='text-black' type={showPassword} name="password" placeholder='password' value={formData.password} onChange={handleChange} />
        <input className='text-black' type={showPassword} name="confirmPassword" placeholder='confirm password' value={formData.confirmPassword} onChange={handleChange} />
        <input className='' type='checkbox' name='showPassword' onClick={() => passwordToggle()}/>Show Password
        <button onClick={(e) => handleSend(e)}>submit</button>
      </form>
    </main>
  )
}
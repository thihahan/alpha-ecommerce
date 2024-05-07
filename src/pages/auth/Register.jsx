import React, { useState } from 'react'
import { useRegisterMutation } from '../../api/auth/authApi'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { addToken, addUser } from '../../features/AuthSlice'
import Loader from '../../components/Loader'

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [register] = useRegisterMutation()
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const nav = useNavigate()
  const dispatch = useDispatch()
  const submitHandler = async (e) => {
    e.preventDefault()
    const userData = {name, email, password, password_confirmation: passwordConfirmation}
    setIsLoading(true)
    const data = await register(userData)
    if(data.data){
        console.log("data : ", data);
        const token = data.data?.token
        const user = data.data?.user
        Cookies.set("token", token)
        Cookies.set("user", JSON.stringify(user))
        dispatch(addUser({user}))
        dispatch(addToken(token))
        nav("/", {state : data.data?.message})
        setName("")
        setEmail("")
        setPassword("")
        setPasswordConfirmation("")
    }if(data.error){
        console.log("error : ", data.error);
        setError(data.error?.data?.errors)
    }
    
    setIsLoading(false)
  }
  return (
    <>
    <div className='font-roboto'>
        <div className={`m-5 border p-5 rounded shadow-md ${darkMode && "border-gray-500"}`}>
            <h3 className='text-xl mb-5 font-bold text-center'>Sign up a account</h3>
            <form action="" onSubmit={submitHandler}>
                <div className="mb-3">
                    <input type="text"
                    placeholder='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`input ${darkMode && "bg-gray-700 border-gray-500"}`} />
                    {
                        error?.name?.map((err, i) => <p key={i} className='text-sm text-red-500'>{err}</p>)
                    }
                </div>
                <div className="mb-3">
                    <input type="email" 
                    placeholder='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`input ${darkMode && "bg-gray-700 border-gray-500"}`} />
                    {
                        error?.email?.map((err, i) => <p key={i} className='text-sm text-red-500'>{err}</p>)
                    }
                </div>
                <div className="mb-3">
                    <input type="password" 
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`input ${darkMode && "bg-gray-700 border-gray-500"}`} />
                    {
                        error?.password?.map((err, i) => <p key={i} className='text-sm text-red-500'>{err}</p>)
                    }
                </div>
                <div className="mb-3">
                    <input type="password" 
                    placeholder='confirm password'
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className={`input ${darkMode && "bg-gray-700 border-gray-500"}`} />
                </div>
                <div>
                    <button className="w-full button auth-btn">Sign up</button>
                </div>
            </form>
        </div>
        <div>
            <h3 className="text-center">
                Already have an account?
                <Link className='cursor-pointer' to={"/login"}>
                    <span className="mx-2 font-bold">Sign in</span>
                </Link>
            </h3>
        </div>
    </div>
   {
    isLoading &&  <div> <Loader /></div>
   }
    </>
  )
}

export default Register
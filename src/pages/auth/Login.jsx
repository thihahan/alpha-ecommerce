import React, { useState } from 'react'
import { useLoginMutation, useRegisterMutation } from '../../api/auth/authApi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { addToken, addUser } from '../../features/AuthSlice'
import Loader from "../../components/Loader"

const Login = () => {
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [login] = useLoginMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [notFoundError, setNotFoundError] = useState()
  const nav = useNavigate()

  const dispatch = useDispatch()
  const submitHandler = async (e) => {
    e.preventDefault()
    setNotFoundError(null)

    const userData = {email, password}
    setIsLoading(true)
    const data = await login(userData)
    if(data.data){
        console.log("data : ", data);
        const token = data.data?.token
        const user = data.data?.user
        Cookies.set("token", token)
        Cookies.set("user", JSON.stringify(user))
        dispatch(addUser({user}))
        dispatch(addToken(token))
        const redirectTo = location.state?.redirectTo
        redirectTo ? nav(redirectTo) : nav("/", {state : data.data?.message})
        return
    }if(data.error){
        console.log("error : ", data.error.data.error);
        data.error.data?.error && setNotFoundError(data.error.data?.error)
        setError(data.error?.data?.errors)
    }
    setEmail("")
    setPassword("")
    setIsLoading(false)
    // console.log(data);
  }
  return (
    <>
    {
        isLoading && <Loader />
    }
    <div className='font-roboto'>
        <div className={`m-5 border p-5 rounded shadow-md ${darkMode && "border-gray-500"}`}>
            <h3 className='text-xl mb-5 font-bold text-center'>Sign in to your account</h3>
            {
                notFoundError && <h3 className='my-2 text-center text-red-500 text-lg'>{notFoundError}</h3>
            }
           {
            location.state?.message && <h3 className='my-2 text-center text-red-500 text-lg'>{location.state?.message}</h3>
           }
            <form action="" onSubmit={submitHandler}>
                
                <div className="mb-3">
                    <input type="email" 
                    value={email}
                    placeholder='email'
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${darkMode && "bg-gray-700 border-gray-500"} border outline-none py-2 px-1 rounded shadow-sm`} />
                    {
                        error?.email?.map((err, i) => <p key={i} className='text-sm text-red-500'>{err}</p>)
                    }
                </div>
                <div className="mb-3">
                    <input type="password" 
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full ${darkMode && "bg-gray-700 border-gray-500"} border outline-none py-2 px-1 rounded shadow-sm`} />
                    {
                        error?.password?.map((err, i) => <p key={i} className='text-sm text-red-500'>{err}</p>)
                    }
                </div>
                
                <div>
                    <button className="w-full button auth-btn">Login</button>
                </div>
            </form>
        </div>
        <div>
            <h3 className="text-center">
                Don't have an account?
                <Link to={"/register"}>
                    <span className="mx-2 font-bold">Sign up</span>
                    
                </Link>
            </h3>
        </div>
    </div>
    </>
  )
}

export default Login
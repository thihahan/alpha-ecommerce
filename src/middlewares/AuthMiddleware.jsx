import Cookies from 'js-cookie'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AuthMiddleware = () => {
    const token = Cookies.get("token")
    if(!token){
      return <Navigate to={"/"} />
    }
    return <Outlet />
}

export default AuthMiddleware
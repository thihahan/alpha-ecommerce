import Cookies from 'js-cookie'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const GuestMiddleware = () => {
  const token = Cookies.get("token")
  if(token){
    return <Navigate to={"/"} />
  }
  return <Outlet />
}

export default GuestMiddleware
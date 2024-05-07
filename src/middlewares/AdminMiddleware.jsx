import Cookies from 'js-cookie'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AdminMiddleware = () => {
  const user = JSON.parse(Cookies.get("user"))
  if(user.roles === "admin"){
    return <Outlet />
  }
  return <Navigate to={"/"} />
}

export default AdminMiddleware
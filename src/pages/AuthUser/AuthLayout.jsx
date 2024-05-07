import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useGetAdminOrdersQuery, useGetUsersQuery } from '../../api/productApi'
import { setOrders } from '../../features/OrdersSlice'

import { addToken, addUser, removeAuth } from '../../features/AuthSlice'
import { useGetOwnerQuery, useGetUsersByAdminQuery } from '../../api/auth/authApi'
import { addUsers } from '../../features/UsersSlice'

const AuthLayout = () => {
  const dispatch = useDispatch()
  const token = Cookies.get("token")
  const UserData = useGetOwnerQuery()
  const [isLoading, setIsLoading] = useState(false)
  const usersData = useGetUsersByAdminQuery()
  const authUser = useSelector(state => state.auth.user)
  const usersDataToChange = useGetUsersQuery()

  const ordersData = useGetAdminOrdersQuery()

  useEffect(() => {
    if(ordersData.data){
        dispatch(setOrders(ordersData?.data.orders))
    }
  }, [ordersData])

  useEffect(() => {
    setIsLoading(true)
    if(usersData.data){
        dispatch(addUsers(usersData.data?.users))
    }
    setIsLoading(false)
  }, [token, usersData])

  useEffect(() => {
    setIsLoading(true)
    if(usersDataToChange.data){
      const users = usersDataToChange.data?.users
      dispatch(addUsers(users))
    }
    setIsLoading(false)
  }, [usersDataToChange])


  useEffect(() => {
    setIsLoading(true)
    if(token){
      if(UserData.data){
        const user = UserData?.data?.user 
        if(authUser?.id == user?.id){
          dispatch(addUser({user}))
        }
        dispatch(addToken(token))
      }
    }else{
      dispatch(removeAuth())
    }

  }, [token, UserData])


  return (
      <Outlet/>
  )
}

export default AuthLayout
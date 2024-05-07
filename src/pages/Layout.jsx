import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { replaceCart } from '../features/ProductSlice'
import Cookies from 'js-cookie'
import { addToken, addUser, removeAuth } from '../features/AuthSlice'
import { useGetOwnerQuery } from '../api/auth/authApi'
import { useGetCartQuery } from '../api/cartApi'

const Layout = () => {
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const dispatch = useDispatch()
  const token = Cookies.get("token")
  const userData = useGetOwnerQuery()
  const cartData = useGetCartQuery(token)
  

  useEffect(() => {
    if(token){
      if(cartData.data){
        console.log("data", cartData?.data);
  
        dispatch(replaceCart({"cart" : cartData?.data?.cartItems}))
      }
      if(cartData.error){
        console.log("error", cartData?.error);
      }
    }
    
  }, [cartData])

  useEffect(() => {
    if(token){
      if(userData.data){
        const user = userData.data?.user
        dispatch(addToken(token))
      }
    }else{
      dispatch(removeAuth())
    }
  }, [userData])

  useEffect(() => {
    if(token){
      const user = JSON.parse(Cookies.get("user"))
      dispatch(addUser({user}))
    }
  }, [])
  return (
    <div className={`relative ${darkMode && "bg-gray-700 text-white"}`}>
        <nav className='sticky top-0 z-50'>
            <Nav />
        </nav>
        <main className='font-noto'>
          <Outlet />
        </main>
    </div>
  )
}

export default Layout
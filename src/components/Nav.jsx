import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {useGetOwnerQuery, useLogoutMutation } from '../api/auth/authApi'
import Cookies from 'js-cookie'
import { MdOutlineEventNote} from "react-icons/md"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux'
import { BsPersonCircle } from "react-icons/bs"
import { removeAuth } from '../features/AuthSlice'
import UserLinks from './UserLinks'
import SearchBox from './SearchBox'
import { removeAll } from '../features/ProductSlice'
import Loader from './Loader'
const Nav = () => {
  const user = useSelector(state => state.auth.user)
  const [logout] = useLogoutMutation()
  const [showUserLinks, setShowUserLinks] = useState(false)
  const token = Cookies.get("token")
  const [isLoading, setIsLoading] = useState(false)
  const nav = useNavigate()
  const dispatch = useDispatch()
  const cart = useSelector(state => state.products.cart)
  const location = useLocation()

  window.addEventListener("click", () => {
    setShowUserLinks(false)
  })

  const logoutHandler = async () => {
    setIsLoading(true)
    const {data, error} = await logout()
    setIsLoading(false)
    if(error){
      console.log(error);
      alert("server error occured")
      return
    }
    // alert("logout succe")
    Cookies.remove("token")
    Cookies.remove("user")
    dispatch(removeAuth())
    dispatch(removeAll())
    setShowUserLinks(false)
    nav("/", {state : "user logout sccessfully"})
  }
  return (
    isLoading ? <Loader />:
    <div className={`flex justify-between font-mono items-center py-2 px-3 border-b bg-white`}>
      <div>
        <h2 className='text-2xl font-bold cursor-pointer select-none'>
          <NavLink to={"/"}>#Alpha-Ecommerce</NavLink>
        </h2>
      </div>
      <div className={`flex gap-2 items-center`}>
      
      {
        token ? (
            <>
            
              <NavLink to={"cart"}>
          
            <div className='flex gap-2 items-center px-3 py-2 rounded hover:bg-gray-100'>
                <div className='relative cursor-pointer active:scale-95'>
                  <AiOutlineShoppingCart className='text-2xl'/>
                  <span className='absolute text-sm -top-3 bg-red-400 -right-2 px-2 text-white rounded-full z-50'>{cart?.length}</span>
                </div>
                <span>Cart</span>

            </div>
          </NavLink>

          <NavLink end to={"/orders"} onClick={() => setShowUserLinks(false)}>
                <div className='hover:bg-gray-100 px-3 py-2 rounded flex items-center gap-2'>
                    <span> <MdOutlineEventNote className='text-2xl' /></span>
                    <span>Orders</span>
                </div>
            </NavLink>
            <div className='select-none relative mx-3'>
            <div className='cursor-pointer' 
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUserLinks(!showUserLinks)
                    }}>

                {
                  user?.profile_photo_url ? (<>
                      <img className='h-[40px] rounded-full' src={user?.profile_photo_url} alt="" />
                  </>) : (<>
                    <BsPersonCircle className='text-[25px] rounded-full'/>
                  </>)
                }
                    </div>

                <div className={`${!showUserLinks && "hidden"} relative`}>
                  <UserLinks user={user} logoutHandler={logoutHandler} setShowUserLinks={setShowUserLinks}/>
                </div>
            </div>
            </>
        ) : (
          <>
          <div className='select-none'>
              <NavLink to={"/register"}
              className={({isActive}) => isActive ? "font-bold" : "hover:font-bold"}
              >Register</NavLink>
          </div>
          <div className='select-none'>
              <NavLink to={"/login"}
              className={({isActive}) => isActive ? "font-bold" : "hover:font-bold"}
              >Login</NavLink>
          </div>
          </>
        )
      }
        
        
    </div>
    </div>
  )
}

export default Nav
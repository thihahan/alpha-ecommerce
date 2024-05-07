import React, { useState } from 'react'
import { NavLink, Outlet, useSearchParams } from 'react-router-dom'
import {BsBoxSeam, BsPlusSquare} from "react-icons/bs"
import { MdOutlineEventNote } from 'react-icons/md'
import { HiMiniUsers } from "react-icons/hi2"
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx"
import { useDispatch } from 'react-redux'
import { TbCategory2 } from "react-icons/tb";

const Dashboard = () => {
  const [showDashboard, setShowDashboard] = useState(false)
  
  return (
    <div className='relative'>
    
    <div className='flex relative'>
        {/*fixed right-full */}
        <div className={`flex h-full bg-white fixed top-[50px] z-40 transform transition-all duration-300 ${showDashboard ? "translate-x-0" : "-translate-x-full"}`}>
            <div className={`border-r-2 p-3 w-[300px] ${showDashboard ? "" : ""}`}>
            <h3 className='font-bold flex items-center justify-between text-xl mb-3'>
                <span>Alpha Ecommerce</span>
                <span
                onClick={() => setShowDashboard(false)}
                className='p-2 bg-gray-100 active:scale-95 hover:bg-gray-200 cursor-pointer border-none rounded'>
                    <RxCross1 />
                </span>
            </h3>
            <div className='flex flex-col'>
                        <NavLink className={({isActive}) => isActive && "active-link"} 
                        to={`/dashboard`} 
                        end>
                        <div className='link'>
                            <span><BsBoxSeam /></span>
                            <span>Products</span>
                        </div>  
                        </NavLink>
                        <NavLink className={({isActive}) => isActive && "active-link"} 
                        to={`products/create`}>
                            <div className='link'>
                                <span><BsPlusSquare /></span>
                                <span>Add Product</span>
                            </div>
                        </NavLink>
                        <NavLink className={({isActive}) => isActive && "active-link"} 
                        to={`categories`} 
                        end>
                        <div className='link'>
                            <span><TbCategory2 /></span>
                            <span>Categories</span>
                        </div>  
                        </NavLink>
                        <NavLink 
                        className={({isActive}) => isActive && "active-link"} 
                        to={`orders`}>
                            <div className='link'>
                                <span><MdOutlineEventNote className='' /></span>    
                                <span>Orders</span>
                            </div>
                        </NavLink>
                        <NavLink 
                        className={({isActive}) => isActive && "active-link"} 
                        to={`users`} end>
                            <div className="link">
                                <span><HiMiniUsers /></span>
                                <span>users</span>
                            </div>
                        </NavLink>
            </div>
        </div>
        </div>
        <div className="w-full h-screen mx-5">
            <div className='w-full flex justify-between items-center my-2'>
            <button className="button flex gap-2 items-center" onClick={() => setShowDashboard(true)}>
            <span><RxHamburgerMenu /></span>
                <span>Dashboard</span>
            </button>
            </div>
            <Outlet />

        </div>
    </div>
    </div>

  )
}

export default Dashboard
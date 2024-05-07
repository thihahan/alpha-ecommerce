import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsPersonCircle} from "react-icons/bs"
import { RiDashboardFill } from "react-icons/ri"
import { TbLogout } from "react-icons/tb"
import { useDispatch, useSelector } from 'react-redux'

const UserLinks = ({user, logoutHandler, setShowUserLinks}) => {
  const dispatch = useDispatch()
  return (
    <div className='absolute w-[400px] z-50 -right-4 top-0  p-4 bg-white border'>
        <div className='flex gap-3 items-center mb-2'>

          <div>
            {
              user?.profile_photo_url ? (<>
              <img className='w-[50px] rounded-full' src={user?.profile_photo_url} alt="" />
              </>) : (<>
                <BsPersonCircle className='text-[35px] rounded-full'/>
                
              </>)
            }
              
          </div>
          <div>
              <h3>{user?.name}</h3>
              <h3>{user?.email}</h3>
          </div>
      </div>
      <hr />
      {
              user?.roles == "admin" && (
                <>
                  <NavLink to={"/dashboard"} onClick={() => setShowUserLinks(false)}>
                        <div className='select-none active:scale-105 flex items-center gap-3 hover:bg-gray-100 py-2 px-1'>
                            <span><RiDashboardFill /></span>
                            <span>Dashboard</span>
                    </div>
              </NavLink>
                <hr />
                </>

              )
            }
        <NavLink to={"/profile"} onClick={() => setShowUserLinks(false)}>
            <div className='active:scale-105 hover:bg-gray-100 py-2 px-1'>
                <span className='cursor-pointer select-none flex items-center gap-3'><span>
                    <span>
                        <BsPersonCircle />
                    </span>          
                    </span>Profile</span>
            </div>
        </NavLink>
        <hr />
        <div 
        className='active:scale-105 flex items-center gap-3 hover:bg-gray-100 py-2 px-1 cursor-pointer select-none' 
        onClick={logoutHandler}
        >
                <span><TbLogout /></span>    
                <span>Logout</span>
        </div>
        <hr />
    </div>                         
  )
}

export default UserLinks
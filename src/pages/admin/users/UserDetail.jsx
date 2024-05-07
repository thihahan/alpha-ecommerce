import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RiArrowDropDownLine, RiArrowUpSLine, RiEditFill } from "react-icons/ri"
import "animate.css"
import AreYouSure from '../../../components/AreYouSure'
import { BsPersonCircle } from "react-icons/bs" 
import { addCurrentUser } from '../../../features/UsersSlice'
import Loader from '../../../components/Loader'
import { useDeleteUserMutation, useGetUserQuery } from '../../../api/productApi'

const UserDetail = () => {
  const { id } = useParams()
  const {data, error, isLoading} = useGetUserQuery(id)
  const [user, setUser] = useState()
  const [actionBtnsShow, setActionBtnsShow] = useState(false)
  const [showSureBtn, setShowSureBtn] = useState(false)
  const [deleteUser] = useDeleteUserMutation()
  const nav = useNavigate()
  const dispatch = useDispatch()
  const [customerLoader, setCustomLoader] = useState(false)
  const userEditHandler = () => {
    return nav(`/dashboard/users/edit/${id}`, {state : {"redirectTo" : `${location.pathname}`}})
  }

  window.addEventListener("click", () => {
    setActionBtnsShow(false)
  })

  const deleteAccountHandler = async () => {
    setCustomLoader(true)
    const { data, error} = await deleteUser(id)
    if(error){
      dispatch(deleteUser({id}))
    }else{
      nav("/dashboard/users")
    }
    setCustomLoader(false)

  } 
  useEffect(() => {
    if(data){
      console.log("data from user detail", data.user);
      setUser(data?.user)
      dispatch(addCurrentUser(data?.user))
    }
  }, [data, isLoading])
  return (
   customerLoader ? <Loader /> : <>
   <div className='m-5 relative'>
      <div className='border p-3 flex justify-between items-center'>
      <div className='flex gap-3 items-center'>
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
      <div>
      {
        user?.roles != "admin" && <>
        <div className='relative'>
        <h3 
        onClick={(e) => {
          e.stopPropagation()
          setActionBtnsShow(!actionBtnsShow)
        }}
        className='flex cursor-pointer select-none px-5 justify-center py-2 bg-blue-500 rounded-md text-white items-center gap-1'>
          <span>Actions</span> 
        {
          actionBtnsShow ? (<span 
            className='text-lg font-bold hover:scale-105 cursor-pointer'><RiArrowUpSLine />
            </span>) : (<span 
        className='text-2xl hover:scale-105 cursor-pointer'><RiArrowDropDownLine />
        </span>)
        }
        
        </h3>
      </div>
        </>
      }
      <div className={`absolute bg-white border transition-all duration-100 ${!actionBtnsShow ? "hidden" : ""}`}>
        <div 
        onClick={() => userEditHandler()}
        className='hover:bg-gray-100 active:bg-gray-200 select-none cursor-pointer text-green-500 font-bold px-1 py-2 flex gap-2 items-center'> <span>Edit</span> <span className=''><RiEditFill /></span></div>
        <hr />
        <div 
        onClick={() => setShowSureBtn(true)}
        className='px-1 py-2 font-bold active:bg-gray-200 select-none hover:bg-gray-100 cursor-pointer text-red-500'>Delete Account</div>
      </div>
      </div>
    </div>
    <div className='my-5'>
      <NavLink className={({isActive}) => isActive ? "font-bold border-b-2 border-gray-900 px-4 py-1 mx-1" : "px-4 py-3 mx-1"} 
      to={""} end>Detail</NavLink>

      <NavLink className={({isActive}) => isActive ? "font-bold border-b-2 border-gray-900 px-4 py-1 mx-1" : "px-4 py-3 mx-1"} 
      to={"cart"}>Cart</NavLink>

      <NavLink className={({isActive}) => isActive ? "font-bold border-b-2 border-gray-900 px-4 py-1 mx-1" : "px-4 py-3 mx-1"} 
      to={"orders"}>Orders</NavLink>
    </div>
    <div>
      <Outlet />
    </div>
    <div>
      <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} actionHandler={deleteAccountHandler}/>
    </div>
   </div>
   </>
  )
}

export default UserDetail
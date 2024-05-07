import React, { useEffect, useRef, useState } from 'react'
import { useAddProfilePhotoMutation } from '../../../api/UserApi'
import { BiDetail,BiTrash,BiSolidEdit } from "react-icons/bi"
import { useNavigate, useSearchParams } from 'react-router-dom'
import AreYouSure from '../../../components/AreYouSure'
import { BsPersonCircle } from "react-icons/bs"
import Action from '../../../components/Action'
import { AiOutlineShoppingCart } from "react-icons/ai"  
import Loader from '../../../components/Loader'
import SearchBox from '../../../components/SearchBox'
import ProductsPagesSwicher from '../../../components/ProductsPagesSwicher'
import { createParmsObj } from '../../../utils/createSearchParmsObj'
import { useGetUsersQuery, useDeleteUserMutation } from '../../../api/productApi'

const Users = () => {
//   const users = useSelector(state => state.usersSlice.users)
  const [searchParams, setSearchParams] = useSearchParams()
  // links

  const [params, setParams] = useState()
  const [links, setLinks] = useState()
  const [lastPage, setLastPage] = useState()
  const {data, error, isLoading} = useGetUsersQuery(params)
  const [users, setUsers] = useState()
  const [roles, setRoles] = useState()
  const [showSureBtn, setShowSureBtn] = useState(false)
  const [deletedId, setDeletedId] = useState()
  const [customLoading, setCustomLoading] = useState(false)
  const nav = useNavigate()
  const [deleteUser] = useDeleteUserMutation()
  const deleteAccountHandler = async () => {
    setCustomLoading(true)
    const { data, error} = await deleteUser(deletedId)
    if(data){
        console.log(data);
    }
    if(error){
      console.log(error);
    }else{
      nav("/dashboard/users")
    }
    setCustomLoading(false)
    setShowSureBtn(false)
  
}
    useEffect(() => {
        const role = searchParams.get('role')
        const searchParamsSting = searchParams.toString()
        setParams(searchParamsSting)
        setRoles(role)
    }, [searchParams])
 
    useEffect(() => {
        setCustomLoading(true)
    }, [])

  useEffect(() => {
    if(data){
        console.log("users", data);
        setUsers(data?.data)
        setLinks(data?.meta?.links)
        setLastPage(data?.meta.last_page)
    }
    setCustomLoading(false)
  }, [data, isLoading])

  

  return (
    <>
        {
            (customLoading || isLoading) ? (
                <Loader />
            ) : (
<               div className='relative'>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h3 className='text-lg font-bold'>Users</h3>
                        </div>
                        <div className='flex items-center'>
                        <SearchBox />
                        <div className="mx-2 flex items-center">
                            <label htmlFor="roles" className='flex items-center gap-2'>Role <span>:</span></label>
                            <select name="" id="roles" 
                            onChange={(e) => {
                                const searchParamsObj = createParmsObj(searchParams)
                                setSearchParams({...searchParamsObj, role : e.target.value, page : 1})
                            }}
                            className='input mx-2'>
                                <option selected={roles != "admin" && roles != "customer"} value="">
                                    choose role
                                </option>
                                <option selected={roles == "admin"} value="admin">admin</option>
                                <option selected={roles == "customer"} value="customer">customer</option>
                            </select>
                        </div>
                        {
                            (roles) &&
                            <div className='mx-2'>
                            <p 
                            onClick={() => {
                                const searchParamsObj = createParmsObj(searchParams)
                                setSearchParams({...searchParamsObj, role : ""})
                            }}
                            className='text-red-500 font-bold underline cursor-pointer select-none'>remove filter</p>
                            </div>
                            }
                        </div>
                            
                    </div>
                 <table className='w-full'>
                <thead>
                <tr>
                    <th className=''>#</th>
                    <th className=''>Profile</th>
                    <th className=''>Name</th>
                    <th className=''>Email</th>
                    <th className=''>Roles</th>
                    <th className=''>Cart</th>
                    <th className=''>Orders</th>
                    <th className=''>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    users?.map((user, index) => (
                        <tr key={user.id}>
                            <td className='text-center border p-2'>{user.id}</td>
                            <td className='text-center border p-2 flex justify-center items-center'>
                            {
                                user?.profile_photo_url ? (<>
                                <img className='w-[50px]' src={user?.profile_photo_url} alt="" />
                                </>) : (<>
                                    <BsPersonCircle className='text-[45px] rounded-full'/>
                                </>)
                                }
                            </td>
                            <td className='text-center border p-2'>{ user.name }</td>
                            <td className='text-center border p-2'>{ user.email }</td>
                            <td className='text-center border p-2'>{ user.roles }</td>
                            <td className='border p-2'>
                                <div className='flex justify-center' onClick={() => nav(`${user.id}/cart`)}>
                                    <div className='relative cursor-pointer active:scale-95'>
                                        <AiOutlineShoppingCart className='text-2xl'/>
                                        <span className='absolute text-sm -top-3 -right-2 bg-red-400 px-2 text-white rounded-full z-40'>{user?.cart?.cartItems?.length}</span>
                                    </div>
                                </div>
                            </td>
                            <td className='text-center underline cursor-pointer border p-2' 

                            onClick={() => nav(`${user.id}/orders`)}>view</td>
                            <td className='text-center border p-2'>
                                <div className='flex justify-center'>

                                <Action icon={<BiDetail />} actionHandler={() => nav(`${user.id}`)}
                                text={"Detail"} textColor={""} 
                                />
                                {
                                    user.roles != "admin" && <>
                                    <Action icon={<BiSolidEdit />} textColor={"text-green-500"} text={"Edit"} actionHandler={() => nav(`/dashboard/users/edit/${user.id}`)} />

                                    <Action icon={<BiTrash />} actionHandler={() => {
                                        setShowSureBtn(true)
                                        setDeletedId(user.id)
                                    }} text={"Remove"} textColor={"text-red-500"}/>

                                    </>
                                }
                                {/*edit */}
                                </div>
                            </td>
                            {/* <td>{ user. }</td> */}
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <div>
            <ProductsPagesSwicher links={links} lastPage={lastPage}/>
        </div>
        <div>
            <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} actionHandler={deleteAccountHandler}/>
        </div>
                </div>
            )
}
</>
  )
}

export default Users
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetUserQuery, useUpdateUserMutation, useUpdateProfilePhotoMutation } from '../../../api/productApi'
import { BsPencil, BsPersonCircle } from "react-icons/bs"
import Loader from '../../../components/Loader'
import uuid4 from 'uuid4'

const UserEdit = () => {
  const [user, setUser] = useState()
  const {id} = useParams()
  const {data, error, isLoading} = useGetUserQuery(id)

  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [phone_number, setPhoneNo] = useState()
  const [address, setAddress] = useState("")
  const [roles, setRoles] = useState()
  const [profileImage, setProfileImage] = useState()
  const [updateUser] = useUpdateUserMutation()
  const [errors, setErrors] = useState()
  const location = useLocation()
  const [customLoader, setCustomLoader] = useState(false)

  // for image editor 
  const [image, setImage] = useState()
  const [isImageChanging, setIsImageChanging] = useState(false)
  const [changedImageUrl, setChangedImageUrl] = useState()
  const [updateProfilePhoto] = useUpdateProfilePhotoMutation()
  const imageRef = useRef()
  const nav = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setCustomLoader(true)
    const body = {name, email, phone_number ,address, roles}
    const id = user.id
    const {data, error} = await updateUser({body, id})
    if(data){
      console.log(data);
      const redirectTo = location.state?.redirectTo
      redirectTo ? nav(redirectTo) : nav(`/dashboard/users/${id}`)
    }
    if(error){
      console.log(error);
      setErrors(error?.data?.errors)
    }
    setCustomLoader(false)
  }

  useEffect(() => {
    if(image){
      if(image?.type == "image/png" || image?.type == "image/jpg" || image?.type == "image/jpeg"){
        const imageUrl = URL.createObjectURL(image)
        setChangedImageUrl(imageUrl)
        setIsImageChanging(true)
      }else{
        alert("file type must be png or jpg or jpeg")
      }
    }
  }, [image])
  const cancelProfileImageHandler = () => {
    setImage(null)
    setIsImageChanging(false)
    setChangedImageUrl(null)
  }

  const changeProfileImageHandler =async () => {
    setCustomLoader(true)
    const formData = new FormData()
    formData.append("_method", "PUT")
    formData.append("image", image)
    const id = user.id
    const {data, error} = await updateProfilePhoto({formData, id})
    if(data){
      console.log(data);
      cancelProfileImageHandler()
    }
    if(error){
      console.log(error);
    }
    setCustomLoader(false)
    
  }

  useEffect(() => {
    if(data){
      console.log("user ", data);
      setUser(data?.user)
      const tempUser = data?.user
      setName(tempUser.name)
      setEmail(tempUser?.email)
      setPhoneNo(tempUser?.phone_number)
      setAddress(tempUser?.address)
      setRoles(tempUser?.roles)
      setProfileImage(tempUser?.profile_photo_url)
    }
  }, [data, isLoading])
  return (
    customLoader ? (<Loader />) : (

      <div className='m-5'>
      <div className="p-3 border mb-3">
      <div className='flex gap-3'>
        <div className='flex flex-col items-center gap-2'>
        <div className='relative'>
          {
            isImageChanging ? <>
              <img className='w-[70px] rounded-full' src={changedImageUrl} alt="" />
            </> : <>
             {
              profileImage ?
                <img className='w-[70px] rounded-full' src={profileImage} alt="" />
                : <BsPersonCircle className='text-[50px] rounded-full'/>
             }
            </>
            }
            <div className='absolute border bg-gray-200 p-1 rounded-full top-0 -right-1 cursor-pointer hover:bg-gray-300'
            onClick={() => imageRef.current.click()} 
            >
              <BsPencil className='' />
              <input type="file" name="" className='hidden' 
              ref={imageRef} 
              onChange={(e) => setImage(e.target.files[0])} id="" />
            </div>
            
          </div>
          {
              isImageChanging && 
              <div className='flex gap-2'>
                <button className="button" onClick={cancelProfileImageHandler}>cancel</button>
                <button className="button" onClick={changeProfileImageHandler}>save</button>
              </div>
            }
        </div>
          
          <div>
              <h3>{user?.name}</h3>
              <h3>{user?.email}</h3>
          </div>
      </div>
      </div>
      <div>
        <h3>Edit Customer</h3>
        <form action="" className='p-3 border' id='editForm' onSubmit={(e) => submitHandler(e)}>
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <input type="text" name="" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input" id="" />
            {
              errors?.name?.map(err => <p key={uuid4()} className='text-red-500'>{err}</p>)
            }
            
          </div>
          <div className="mb-3">
            <label htmlFor="name">Email</label>
            <input type="email" name="" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input" id="" />
            {
              errors?.email?.map(err => <p key={uuid4()} className='text-red-500'>{err}</p>)
            }
          </div>
          <div className="mb-3">
            <label htmlFor="name">Phone Number</label>
            <input type="number" name="" 
            value={phone_number}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="input" id="" />
            {
              errors?.phone_number?.map(err => <p key={uuid4()} className='text-red-500'>{err}</p>)
            }
          </div>
          <div className="mb-3">
            <label htmlFor="name">Address</label>
            <input type="text" name="" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input" id="" />
            {
              errors?.address?.map(err => <p key={uuid4()} className='text-red-500'>{err}</p>)
            }
          </div>
          <div className="mb-3">
            <label htmlFor="">User Role</label>
            <select name="" id="" 
            onChange={(e) => setRoles(e.target.value)}
            className='input'>
              <option selected={user?.roles == "customer"} value="customer">customer</option>
              <option selected={user?.roles == "admin"} value="admin">admin</option>
            </select>
            {
              errors?.roles?.map(err => <p key={uuid4()} className='text-red-500'>{err}</p>)
            }
          </div>
          
        </form>
        <div className="flex my-3 justify-between">
            <button className='button' 
            onClick={() => {
              const redirectTo = location.state?.redirectTo
              redirectTo ? nav(redirectTo) : nav("..")
            }}>Back</button>
            <button className='button' type='submit' form='editForm'>Update</button>
          </div>
      </div>
      
    </div>
    )
  )
}

export default UserEdit
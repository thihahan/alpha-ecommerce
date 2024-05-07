import React, { useEffect, useRef, useState } from 'react'
import { BsPencil } from "react-icons/bs"
import { BsPersonCircle } from "react-icons/bs"
import { useDeleteOwnerMutation, useGetOwnerQuery, useUpdateOwnerMutation, useUpdateOwnerProfilePhotoMutation } from '../../api/auth/authApi'
import AreYouSure from '../../components/AreYouSure'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { replaceCart } from '../../features/ProductSlice'
import { removeAuth } from '../../features/AuthSlice'
import Loader from '../../components/Loader'

const Profile = () => {
  const imageRef = useRef()
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const [changingPhoto, setChangingPhoto] = useState(false)
  const [image, setImage] = useState()
  const [changedPhotoUrl, setChangedPhotoUrl] = useState()
  const [profilePhotoUrl, setProfilePhotoUrl] = useState()
  const nav = useNavigate()
  // for change password
  const [showSureBtn, setShowSureBtn] = useState(false)
  const [oldPw, setOldPw] = useState()
  const [newPw, setNewPw] = useState()


  const [updateOwner] = useUpdateOwnerMutation()
  const [updateOwnerProfilePhoto] = useUpdateOwnerProfilePhotoMutation()
  const [deleteOwner] = useDeleteOwnerMutation()

  const [error, setError] = useState()

  const [name, setName] = useState()
  const [nameEdit, setNameEdit] = useState(false)

  const [email, setEmail] = useState()
  const [emailEdit, setEmailEdit] = useState(false)

  const [phone_number, setPhoneNumber] = useState()
  const [phoneEdit, setPhoneEdit] = useState(false)

  const [address, setAddress] = useState(user?.address) 
  const [addressEdit, setAddressEdit] = useState(false)

  const [passwordChanging, setPasswordChanging] = useState(false)

  const [customLoader, setCustomLoader] = useState(false)

  const cancelProfilePhotoHandler = () => {
    setImage(null)
    setProfilePhotoUrl(user?.profile_photo_url)
    setChangedPhotoUrl(null)
    setChangingPhoto(false)
  }


  const changeProfilePhotoHandler =async () => {
    setCustomLoader(true)
    const formData = new FormData()
    formData.append("_method", "PUT")
    formData.append("image", image)
    const id = user.id
    const {data, error} = await updateOwnerProfilePhoto({formData})
    if(data){
      console.log(data);
      Cookies.set("user", JSON.stringify(data?.user))
      cancelProfilePhotoHandler()
    }
    if(error){
      console.log(error);
    }
    setCustomLoader(false)
    
  }

  const changePwHandler = async () => {
    setCustomLoader(true)
    const body = { "old_password" : oldPw, "new_password" : newPw }
    const {data, error} = await updateOwner(body)
    if(data){
      console.log(data);
      setPasswordChanging(false)
    }
    if(error){
      console.log("pw error", error);
      setError(error)
    }
    setOldPw("")
    setNewPw("")
    console.log("changing password");
    setCustomLoader(false)
  }

  const deleteAccountHandler = async () => {
    setCustomLoader(true)
    const {data, error} = await deleteOwner()
    if(error){
      console.log(error);
    }else{
      Cookies.remove("token")
      Cookies.remove("user")
      dispatch(replaceCart([]))
      dispatch(removeAuth())
      return nav("/", {state : "user logout sccessfully"})
    }
    setCustomLoader(false)
    console.log("deleting");
  }
  const updateUserHandler = async (e,body, disableInput=null) => {
    setError(null)
    setCustomLoader(true)
    e.preventDefault()
    // const
    const {data, error} = await updateOwner(body)
    if(data){
      console.log(data);
      Cookies.set("user", JSON.stringify(data?.user))
      // setUser(data?.user)
    }
    if(error){
      console.log(error?.data?.errors);
      setError(error?.data?.errors)
    }
    disableInput && disableInput(false)
    setCustomLoader(false)

    // console.log(body);
  }

  useEffect(() => {
    if(image){
      console.log(image?.type);
      if(image?.type == "image/png" || image?.type == "image/jpg" || image?.type == "image/jpeg"){
        let photoUrl =URL.createObjectURL(image)

        setChangedPhotoUrl(photoUrl)
        setChangingPhoto(true)
      }else{
        alert("file type must me jpg or png")
      }
    }
  }, [image])


  useEffect(() => {
    if(user){
      setName(user.name)
      setEmail(user.email)
      setPhoneNumber(user.phone_number)
      setAddress(user.address)
      setProfilePhotoUrl(user.profile_photo_url)
    }
  }, [user])
  return (
    customLoader ? (<Loader />) : (
      <div className="relative p-5">
      <div className='flex gap-4 mx-10 items-center flex-col relative'>
        <div className='relative'>
          {
            changingPhoto ? (
              <img src={changedPhotoUrl} className='w-[300px] rounded-full' alt="" />
            ) : (
              <>
              {
                profilePhotoUrl ? (
                  <img src={profilePhotoUrl} className='w-[300px] rounded-full' alt="" />
                ) : (
                  <div className=""><BsPersonCircle className='w-[300px] h-[300px] border rounded-full'/></div>                  
                )
              }
              </>
            )
          }
          <input type="file" name="" className='hidden' ref={imageRef} onChange={(e) => setImage(e.target.files[0])} id="" />
          <span onClick={() => imageRef.current.click()} className='absolute p-3 bg-white -right-5 top-1/2 hover:bg-gray-100 cursor-pointer text-black rounded-full text-2xl'><BsPencil /></span>
        </div>
        {
          changedPhotoUrl && (
            <div className='flex justify-center gap-3'>
              <button className="button" onClick={cancelProfilePhotoHandler}>Cancel</button>
              <button 
              onClick={() => changeProfilePhotoHandler()}
              className="button">Save</button>
          </div>
          )
        }
        <div className='p-3 w-full border'>
        <div className='my-2'>
          <h3 className='font-bold'>Name</h3>
          <p className='flex items-center justify-between py-1'>
            {
              nameEdit ? (
                <>
                    <form action="" id='nameEdit'
                    className='w-full mr-3'
                    onSubmit={(e) => updateUserHandler(e,{name}, setNameEdit)}>
                    <input id='name'
                    
                    type="text" className='outline-none mr-3 w-full input'
                    onChange={(e) => setName(e.target.value)}
                    value={name} />
                    
                    </form>
                    <div className='flex gap-2'>

                    <button className='button'
                    onClick={() => {
                      setNameEdit(false) 
                      setName(user?.name)
                    }}
                    >Cancel</button>
                    <button form='nameEdit' className='button'>
                      Save
                    </button>
                  </div>
                </>
              ) : (
                  <>
                  <span className=''>{user?.name}</span>
                    <button 
                    onClick={() => {
                      setNameEdit(true)
                    }}
                    className='flex button gap-1 items-center cursor-pointer active:scale-105 px-2'>
                      <span>Edit</span><span className='text-sm'><BsPencil /></span>
                    </button>
                  </>
              )
            }
          </p>
          {
            error?.name?.map(message => <p className='text-red-500'>{message}</p>)
          }
        </div>
        <hr />
        <div className='my-2'>
          <h3 className='font-bold'>Email</h3>
          <p className='flex items-center justify-between py-1'>
            {
              emailEdit ? (
                <>
                    <form action="" className='w-full mr-3' id='emailEdit'
                    onSubmit={ (e) => updateUserHandler(e,{email}, setEmailEdit)}
                    >
                    <input id='email' type="text" className='outline-none mr-3 w-full input'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email} />
                    </form>
                    <div className='flex gap-2'>
                    <button className='button'
                    onClick={() => {
                      setEmailEdit(false)
                      setEmail(user?.email)
                    }}
                    >Cancel</button>
                    <button form='emailEdit' className='button'
                    >Save</button>
                  </div>
                </>
              ) : (
                  <>
                  <span className=''>{user?.email}</span>
                    <button 
                    onClick={() => {setEmailEdit(true)}}
                    className='flex button gap-1 items-center cursor-pointer active:scale-105 px-2'>
                      <span>Edit</span><span className='text-sm'><BsPencil /></span>
                    </button>
                  </>
              )
            }
            
            
          </p>
          {
            error?.email?.map(message => <p className='text-red-500'>{message}</p>)
          }
        </div>
        <hr />

        <div className='my-2'>
          <h3 className='font-bold'>Phone Number</h3>
          <p className='flex items-center justify-between py-1'>
            {
              phoneEdit ? (
                <>
                    <form action="" className='w-full mr-3' id='phoneEdit'
                    onSubmit={(e) => updateUserHandler(e,{phone_number}, setPhoneEdit) }
                    >
                      <input id='name' type="text" className='outline-none mr-3 w-full input'
                      value={phone_number} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </form>

                    <div className='flex gap-2'>
                      <button className='button'
                      onClick={() => {
                        setPhoneEdit(false)
                        setPhoneNumber(user?.phone_number)
                      }}
                      >Cancel</button>
                      <button className='button' type='submit' form='phoneEdit'>Save</button>
                  </div>
                </>
              ) : (
                  <>
                  <span className=''>{user?.phone_number}</span>
                    <button 
                    onClick={() => {
                      setPhoneEdit(true)
                    }}
                    className='flex button gap-1 items-center cursor-pointer active:scale-105 px-2'>
                      <span>Edit</span><span className='text-sm'><BsPencil /></span>
                    </button>
                  </>
              )
            }
          </p>
          {
            error?.phone_number?.map(message => <p className='text-red-500'>{message}</p>)
          }
        </div>
        <hr />

        <div className='my-2'>
          <h3 className='font-bold'>address</h3>
          <p className='flex items-center justify-between py-1'>
            {
              addressEdit ? (
                <>
                    <form action="" 
                    onSubmit={(e) => updateUserHandler(e,{address}, setAddressEdit)}
                    className='w-full mr-3' id='addressEdit'>
                      <input id='name' type="text" className='outline-none mr-3 w-full input'
                      onChange={(e) => setAddress(e.target.value)}
                      value={address} 
                      />
                    </form>

                    <div className='flex gap-2'>
                    <button className='button'
                    onClick={() => {
                      setAddressEdit(false)
                      setAddress(user?.address)
                    }}
                    >Cancel</button>
                    <button className='button' form='addressEdit'>Save</button>
                  </div>
                </>
              ) : (
                  <>
                  <span className=''>{user?.address}</span>
                    <button 
                    onClick={() => {
                      setAddressEdit(true)
                    }}
                    className='flex button gap-1 items-center cursor-pointer active:scale-105 px-2'>
                      <span>Edit</span><span className='text-sm'><BsPencil /></span>
                    </button>
                  </>
              )
            }
          </p>
          
        </div>
        <hr />
        {
          user?.roles == "admin" && (
            <div className='my-2'>
              <h3 className='font-bold'>Role</h3>
              <p>{user?.roles}</p>
          </div>
          )
        }
        
        <hr />
          <div className="my-2">
            {
              passwordChanging ? (
                <div className=''>
                  <div className="my-2">
                      <input type="password"
                      value={oldPw}
                      onChange={(e) => setOldPw(e.target.value)}
                      placeholder='old password' className="input" />

                    </div>
                    <div className="my-2">
                      <input type="password" 
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder='new password' className="input" />

                    </div>
                    <div className="my-2 flex gap-3">
                      <button className="button" onClick={() => {
                        setOldPw(null)
                        setNewPw(null)
                        setPasswordChanging(false)
                      }}>Cancel</button>
                      <button className="button" onClick={changePwHandler}>Change Password</button>
                    </div>
                </div>
              ) : (
                <button className='button ' onClick={() => setPasswordChanging(true)}>Change Password</button>
              )
            }
            {
            error?.error && <p className='text-red-500'>{error?.error}</p>
          }
          </div>
      </div>
      


      <div className='flex w-full justify-end'>
        <button 
        onClick={() => setShowSureBtn(true)}
        className='button bg-red-500 hover:bg-red-600 text-white'>Delete Account</button>
      </div>
      <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} actionHandler={deleteAccountHandler}/>
      </div>
          
    </div>

    )
  )
}

export default Profile
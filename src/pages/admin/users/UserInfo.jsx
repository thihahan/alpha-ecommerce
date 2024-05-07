import React from 'react'
import { useSelector } from 'react-redux'

const UserInfo = () => {
  const user = useSelector(state => state.usersSlice.currentUser)
  return (
    <div className="relative">
      <div className='p-3 border'>
      <h3 className='font-bold text-xl'>Basic Details</h3>
      <div className='my-2'>
        <h3 className='font-bold'>Name</h3>
        <p>{user?.name}</p>
      </div>
      <hr />
      <div className='my-2'>
        <h3 className='font-bold'>Email</h3>
        <p>{user?.email}</p>
      </div>
      <hr />

      <div className='my-2'>
        <h3 className='font-bold'>Phone Number</h3>
        <p>{user?.phone_number}</p>
      </div>
      <hr />

      <div className='my-2'>
        <h3 className='font-bold'>Address</h3>
        <p>{user?.address}</p>
      </div>
      <hr />
      <div className='my-2'>
        <h3 className='font-bold'>Role</h3>
        <p>{user?.roles}</p>
      </div>
      
    </div>
    
    
    </div>
  )
}

export default UserInfo
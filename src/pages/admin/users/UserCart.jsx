import React from 'react'
import { useSelector } from 'react-redux'

const UserCart = () => {
  const user = useSelector(state => state.usersSlice.currentUser)
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const baseUrl = "http://localhost:8000/storage/products/"
  return (
    user?.cart?.cartItems.length == 0 ? (<>
    <h3 className='font-bold text-center text-xl'>There is no cart</h3>
    </>) : (<>
      <div className='my-5'>
      <table className='border p-5 w-full'>
        <thead>
          <tr>
            <th className='mx-2 py-2'>#</th>
            <th className='mx-2 py-2'>Product</th>
            <th className='mx-2 py-2'>Price</th>
            <th className='mx-2 py-2'>Quantity</th>
            <th className='mx-2 py-2'>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {
            user?.cart?.cartItems?.map((cartItem, index) => (
              <tr key={cartItem.id}>
                <td className={`px-3 py-2 mx-2 border text-center ${darkMode && "border-gray-500"}`}>{index + 1}</td>
                <td className={`px-3 py-2 mx-2 border ${darkMode && "border-gray-500"}`}>
                  <div className='flex items-center'>
                    <img src={baseUrl + cartItem.product?.photos[0]?.photo_url} alt="" className='w-[50px] mx-2' />
                  <h3>{cartItem?.product.name}</h3>

                  </div>
                </td>
                <td className={`px-3 py-2 mx-2 border text-center ${darkMode && "border-gray-500"}`}>${cartItem?.product.price}</td>
                <td className={`px-3 py-2 mx-2 border text-center ${darkMode && "border-gray-500"}`}>{cartItem?.quantity}</td>
                
                <td className={`px-3 py-2 mx-2 border text-center ${darkMode && "border-gray-500"}`}>${cartItem?.product?.price * (cartItem?.quantity || 1)}</td>

              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    </>)
  )
}

export default UserCart
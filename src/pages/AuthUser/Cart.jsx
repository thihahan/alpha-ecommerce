import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BsFillTrash2Fill } from 'react-icons/bs'
import { useDecCartMutation, useDeleteCartMutation, 
  useIncCartMutation} from "../../api/cartApi"
import { useNavigate } from 'react-router-dom'
import {addOrderCart, removeOrderCart } from '../../features/ProductSlice'
import Loader from '../../components/Loader'


const Cart = () => {
  const orderCart = useSelector(state => state.products.orderCart)
  //cart
  const cart = useSelector(state => state.products.cart)
  const [deleteCart] = useDeleteCartMutation()
  const [incCart] = useIncCartMutation()
  const [decCart] = useDecCartMutation()
  const nav = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState()
  const baseUrl = "http://localhost:8000/storage/products/"
  const dispatch = useDispatch()
  const deleteCartItemHandler =async (id) => {
    setIsLoading(true)
    const {data, error} = await deleteCart(id)
    if(data){
      console.log("data from delete cart item", data);
    }
    if(error){
      console.log("error from delete cart item", error);
    }
    setIsLoading(false)
  }
  const increaseQuantity = async (cartItem) => {
    if(cartItem.quantity == cartItem.product?.stock_quantity){
      return
    }
    setIsLoading(true)
    const {data, error} = await incCart(cartItem.id)
    setIsLoading(false)
  }

  const decreaseQuantity = async (cartItemId) => {
    setIsLoading(true)
    const {data, error} = await decCart(cartItemId)
    setIsLoading(false)
    
  }


  const orderAllHandler = () => {
    dispatch(removeOrderCart())
    dispatch(addOrderCart([ ...cart, ...orderCart]))
    nav("/orders/create")
  }


  useEffect(() => {
    let price = 0
    cart && cart.map(cartItem => price += cartItem?.product.price * cartItem.quantity)
    setTotalPrice(price)
  }, [cart])

  return (
   isLoading ? <Loader /> :
   <div className='m-5'>
   <div className='my-5 flex justify-between items-center'>
     <h3 className='font-bold text-xl'>Cart</h3>
   </div>
   {
     cart?.length ? (
       <>
       <table className={`border p-3 shadow-sm w-full`}>
     <thead className={`border-b py-3`}>
       <tr>
         <th className='px-3 py-2 mx-2'>#</th>
         <th className='px-3 py-2 mx-2'>Product</th>
         <th className='px-3 py-2 mx-2'>Price</th>
         <th className='px-3 py-2 mx-2'>Quantity</th>
         <th className='px-3 py-2 mx-2'>Total Price</th>
       </tr>
     </thead>
     <tbody>
       {
         cart?.map((cartItem, index) => (
           <tr key={cartItem.id}>
             <td className={`px-3 py-2 mx-2 border`}>{index + 1}</td>
             <td className={`px-3 py-2 mx-2 border`}>
               <div className='flex items-center'>
                 <img src={baseUrl + cartItem.product?.photos[0]?.photo_url} alt="" className='w-[100px] mx-2' />
               <h3>{cartItem?.product.name}</h3>

               </div>
             </td>
             <td className={`px-3 py-2 mx-2 border text-center`}>{cartItem?.product.price} Ks</td>
             <td className={`px-3 py-2 mx-2 text-center border`}>
               <div>
               <span 
               onClick={() => decreaseQuantity(cartItem.id)}
               className={`quantity-btn rounded rounded-r-none`}>-</span>
               <span className='px-4 py-1 border text-xl'>{cartItem?.quantity}</span> 
               <span
               onClick={() => increaseQuantity(cartItem)} 
               className={`quantity-btn rounded rounded-s-none`} >+</span>
               </div>
             </td>
             <td className={`px-3 py-2 mx-2 border text-center`}>{cartItem?.product?.price * (cartItem?.quantity || 1)} Ks</td>

             <td 
             onClick={() => deleteCartItemHandler(cartItem.id)}
             className={`px-3 border text-red-500 active:scale-105 cursor-pointer select-none text-center`}>
               <div className='flex justify-center'>
               <BsFillTrash2Fill /> 
               </div>
             </td>
           </tr>
         ))
       }
       <tr className=''>
         <td></td>
         <td></td>
         <td>
         </td>
         <td className='text-end py-3'>Total Price :</td>
         <td className='text-center'> {totalPrice} Ks</td>
       </tr>
     </tbody>
   </table>
   <div className='mt-3 my-5 flex justify-end'>
     <button 
     onClick={orderAllHandler}
     className={`w-full`}>Order all</button>
   </div>
       </>
     ) : (
       <h3>There is no cart items.</h3>
     )
   }
 </div>
  )
}

export default Cart
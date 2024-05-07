import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDecCartMutation, useDeleteCartMutation, useIncCartMutation } from '../../api/cartApi'
import { useAddOrderMutation } from "../../api/productApi"
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import { v4 as uuidv4 } from 'uuid' 
import { addOrderCart, removeCart, removeOrderCart, removeOrderCartById } from '../../features/ProductSlice'
import { BsFillTrash2Fill } from "react-icons/bs"

const CreateOrder = () => {
  const originalCart = useSelector(state => state.products.cart)
  const cart = useSelector(state => state.products.orderCart)
  const baseUrl = "http://localhost:8000/storage/products/"
  const [receiverAddress, setReceiverAddress] = useState()
  const [paymentMethod, setPaymentMethod] = useState()
  const [addOrder] = useAddOrderMutation()
  const [errorMessages, setErrorMessages] = useState()
  const [customLoader, setCustomeLoader] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [deleteCart] = useDeleteCartMutation()
  const location = useLocation()
  const nav = useNavigate()
  const dispatch = useDispatch()

  const orderAllHandler = async () => {
    const orders = {"cartItem_ids":[], 
        "product_ids" : [], 
        "quantities" : [], 
        "prices" : [], 
        "receiver_address" : receiverAddress,
        "payment_method" : paymentMethod}
    cart?.forEach(ele => {
      orders.cartItem_ids.push(ele?.id)
      orders.product_ids.push(ele?.product.id)
      orders.quantities.push(ele?.quantity)
      orders.prices.push(ele?.product.price)
      
    })

    const {data, error} = await addOrder(orders)
    if(data){
      console.log("response data from add order ", data);
      dispatch(removeOrderCart())

      nav("/orders")
    }
    if(error){
      console.log("response error from add order ", error?.data?.errors);
      setErrorMessages(error?.data?.errors)
      return
    }
    cart?.forEach(ele => {
        const deleteFn = async () => {
        const {data, error} = await deleteCart(ele.id)
        if(data){
        console.log("data from delete cart item", data);
        }
        if(error){
        console.log("error from delete cart item", error);
        }
      }
      deleteFn()
    })
  }

  //
  useEffect(() => {
    let newTotalPrice = 0
    if(cart){
        cart.forEach(cartItem => {
            newTotalPrice += cartItem?.product?.price * cartItem?.quantity
        })
    }
    setTotalPrice(newTotalPrice)
  }, [cart])

  useEffect(() => {
    dispatch(removeOrderCart())
    dispatch(addOrderCart(originalCart))
  }, [originalCart])
  return (
    customLoader ? <><Loader/></> : <>
    {
        cart?.length ? (<>
            <div className='m-5'>
                <div className='p-4 border shadow-sm mb-3'>
                    <table className='w-full'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Price(each)</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                {
                    cart && cart?.map((cartItem, index) => (
                        <tr key={uuidv4()} className='border-b my-2'>
                            <td className='mx-3 text-center'>{index + 1}</td>
                            <td className='flex gap-3 mx-3'>
                                <div className='flex items-center my-3 gap-3'>
                                    <img src={baseUrl + cartItem?.product?.photos[0]?.photo_url} alt="" 
                                    className='w-[80px] rounded shadow-sm' />
                                    <h3>{cartItem?.product?.name}</h3>
                                </div>
                            </td>
                            <td className='text-center'>Ks,{cartItem?.product?.price}</td>
                            <td className='text-center'>
                                <div>
                                    <span className='px-4 py-1 text-xl'>{cartItem?.quantity}</span> 
                                </div>
                            </td>
                            <td className='text-center'>
                                <h3>Ks,{cartItem?.quantity * cartItem?.product?.price}</h3>
                            </td>
                            <td>
                                <div className='flex justify-center items-center'> 
                                    <span className='icon-delete' onClick={() => dispatch(removeOrderCartById({"id" : cartItem?.id}))}>
                                        <BsFillTrash2Fill  className='text-xl'/> 
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
                </table>
            </div>
            <div>
            <h3 className='text-end'>Total Price : Ks,
                {totalPrice}
            </h3>
            </div>
            <div className="my-3">
                <div className="mb-3">
                    <label htmlFor="" className='mb-1'>Receiver Address</label>
                    <input type="text" className="input" value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    />
                    {
                        errorMessages?.receiver_address?.map(error => <p className='text-red-500'>{error}</p>)
                    }
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='mb-1'>Payments</label>
                    <select className='input' onChange={(e) => setPaymentMethod(e.target.value)} name="" id="">
                        <option value="" disabled selected>Choose payment</option>
                        <option value="KBZ Pay">KBZ Pay</option>
                        <option value="CB Pay">CB Pay</option>
                        <option value="Wave Pay">Wave Pay</option>
                    </select>
                    {
                        errorMessages?.payment_method?.map(error => <p className='text-red-500'>{error}</p>)
                    }
                </div>
            </div>
            <div className='flex justify-between'>
                <button className="button" 
                onClick={() => {
                    dispatch(removeOrderCart())
                    location.state?.redirectTo ? nav(location.state?.redirectTo) : nav("/cart")}
                }
                >Back & Cancel</button>
                <button className="button" onClick={orderAllHandler}>Order</button>
            </div>
            </div>

        </>) : (<><h3 className='m-10 font-bold text-xl text-center'>There is no place orders</h3></>)
    }
    </>
  )
}

export default CreateOrder
import React, { useEffect, useState } from 'react'
import { useDeleteOrderItemMutation, useDeleteOrderMutation } from '../../../api/productApi'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BiEdit } from "react-icons/bi"
import { RiDeleteBin6Line } from 'react-icons/ri'
import Action from '../../../components/Action'
import AreYouSure from '../../../components/AreYouSure'
import Loader from '../../../components/Loader'

const UserOrders = () => {
  const user = useSelector(state => state.usersSlice.currentUser)
  const allOrders = useSelector(state => state.orders.orders)
  const [orders, setOrders] = useState()
  const [deleteOrder] = useDeleteOrderMutation()
  const [deleteOrderItem] = useDeleteOrderItemMutation()
  const nav = useNavigate()
  const baseUrl = "http://localhost:8000/storage/products/"
  const [showSureBtn, setShowSureBtn] = useState(false)

  //for delete order
  const [showSureBtn2, setShowSureBtn2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const deleteOrderHandler = async (id) => {
    if(user?.roles == "admin"){
      return
    }
    setIsLoading(true)
    const {date, error} = await deleteOrder(id)
    setShowSureBtn2(false)
    setIsLoading(false)
  }
  const editOrderHandler = (id) => {
    if(user?.roles == "admin"){
      return
    }
    return nav(`/dashboard/orders/edit/${id}`, {state : {"previousRoute" : `/dashboard/users/${user.id}/orders`}})
  }

  const orderProductEditHandler = (id) => {
    return nav(`/dashboard/orders/order-items/edit/${id}`)
  }

  const orderProductDelHandler = async (id) => {
    setIsLoading(true)
    const {data, error} = await deleteOrderItem(id)
    if(error){
      console.log("error from order delete", error);
    }else{
      setShowSureBtn(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if(user){
      setOrders(user?.orders)
    }
  }, [user])

  return (
    isLoading ? <><Loader /></> : <>
    <div>
      {
        orders?.length ? (<>
      {
        orders?.map((order, index) => (
        //  order.orderItems?.length != 0 && 
         <div key={order.id}>
          <div key={order.id}>
            <table className='border w-full'>
              <thead>
                <tr>
                  <th className='px-3 py-2 mx-2'>#</th>
                  <th className='px-3 py-2 mx-2'>Products</th>
                  <th className='px-3 py-2 mx-2'>Price</th>
                  <th className='px-3 py-2 mx-2'>Quantity</th>
                  <th className='px-3 py-2 mx-2'>Total Price</th>
                  <th className='px-3 py-2 mx-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
              {
                  order?.orderItems?.map((orderItem, index) => (
                    <tr key={orderItem.id}>
                      <td className={`px-3 py-2 mx-2 border`}>{index + 1}</td>
                      <td className={`px-3 py-2 mx-2 border`}>
                        <div className='flex items-center'>
                          <img src={baseUrl + orderItem.product?.photos[0]?.photo_url} alt="" className='w-[100px] mx-2' />
                        <h3>{orderItem?.product.name}</h3>

                        </div>
                      </td>
                      <td className={`px-3 py-2 mx-2 border text-center`}>${orderItem?.product.price}</td>
                        <td className={`px-3 py-2 mx-2 border text-center`}>
                          {orderItem.quantity}
                      </td>
                      <td className={`px-3 py-2 mx-2 border text-center`}>${orderItem?.product?.price * (orderItem?.quantity || 1)}</td>
                          <td 
                        className={`px-3 py-2 mx-2 border text-center`}>
                          <div className='flex justify-center gap-3'>
                            <Action icon={<BiEdit />} text={"Edit"} textColor={"text-green-500"}
                            actionHandler={() => orderProductEditHandler(orderItem.id)} />

                            <Action icon={<RiDeleteBin6Line />} text={"Delete"} textColor={"text-red-500"}
                            actionHandler={() => setShowSureBtn(true)} />
                            
                          </div>
                          <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} 
                            actionHandler={() => orderProductDelHandler(orderItem.id)} />
                        </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className='my-2 flex justify-between'>
     
              <button 
              onClick={() => editOrderHandler(order.id)}
              className='button '>
                Edit Order
              </button>
              <button 
              onClick={() => setShowSureBtn2(true) }
              className='button bg-red-500 hover:bg-red-600 rounded text-white'>
                Delete Order
              </button>
            </div>
            <AreYouSure showSureBtn={showSureBtn2} cancelHandler={() => setShowSureBtn2(false)} 
              actionHandler={() => deleteOrderHandler(order.id)} />
                      
        </div>
         </div>
        ))
      }
        </>) : (<><h3 className='m-10 font-bold text-center'>There is no orders</h3></>)
      }
    </div>
    </>
  )
}

export default UserOrders
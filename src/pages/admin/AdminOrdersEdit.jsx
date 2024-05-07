import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetOrderQuery, useUpdateOrderMutation } from '../../api/productApi'
import { BsPersonFill } from "react-icons/bs"
import UpdateEachitem from '../../components/UpdateEachitem'
import Loader from '../../components/Loader'

const AdminOrdersEdit = () => {
  const {id} = useParams()
  const location = useLocation()
  const {data, error, isLoading} = useGetOrderQuery(id)
  const [order, setOrder] = useState()
  const nav = useNavigate()
  const [orderDate, setOrderDate] = useState()
  const [status, setStatus] = useState()
  const [receiver_address, setReceiverAddress] = useState("")
  const [payment_method, setPaymentMethod] = useState("")
  const [updateOrder] = useUpdateOrderMutation()
  
  const updateOrderHandler =async () => {
    const body = {order_date : orderDate, status, receiver_address, payment_method}
    const {data, error} = await updateOrder({body, "id" : order.id})
    if(data){
        console.log("res data from update order ", data);
        return nav('/dashboard/orders')
    }
    if(error){
        console.log("error data from update order ", error);
    }
    console.log(body);
  }

  useEffect(() => {
    if(data){
        console.log("data from only one order fetching", data); 
        setOrder(data?.order)
        setOrderDate(data?.order.order_date)
        setStatus(data?.order.status)
        setReceiverAddress(data?.order?.receiver_address)
        setPaymentMethod(data?.order?.payment_method)

    }
  }, [isLoading])
  return (
    isLoading ? <Loader /> : <>
    <div className='m-5 mb-10  h-screen overflow-scroll'>
        <div className="border p-3 flex items-center justify-between mb-3">
            <div className='flex gap-3 items-center'>
                {
            order?.user?.profile_photo_url ? (<>
                <img className='w-[50px] rounded-full' src={order?.user?.profile_photo_url} alt="" />
            </>) : (<>
                <div className='p-2 rounded-full border'>
                    <BsPersonFill className='text-[45px] rounded-full'/>
                </div>
            </>)
            }
            <div>
                <h3 className='mb-1'>{order?.user.name}</h3>
                <h3 className='mb-1'>{order?.user.email}</h3>
            </div>
            </div>
            <div>
                <Link to={`/dashboard/users/${order?.user.id}`}>
                    <button className='hover:underline'>
                        Customer Detail    
                    </button>
                </Link>
                
            </div>
        </div>
       <div>
       <div className="mb-3">
            <label htmlFor="orderDate" className='mb-2'>Order Date</label>
            <input type="date" name="" 
            onChange={(e) => setOrderDate(e.target.value)}
            value={orderDate} id="orderDate" className='input'/>
        </div>
        <div className="mb-3">
            <label htmlFor="status" className='mb-2'>Status</label>
            <select name="" id="status" onChange={(e) => setStatus(e.target.value)} className='input'>
                <option selected={status == "pending"} value="pending">pending</option>
                <option selected={status == "shipped"} value="shipped">shipped</option>
                <option selected={status == "delivered"} value="delivered">delivered</option>
            </select>
        </div>
        <div className="mb-3">
            <label htmlFor="orderDate" className='mb-2'>Receiver Address</label>
            <input type="text" name="" 
            onChange={(e) => setReceiverAddress(e.target.value)}
            value={receiver_address} id="orderDate" className='input'/>
        </div>
        <div className="mb-3">
            <label htmlFor="status" className='mb-2'>Status</label>
            <select name="" id="status" onChange={(e) => setPaymentMethod(e.target.value)} className='input'>
                <option selected={payment_method == "KBZ Pay"} value="KBZ Pay">KBZ Pay</option>
                <option selected={payment_method == "CB Pay"} value="CB Pay">CB Pay</option>
                <option selected={payment_method == "Wave Pay"} value="Wave Pay">Wave Pay</option>
            </select>
        </div>
            <div className="w-full flex  justify-between">
                <button className="button"
                onClick={() => location?.state?.previousRoute ? nav(location?.state?.previousRoute) : nav("..") }
                >Cancel</button>
                <button 
                onClick={updateOrderHandler}
                className="button update">Update</button>
            </div>
       </div>
    </div>
    </>
  )
}

export default AdminOrdersEdit
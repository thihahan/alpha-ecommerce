import React, { useEffect, useState } from 'react'
import { useDeleteOrderMutation, useGetOrdersQuery } from '../../api/productApi'
import Loader from '../../components/Loader'
import AreYouSure from '../../components/AreYouSure'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  const token = Cookies.get("token")
  const {data, error, isLoading} = useGetOrdersQuery(token)
  const [orders, setOrders] = useState()
  const [deleteOrder] = useDeleteOrderMutation()
  const baseUrl = "http://localhost:8000/storage/products/"
  const [showSureBtn, setShowSureBtn] = useState(false)
  const [customLoader, setCustomLoader] = useState(false)
  const [orderDeletedId, setOrderDeletedId] = useState()
  const nav = useNavigate()

  const deleteOrderHandler = async (id) => {
    setCustomLoader(true)
    const {data, error} = await deleteOrder(id)
    if(data){
      console.log("res data from delete order ", data);
    }
    setShowSureBtn(false)
    setCustomLoader(false)
  }

  const statusColorHandler = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-400"
        break;
      case "shipped":
        return "bg-blue-400"
        break;
      case "delivered":
        return "bg-green-400"
        return
      default:
        return "gray";
        break;
    }
  }
  useEffect(() => {
    setCustomLoader(true)
    if(data){
      console.log("orders",orders);
      setOrders(data?.orders)
    }
    if(error){
      console.log("order error: ", error);
    }
    setCustomLoader(false)
  },[isLoading, data])
  return (
    <>
      {
        customLoader || isLoading ? (<Loader />) : (
          <div className='m-5'>
            {
              <>
                {
                  orders?.length ? (
                    orders?.map(order => (
                      <div key={order.id} className='mb-5'>
                              <div className=''>
                                <div className={`border border-b-0 flex justify-between items-center px-4 py-2`}> 
                                <h3 className='mb-1'> Status :
                                  <span className={`ms-2 px-2 py-1 rounded-full ${statusColorHandler(order.status)} font-bold text-white`}>
                                    {
                                      order.status
                                    }
                                  </span>
                                </h3>
                                <div>
                                <h3 className='font-bold'>Order Data : {order.order_date}</h3>
                                </div>
                                </div>
                                <table className={`border p-3 shadow-sm w-full table-auto`}>
                                  <thead className={`border-b py-3`}>
                                    <tr>
                                      <th className='px-3 py-2 mx-2'>#</th>
                                      <th className='px-3 py-2 mx-2'>Product</th>
                                      <th className='px-3 py-2 mx-2'>Price</th>
                                      <th className='px-3 py-2 mx-2'>Quantity</th>
                                      <th className='px-3 py-2 mx-2'>Total Price</th>
                                      <th className='px-3 py-2 mx-2'>Address</th>
                                      <th className='px-3 py-2 mx-2'>Payment Method</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      order?.orderItems?.map((orderItem, index) => (
                                        <tr key={orderItem.id}>
                                          <td className={`px-3 py-2 mx-2 border text-center`}>{index + 1}</td>
                                          <td className={`px-3 py-2 mx-2 border`}>
                                            <div className='flex items-center'>
                                              <img 

                                              src={baseUrl + orderItem.product?.photos[0]?.photo_url} 
                                              alt="" className='w-[50px] mx-2' />
                                            <h3 className='hover:underline cursor-pointer select-none' 
                                            onClick={() => nav(`/products/${orderItem?.product?.id}`)}>{orderItem?.product.name}</h3>
                                            </div>
                                          </td>
                                          <td className={`px-3 py-2 mx-2 border text-center`}>{orderItem?.product.price} Ks</td>
                                          <td className={`px-3 py-2 mx-2 border text-center`}>
                                            {orderItem.quantity}
                                          </td>
                                          
                                          <td className={`px-3 py-2 mx-2 border text-center`}>{orderItem?.product?.price * (orderItem?.quantity || 1)} Ks</td>
                                          <td className={`px-3 py-2 mx-2 border text-center`}>{order?.receiver_address}</td>
                                          <td className={`px-3 py-2 mx-2 border text-center`}>{order?.payment_method}</td>
                                        </tr>
                                        
                                        ))
                                      }
                                      <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='px-3 py-2 text-end'>Total Price : </td>
            <td className='px-3 py-2 text-'>
              {
              order?.orderItems?.length > 1 ? <>
              {
                order?.orderItems?.reduce((pre, current) => {
                  if(pre.product == null || current?.product == null){
                    pre = 0
                    // current 
                  }
                  return (pre?.product?.price * pre.quantity) + (current?.product?.price * current?.quantity)
                })
              } 
              Ks
              </> : <>
              {
              (order?.orderItems[0]?.product?.price * order?.orderItems[0].quantity) 

              }
              Ks
              </>
               
            }
            </td>
          </tr>
                                  </tbody>
                              </table>
                              {
                                order.status == "pending" && (
                                  <>
                                    <div className='flex justify-end my-3'>
                                      <button 
                                      onClick={() => {
                                        setShowSureBtn(true)
                                        setOrderDeletedId(order?.id)
                                      }}
                                      className='button delete'>Cancel Order</button>
                  
                                    </div>
                                    <div>
                                      <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)}
                                      actionHandler={() => deleteOrderHandler(orderDeletedId)}  actionMessage={"Cancel Order"}/>
                                    </div>
                                  </>
                              
                                )
                              }
                              </div>
                      </div>
                            
                    ))
                  ) : (
                    <h3 className="m-10 font-bold text-xl text-center">There is no orders</h3>
                  )
                }
              </>
            }
      </div>

        )

      }
    </>
  )
}

export default Orders
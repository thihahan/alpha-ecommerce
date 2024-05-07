import React, { useEffect, useState } from 'react'
import { useDeleteOrderItemMutation, useDeleteOrderMutation, useGetAdminOrdersQuery } from '../../api/productApi'
import { BsPersonFill } from "react-icons/bs"
import { useSelector } from 'react-redux'
import { BiEdit,BiTrash } from "react-icons/bi"
import { useNavigate, useSearchParams } from 'react-router-dom'
import Action from '../../components/Action'
import AreYouSure from '../../components/AreYouSure'
import Loader from '../../components/Loader'
import StatusFilter from '../../components/StatusFilter'
import ProductsPagesSwicher from '../../components/ProductsPagesSwicher'
import { createParmsObj } from '../../utils/createSearchParmsObj'

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [params, setParams] = useState()
  const {data, error, isLoading} = useGetAdminOrdersQuery(params)
  const [orders, setOrders] = useState()
  const [links, setLinks] = useState()
  const [lastPage, setLastPage] = useState()
  const nav = useNavigate()
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const baseUrl = "http://localhost:8000/storage/products/"
  const [deleteOrderItem] = useDeleteOrderItemMutation()
  const [showSureBtn, setShowSureBtn] = useState(false)
  // for delete overall order
  const [showSureBtn2, setShowSureBtn2] = useState()
  const [orderDeletedId, setOrderDeletedId] = useState()
  const [orderItemDeletedId, setOrderItemDeletedId] = useState()
  // delete order
  const [customLoader, setCustomLoader] = useState(false)
  const [deleteOrder] = useDeleteOrderMutation()

  // for search box
  const [searchBy, setSearchBy] = useState("username")
  const [searchKeyword, setSearchKeyword] = useState()

  // for payment
  const [payment, setPayment] = useState()

  const [orderStatus, setOrderStatus] = useState()
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
  const orderProductEditHandler = (id) => {
    return nav(`order-items/edit/${id}`)
  }

  const orderProductDelHandler = async (id) => {
    
    setCustomLoader(true)
    const {data, error} = await deleteOrderItem(id)
    if(data){
      console.log("data from order delete", data);
    }
    if(error){
      console.log("error from order delete", error);
    }
    setShowSureBtn(false)
    setCustomLoader(false)
  }

  const deleteOrderHandler = async (id) => {
    setCustomLoader(true)
    const {date, error} = await deleteOrder(id)

    setShowSureBtn2(false)
    setCustomLoader(false)

  }

  const editOrderHandler = (id) => {
    return nav(`edit/${id}`)
  }

  const searchBoxHandler = (e) => {
    if(e.code == "Enter"){
      const searchParamsObj = createParmsObj(searchParams)
      switch (searchBy) {
        case "username":
          setSearchParams({...searchParamsObj, "username" : searchKeyword})
          break;
        case "product":
          setSearchParams({...searchParamsObj, "product" : searchKeyword})
        default:
          break;
      }
      console.log(`search by ${searchBy}, value ${searchKeyword}`);
    }
  }

  useEffect(() => {
    if(data){
      console.log("admin orders",  data);
      setOrders(data?.data)
      setLinks(data?.meta?.links)
      setLastPage(data?.meta?.last_page)
    }
  }, [data, isLoading])

  useEffect(() => {
    const searchParamsString = searchParams.toString()
    setParams(searchParamsString)
    const status = searchParams.get("status")
    setOrderStatus(status)
  }, [searchParams])

  useEffect(() => {
    const paymentMethod = searchParams.get("payment")
    setPayment(paymentMethod)
  }, [searchParams])

  useEffect(() => {
    const originalPayment = searchParams.get("payment")
    setPayment(originalPayment)
  }, [])

  return (
    <>
       <div className="flex justify-between items-end">
          <h3 className='text-xl'>User Orders</h3>
          <div className='flex items-center'>
            <div className='flex'>
              <StatusFilter />
              <div className='mx-2 flex gap-2'>
                <label htmlFor="" className='flex gap-2 items-center'>payment <span>:</span></label>
                <select name="" className='input'
                onChange={(e) => {
                  const searchParamsObj = createParmsObj(searchParams)
                  setSearchParams({...searchParamsObj, payment : e.target.value})
                }}
                id="">
                  <option disabled>choose payment</option>
                  <option value="" selected={payment == ""}>All</option>
                  <option selected={payment === "KBZ Pay"} value="KBZ Pay">KBZ Pay</option>
                  <option selected={payment === "CB Pay"} value="CB Pay">CB Pay</option>
                  <option selected={payment === "Wave Pay"} value="Wave Pay">Wave Pay</option>
                </select>
              </div>
            </div>
            {
              (payment || orderStatus) &&
              <div className='mx-2'>
              <p 
              onClick={() => {
                const searchParamsObj = createParmsObj(searchParams)
                setSearchParams({...searchParamsObj, payment : "", status : ""})
              }}
              className='text-red-500 font-bold underline cursor-pointer select-none'>remove filter</p>
            </div>
            }
          </div>
          </div>
      {
        customLoader && isLoading ? (<>
          <Loader /> 
         
      </>) : (<>
      {
        orders?.length ? (
      <>
      {
        orders?.map(order => (
          order?.orderItems?.length > 0 && <>
          <div className='my-2 overflow-scroll' key={order.id}>
        <div className='p-3 w-full flex border border-b-0 rounded justify-between items-center'>
        <div className='flex gap-3 items-center'>
        {
          order?.user?.profile_photo_url ? (<>
          <img className='w-[50px] rounded-full' src={order?.user?.profile_photo_url} alt="" />
          </>) : (<>
              <BsPersonFill className='text-[45px] rounded-full'/>
          </>)
        }
          <div>
            <h3 className='mb-1'>{order?.user?.name}</h3>
            <h3 className='mb-1'>{order?.user?.email}</h3>
          </div>
        </div>
        <div>
          <h3 className='font-bold mb-1'>Order Data : {order.order_date}
          </h3>
          <h3 className='mb-1'> Status :
            <span className={`ms-2 px-2 py-1 rounded-full ${statusColorHandler(order.status)} font-bold text-white`}>
              {
                order.status
              }
            </span>
            </h3>
        </div>
      </div>
      <table className='border w-full'>
        <thead>
          <tr>
            <th className='px-3 py-2 mx-2'>#</th>
            <th className='px-3 py-2 mx-2'>Products</th>
            <th className='px-3 py-2 mx-2'>Price</th>
            <th className='px-3 py-2 mx-2'>Quantity</th>
            <th className='px-3 py-2 mx-2'>Total Price</th>
            <th className='px-3 py-2 mx-2'>Receiver Address</th>
            <th className='px-3 py-2 mx-2'>Payment Method</th>
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
                    <img src={baseUrl + orderItem.product?.photos[0]?.photo_url} alt="" className='w-[50px] mx-2' />
                  <h3>{orderItem?.product.name}</h3>

                  </div>
                </td>
                <td className={`px-3 py-2 mx-2 border text-center`}>{orderItem?.product.price} Ks</td>
                  <td className={`px-3 py-2 mx-2 border text-center`}>
                    {orderItem.quantity}
                </td>
                <td className={`px-3 py-2 mx-2 border text-center`}>{orderItem?.product?.price * (orderItem?.quantity || 1)} Ks</td>
                {
                  index == 0 && (
                <>
                <td rowSpan={order?.orderItems?.length} 
                className={`px-3 py-2 mx-2 border text-center`}>{order?.receiver_address}</td>
                <td rowSpan={order?.orderItems?.length} className={`px-3 py-2 mx-2 border text-center`}>{order?.payment_method}</td>

                </>
                  )
                }
                <td 
                className={`px-3 py-2 mx-2 border text-center`}>
                  <div className='flex justify-center gap-3'>
                  <Action icon={<BiEdit />} actionHandler={() => orderProductEditHandler(orderItem?.id)}
                    text={"Edit"} textColor={"text-green-500"} 
                    />
                    <Action icon={<BiTrash className='text-2xl'/>}
                      actionHandler={() => {
                        setShowSureBtn(true)
                        setOrderItemDeletedId(orderItem?.id)
                      }} text={"Remove"} textColor={"text-red-500"}/>
                  </div>
                  <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} actionHandler={() => orderProductDelHandler(orderItemDeletedId)}/>

                </td>
                
              </tr>
            ))
          }
          <tr>
            <td></td>
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
      <div className='my-2 flex justify-between'>
          <button className='button' onClick={() => editOrderHandler(order?.id)}>
            Edit
          </button>
      
        <button 
        onClick={() => {
          setOrderDeletedId(order?.id)
          setShowSureBtn2(true)
        }}
        className='button bg-red-500 hover:bg-red-600 rounded text-white'>
          Delete Order
        </button>
      </div>
      <AreYouSure showSureBtn={showSureBtn2} 
      cancelHandler={() => setShowSureBtn2(false)} 
      actionHandler={() => deleteOrderHandler(orderDeletedId)}/>

    </div>
    
          </>
        ))
      }
      <div>
      <ProductsPagesSwicher links={links} lastPage={lastPage} />
    </div>
    </>
        ) : (<>
          <h3 className='font-bold text-3xl text-center m-10'>There is no orders</h3>
        </>)
      }
        </>)
      }
      
    </>
  )
}

export default AdminOrders
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetOrderItemQuery, useUpdateOrderItemMutation } from '../../api/productApi'
import CarouselTest from "../CarouselTest"
import Loader from '../../components/Loader'

const OrderProductEdit = () => {
  const { id } = useParams()
  const [product, setProduct] = useState()
  const [orderItem, setOrderItem] = useState()
  const [price, setPrice] = useState()
  const [updateOrderItem] = useUpdateOrderItemMutation()
  const [quantity, setQuantity] = useState()
  const { data, error, isLoading} = useGetOrderItemQuery(id)
  const [customLoader, setCustomLoader] = useState(false)
  const nav = useNavigate()
  const submitHandler = async (e) => {
    setCustomLoader(true)
    e.preventDefault()
    const id = orderItem.id
    const body = {id, "price_at_order" : price, "quantity" : quantity}
    const {data, error} = await updateOrderItem({body, id})
    if(data){
      console.log("data from order update", data);
      return nav('/dashboard/orders')
    }
    if(error){
      console.log("error from order update", error);
    }
    setCustomLoader(false)

    // console.log(body);
  }
  useEffect(() => {
    setCustomLoader(true)
    if(data){
        console.log("order items data : ", data.orderItem);
        setOrderItem(data?.orderItem)
        setProduct(data?.orderItem?.product)
        setPrice(data?.orderItem?.price_at_order)
        setQuantity(data?.orderItem?.quantity)
        console.log(product);
    }
    setCustomLoader(false)
  }, [isLoading])
  return (
    isLoading || customLoader ? <Loader /> : <>
    <div className='m-5 flex'>
      <div className='w-[400px] mr-3'>
      <CarouselTest photos={product?.photos}/>

      </div>
      <div className='w-full'>
      <h3 className='text-xl mb-3'>Edit Order Item</h3>
      <form action="" className='p-3 border shadow-sm' onSubmit={(e) => submitHandler(e)}>
        <div className="mb-3">
          <label htmlFor="productName" className='mb-1'>Name</label>
          <input type="text" value={product?.name} className='input' />
        </div>
        <div className="mb-3">
          <label htmlFor="productPrice">Price</label>
          <input type="number" value={price} 
          onChange={(e) => setPrice(e.target.value)}
          className='input' />

        </div>
        <div className="mb-3">
          <label htmlFor="productQuantity">Quantity</label>
          <input type="number" value={quantity} 
          onChange={(e) => setQuantity(e.target.value)}
          className='input' />
        </div>
        <div className='flex justify-between'>
          <button className='button' onClick={(e) => {
            e.preventDefault()
            return nav('/dashboard/orders')
          }}>Cancel</button>
          <button type='submit' className='button'>Update</button>
        </div>
      </form>
      </div>
    </div>
    </>
  )
}

export default OrderProductEdit
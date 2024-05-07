import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetOrderItemQuery, useUpdateOrderItemMutation } from '../api/productApi'
import CarouselTest from "../pages/CarouselTest"

const UpdateEachitem = ({orderItem}) => {
    const [product, setProduct] = useState()
    const [price, setPrice] = useState()
    const [updateOrderItem] = useUpdateOrderItemMutation()
    const [quantity, setQuantity] = useState()
    const nav = useNavigate()
    const baseUrl = "http://localhost:8000/storage/products/"
    const submitHandler = async (e) => {
      e.preventDefault()
      const id = orderItem.id
      const body = {id, "price_at_order" : price, "quantity" : quantity}
      const {data, error} = await updateOrderItem({body, id})
      if(data){
        console.log("data from order update", data);
      }
      if(error){
        console.log("error from order update", error);
      }
      // console.log(body);
    }
    useEffect(() => {
        setProduct(orderItem?.product)
        setPrice(orderItem?.price_at_order)
        setQuantity(orderItem?.quantity)
    }, [orderItem])
    return (
      <div className='flex gap-4'>
        <div className='border rounded shadow-sm flex justify-center items-center'>
          <img className='w-[300px]' src={baseUrl + orderItem?.product.photos[0].photo_url} alt="" />
        </div>
        <div className='w-full'>
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
          <div className='flex justify-end'>
            <button type='submit' className='button update'>Update</button>
          </div>
        </form>
        </div>
      </div>
    )
}

export default UpdateEachitem
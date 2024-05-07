import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Product = ({product}) => {
  const baseUrl = "http://localhost:8000/storage/products/"
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const [searchParams, setSearchParams] = useSearchParams()
  const nav = useNavigate()
  const productDetailHandler = () => {
    return nav(`/products/${product?.id}`, {state : {"params" : searchParams.toString()}})
  }
  
  return (
    <div 
    onClick={productDetailHandler}
    className={`sm:w-[200px] p-5 cursor-pointer hover:shadow-lg border shadow-sm transition duration-200 rounded relative ${darkMode && "border-gray-500"}`}>
        {
        product.photos && (
          <div className='relative'
          >
            <div className='mb-3 flex justify-center rounded'>
              <img className='w-[150px] h-[150px]' src={baseUrl + product.photos[0]?.photo_url} alt="" /></div>
          </div>
        )
        
        
        }
        <h3> {product?.name.substring(0, 15)}...</h3>
        <h3>{product?.price} Ks</h3>
        <h3>Stock - {product?.stock_quantity}</h3>
        <div className="my-2">
          <button className="button">Detail</button>
        </div>
    </div>
  )
}

export default Product
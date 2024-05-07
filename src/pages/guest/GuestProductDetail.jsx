import React, { useEffect, useState } from 'react'
import { Link, redirect, useLocation, useNavigate, useParams} from 'react-router-dom'
import { useGetProductQuery } from '../../api/productApi'
import CarouselTest from '../CarouselTest'
import { useDispatch, useSelector } from 'react-redux'
import HandleCart from '../../components/HandleCart'
import { IoIosArrowForward } from "react-icons/io"
import Loader from '../../components/Loader'

const GuestProductDetail = () => {
  const {id} = useParams()
  const {data, error, isLoading} = useGetProductQuery(id)
  const [product, setProduct] = useState()
  const location = useLocation()
  console.log("location : ", location);
  const nav = useNavigate()

  const backHandler = () => {
    const redirectTo = location.state?.redirectTo
    const params = location.state?.params
    let url = redirectTo ? `${redirectTo}` : "/"
    url = params ? url+`?${params}` : url 
    // redirectTo ? nav(`${redirectTo}?${params}`) : nav(`/?${params}`)
    nav(url)
    return
  }
  useEffect(() => {
    if(data){
        setProduct(data?.product)
    }
    if(error){
        console.log("error is :", error);
    }
  }, [isLoading])
  return (
    isLoading ? <Loader /> :
    product ? (<>
    <div className='mx-5'>
      <div className='my-5 flex justify-between items-center'>
        {/* <h3 className='font-bold text-xl'>Product Detail</h3> */}
        <button className="button" onClick={backHandler}>Back</button>
        <div className='flex items-center gap-1'>
         
            <Link to={"/"} 
            className='font-bold cursor-pointer select-none'>
              <span>Products</span></Link>
            <span><IoIosArrowForward /></span>
          <span>{product?.name}</span>
        </div>
      </div>
      <div className='flex gap-4'>
        <div className="mb-3">
        <CarouselTest photos={product?.photos}/>

        </div>
        <div className='mx-1 sm:mx-2 md:mx-3'>
          <h1 className='text-2xl mb-3'>{product?.name}</h1>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='text-2xl font-bold'>Categories</h3>
                {
                  product?.categories.map(category => <span className='mx-3 py-2 px-3 bg-green-500 text-white rounded-full'>{category.name}</span>)
                }
            </div>
          <div className='mb-3'>
            <h3 className='font-bold mb-1 text-2xl'>Description</h3>
            <p>{product?.description}</p>
          </div>
          
          <h3 className='mb-3'><span className='text-2xl font-bold'>Price</span> : {product?.price} Ks</h3>
          <h3 className='mb-3'><span className='text-2xl font-bold'>
            Stock</span> : {product?.stock_quantity ? product?.stock_quantity : 
            <span className='text-red-500'>Out of stock</span>}</h3>
            {
              product?.stock_quantity != 0 && <HandleCart product={product}/>
            }
        </div>
      </div>
    </div>
    </>) : (<><h3 className='text-xl font-bold m-10 text-center'>Product not found</h3></>)
  )
}

export default GuestProductDetail
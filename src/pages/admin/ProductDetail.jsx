import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useRouteLoaderData } from 'react-router-dom'
import { useDeleteProductMutation, useGetProductQuery } from '../../api/productApi'
import CarouselTest from '../CarouselTest'
import AreYouSure from '../../components/AreYouSure'
import Loader from '../../components/Loader'
import {  IoIosArrowForward } from "react-icons/io"


const ProductDetail = () => {
  const {id} = useParams()
  const {data, error, isLoading} = useGetProductQuery(id)
  const [product, setProduct] = useState()
  const [customLoading, setCustomLoading] = useState(false)
  const location = useLocation()
  const [showSureBtn, setShowSureBtn] = useState(false)
  const nav = useNavigate()
  const [deleteProduct] = useDeleteProductMutation()
  const deleteProductHandler = async (productId) => {
    setCustomLoading(true)
    const {data, error} = await deleteProduct(productId)
    if(error){
      console.log(error);
    }else{
      nav("/dashboard")
    }
    setShowSureBtn(false)
    setCustomLoading(false)
  }

  useEffect(() => {
    if(data){
        setProduct(data?.product)
    }
    if(error){
        console.log("error is :", error);
    }
  }, [isLoading, data])
  return (
    <>
      {
        customLoading ? (<Loader />) : (
          <div className='mb-10'>
            <div className='my-5 flex justify-between items-center'>
                <h3 className='font-bold text-xl'>Products</h3>
                <div className='flex items-center gap-1'>
                
                    <Link to={"/dashboard"} 
                    className='font-bold cursor-pointer select-none'>
                      <span>Dashboard</span></Link>
                    <span><IoIosArrowForward /></span>

                      <Link to={"/dashboard"} 
                      
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
        <hr className='my-3' />
        <div className='mx-1 sm:mx-2 md:mx-3'>
          <div className="flex mb-3 gap-3">
            <h1 className='text-2xl bold '>{product?.name}</h1>

          </div>
          <div className="mb-3 flex gap-3">
            <div className=''>
              <h3 className='font-bold text-2xl'>Categories</h3>

            </div>
            <div className='flex flex-wrap gap-2'>
                {
                  product?.categories.map(category => <span className='mx-3 py-2 px-3 bg-green-500 text-white rounded-full'>{category.name}</span>)
                }
            </div>
          </div>
          <div className='mb-3'>
            <h3 className='font-bold text-2xl mb-2'>Description</h3>
            <p>{product?.description}</p>
          </div>
          
          <h3 className='mb-3'><span className='text-2xl font-bold'>Price</span> : {product?.price} Ks</h3>
          <h3 className='mb-3'><span className='text-2xl font-bold'>Stock</span> : {product?.stock_quantity ? `${product?.stock_quantity}` : <span className='text-red-500'>out of stock</span>}</h3>
          <div className="flex w-full justify-between items-center">
            <button className='button' onClick={() => nav(`/dashboard/products/edit/${id}`, {state : {"redirectTo" : `/dashboard/products/${id}`}})}>Edit</button>
            <button className='button delete' onClick={() => setShowSureBtn(true)}>Delete</button>
            
          </div>
          <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} actionHandler={() => deleteProductHandler(id)}/>

        </div>
      </div>
    </div>
        )
      }
    </>
  )
}

export default ProductDetail
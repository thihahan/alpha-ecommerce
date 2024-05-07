import React, { useEffect, useState } from 'react'
import Product from '../../components/Product'
import {useGetProductsQuery } from '../../api/productApi'
import { useSearchParams } from 'react-router-dom'
import ProductsPagesSwicher from '../../components/ProductsPagesSwicher'

const GuestProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [params, setParms] = useState()
  const {data, error, isLoading} = useGetProductsQuery(params)
  const [links, setLinks] = useState()
  const [lastPage, setLastPage] = useState()
  const [products, setProducts] = useState()

  useEffect(() => {
    if(data){
      console.log("guest products :", data);
      setProducts(data?.data)
      setLinks(data?.meta?.links)
      setLastPage(data?.meta?.last_page)
    }
    if(error){

    }
  }, [data, isLoading])

  useEffect(() => {
    const searchParamsString = searchParams.toString()
    setParms(searchParamsString)
  }, [searchParams])

  return (
    <div className='flex gap-3 w-full'>
    <div className='w-full mx-auto'>
     <div className='grid sm:grid-cols-3 lg:grid-cols-5 justify-around gap-3'>
        {
          products && products?.map((product,i) => <Product key={i} product={product}/>) 
        }
     </div>
        {
          products?.length < 1 && <h3 className='m-10 text-lg text-center'>There is no products</h3>
        }
     <div>
      {
        lastPage > 1 &&
      <ProductsPagesSwicher links={links} lastPage={lastPage} />

      }
     </div>
    </div>
    </div>
  )
}

export default GuestProducts
import React, { useState } from 'react'
import uuid4 from 'uuid4';
import { useSearchParams } from 'react-router-dom';
import { createParmsObj } from '../utils/createSearchParmsObj';

const ProductsPagesSwicher = ({links, lastPage}) => {
  const [searchParams, setSearchParmas] = useSearchParams()
  const nextHandler = () => {
    const page = searchParams.get("page")
    let pageNumber = Number(page)
    const searchParamsObj = createParmsObj(searchParams)

    pageNumber = pageNumber ? pageNumber : 1
    if(lastPage == pageNumber){
      return
    }
    setSearchParmas({...searchParamsObj, "page" : page ? pageNumber+1 : 2})
  }

  const preHandler = () => {
    const page = searchParams.get("page")
    const searchParamsObj = createParmsObj(searchParams)

    let pageNumber = Number(page)
    pageNumber = pageNumber ? pageNumber : 1

    if(pageNumber == 1){
      return
    }
    setSearchParmas({...searchParamsObj, "page" : page ? pageNumber - 1 : 2})
  }

  const pageNumberHandler = (pgNum) => {
    const searchParamsObj = createParmsObj(searchParams)
    if(Number(pgNum)){
      setSearchParmas({...searchParamsObj, "page" : pgNum})
    }
  }

  return (
    <div className='flex justify-end my-4'>
        <div className='flex'>
        <button className='button' onClick={() => preHandler()}>Previous</button>

          {
            links && links?.map((link, index) =>
            <div key={uuid4()} className='flex'>
                {(index > 0 && index < links.length -1) && 
                <button 
                onClick={() => pageNumberHandler(link?.label)}
                className={`${link?.active && "bg-gray-300"} button`}>
                <span >{link?.label}</span>
              </button>  
                }
               
            </div> 
              
            )

          }
              <button className='button' onClick={() => nextHandler()}>Next</button>
        </div>
    </div>
  )
}

export default ProductsPagesSwicher
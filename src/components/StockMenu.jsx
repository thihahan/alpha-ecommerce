import React, { useEffect, useRef, useState } from 'react'
import { RiArrowDropDownLine } from "react-icons/ri"
import { useSearchParams } from 'react-router-dom'
import { createParmsObj } from '../utils/createSearchParmsObj'


const StockMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showStockMenu, setShowStockMenu] = useState(false)
  const avaRef = useRef()
  const outStockRef = useRef()
  window.addEventListener("click", () => {
    setShowStockMenu(false)
  })

  const filterByStock = (e, ava=false, outStock=true) => {
    const checked = e.target.checked 
    console.log(checked);
    let searchParamsObj = createParmsObj(searchParams)
    if(ava){
        outStockRef.current.checked = false
        if(checked){
          setSearchParams({...searchParamsObj ,"stock" : "available"})

        }else{
          setSearchParams({...searchParamsObj ,"stock" : ""})
        }
        
    }
    if(outStock){
        avaRef.current.checked = false
        if(checked){
          setSearchParams({...searchParamsObj,"stock" : "outofstock"})
        }else{
            setSearchParams({...searchParamsObj, "stock" : ""})
        }
    }
    
  }
  useEffect(() => {
    const stock = searchParams.get("stock")
    if(stock){
      let searchParamsObj = createParmsObj(searchParams)

      if(stock == "available"){
        avaRef.current.checked = true
        setSearchParams({...searchParamsObj ,"stock" : "available"})
      }
      if(stock == "outofstock"){
        outStockRef.current.checked = true
        setSearchParams({...searchParamsObj,"stock" : "outofstock"})
      }
    }
  }, [searchParams])
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button className="button flex gap-2 items-center" onClick={() => setShowStockMenu(!showStockMenu)}>
          <span>Stock</span>
          <span><RiArrowDropDownLine className='text-xl'/></span>
        </button> 
        <div className={`absolute -left-8 top-10 bg-white border ${!showStockMenu && "hidden"}`}>
          <span className='flex px-1 py-2 items-center gap-2'> 
            <input onChange={(e) => filterByStock(e, true, false)} ref={avaRef} type="checkbox" name="" id="available" />
            <label htmlFor="available" className='select-none'>available</label>
          </span>
          <hr />
          <span className='flex px-1 py-2 items-center gap-2'> 
            <input onChange={(e) => filterByStock(e, false, true)} ref={outStockRef} type="checkbox" name="" id="outofstock" />

            <label htmlFor="outofstock" className='select-none'>out of stock</label>
          </span>
        </div>
    </div>
  )
}

export default StockMenu
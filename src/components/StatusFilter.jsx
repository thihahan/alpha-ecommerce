import React, { useEffect, useRef, useState } from 'react'
import { RiArrowDropDownLine } from "react-icons/ri"
import { useSearchParams } from 'react-router-dom'
import { createParmsObj } from '../utils/createSearchParmsObj'

const StatusFilter = () => {
  const [orderStatus, setOrderStatus] = useState()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    const status = searchParams.get("status")
    if(status == "pending" || status == "shipped" || status == "delivered"){
      setOrderStatus(status)
    }
  }, [])

  useEffect(() => {
    const status = searchParams.get("status")
    setOrderStatus(status)
  }, [searchParams])

  return (
    <div className='mx-2 flex gap-2 items-center'>
      <label htmlFor="status" className='flex gap-2'>Status <span>:</span></label>
      <select name="" id="status" onChange={(e) => {
        const searchParamsObj = createParmsObj(searchParams)
        setSearchParams({...searchParamsObj, status : e.target.value})
      }} className='input'>
        <option value="" disabled selected>choose status</option>
        <option value="all" selected={!orderStatus}>All</option>
        <option selected={orderStatus == "pending"} value="pending">pending</option>
        <option selected={orderStatus == "shipped"} value="shipped">shipped</option>
        <option selected={orderStatus == "delivered"} value="delivered">delivered</option>
      </select>
    </div>
  )
}

export default StatusFilter
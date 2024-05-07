import React, { useEffect, useRef, useState } from 'react'
import { BiSearch } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { createParmsObj } from '../utils/createSearchParmsObj'
import { RxCross1 } from "react-icons/rx"

const SearchBox = ({defaultValue}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(defaultValue)
  const searchFormRef = useRef()
  const searchBoxHandler = () => {
    setSearchValue(searchValue.toLowerCase())
    let searchParamsObj = createParmsObj(searchParams)
    setSearchParams({...searchParamsObj, "keyword" : searchValue})
  }


  const searchBoxSubmitHandler = (e) => {
    e.preventDefault()
    searchBoxHandler()
  }
  
  const clearSearchHandler = async () => {
    setSearchValue("")
    let searchParamsObj = createParmsObj(searchParams)
    setSearchParams({...searchParamsObj, "keyword" : ""})
  }

  useEffect(() => {
    const keyword = searchParams.get("keyword")
    setSearchValue(keyword)
  }, [])

  return (
    <div className='relative'>
        <form action="" id='searchForm' ref={searchFormRef} onSubmit={(e) => searchBoxSubmitHandler(e)}
        className='flex border rounded-full w-full items-center'>
          <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text" placeholder='Search ...' 
          className="w-full py-2 px-3 outline-none rounded-s-full" />
          <span className = {`px-3 active:scale-95 ${searchValue ? "" : "hidden"}`} onClick={() => clearSearchHandler()} >
            <RxCross1 />
          </span>
          <button className='px-3 py-2 border-s rounded-r-full bg-gray-100 hover:bg-gray-200'>
            <span 
            className=''>
              <BiSearch className='text-2xl'/>
            </span>
          </button>
        </form>
    </div>
  )
}

export default SearchBox
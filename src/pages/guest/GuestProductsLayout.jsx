import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useGetCategoriesQuery } from '../../api/productApi'
import SearchBox from '../../components/SearchBox'

const GuestProductsLayout = () => {
  const param = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [originalKeyword, setOriginalKeyword] = useState()
  const [categorySlug, setCategorySlug] = useState()
  const {data, error, isLoading} = useGetCategoriesQuery()
  const [categories, setCategories] = useState()
  const nav = useNavigate()

  const goCategoryProducts = (slug) => {
    nav(`/categories/${slug}/products`)
  }

  useEffect(() => {
    if(data){
      setCategories(data?.categories)
    }
  }, [isLoading, data])

  useEffect(() => {
    console.log("location :", param);
    setCategorySlug(param.category)
    console.log(categorySlug);
  }, [param])

  useEffect(() => {
    const keyword = searchParams.get("keyword")
    setOriginalKeyword(keyword)
  }, [])
  return (
    <>
    <div className='flex m-5 gap-5'>
      
        <div>
        <h3 className="text-xl my-3 font-bold">Categories</h3>
        
        <div className="w-[250px] border border-b-0 rounded shadow-sm">
        
        <div
            className='cursor-pointer hover:bg-gray-100'
            onClick={() => nav("/")}
            >
                <div className='flex text-lg items-center p-2'>
                    All
                </div>
                <hr />
        </div>  
            {
                categories?.map(category => 
                <div onClick={() => goCategoryProducts(category?.category_slug)}
                key={category.id}
                >
                  <div 
                className={`cursor-pointer hover:bg-gray-200 ${categorySlug == category?.category_slug && "bg-gray-200"}`}
                  >
                    <div className='flex items-center p-2'>
                        {category.name}
                    </div>
                    <hr />
                  </div>
                    
                </div>    
                )
            }
        </div>
        </div>
        <div className='w-full'>
            <div className='flex justify-end'>
            <div className='my-3'>
              <SearchBox defaultValue={originalKeyword}/>
            </div>
            </div>
            <Outlet />
        </div>
    </div>
    </>
  )
}

export default GuestProductsLayout
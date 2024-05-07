import React, { useEffect, useState } from 'react'
import { useAddCategoryMutation, useGetCategoriesQuery } from '../../api/productApi'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

const ProductsLayout = () => {
  const categoriesData = useGetCategoriesQuery()
  const {category} = useParams()
  const [categorySlug, setCategorySlug] = useState()
  const [categories, setCategories] = useState()
  const nav = useNavigate()

  useEffect(() => {
    if(categoriesData?.data){
      setCategories(categoriesData?.data?.categories)
      console.log("categories data : ",categoriesData);
    }
  }, [categoriesData])

  useEffect(() => {
    setCategorySlug(category)
  }, [category])

  return (
    <div className='flex gap-3'>
        <div className="">
          
          <h3 className="text-xl mb-5">Categories</h3>

          <div className="w-[250px] border border-b-0 rounded shadow-sm">
        
        <div
            className='cursor-pointer hover:bg-gray-100'
            onClick={() => nav("/dashboard")}
            >
                <div className='flex text-lg items-center p-2'>
                    All
                </div>
                <hr />
        </div>  
            {
                categories?.map(category => 
                <div 
                onClick={() => nav(`categories/${category?.category_slug}/products`)}
                key={category.id}
                >
                  <div 
                className={`cursor-pointer hover:bg-gray-200 ${categorySlug == category?.category_slug && "bg-gray-200"}`} 
                // 
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
            <Outlet />
        </div>
    </div>
  )
}

export default ProductsLayout
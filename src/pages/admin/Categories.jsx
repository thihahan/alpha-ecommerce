import React, { useEffect, useRef, useState } from 'react'
import uuid4 from 'uuid4'
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from '../../api/productApi'
import { BsBoxSeam, BsPersonCircle } from "react-icons/bs"
import { Link, useNavigate } from 'react-router-dom'
import { BiEdit, BiTrash } from 'react-icons/bi'
import Action from '../../components/Action'
import AreYouSure from '../../components/AreYouSure'
import { useSelector } from 'react-redux'

const Categories = () => {
  const [categories, setCategories] = useState()
  const {data, error, isLoading} = useGetCategoriesQuery()
  const user = useSelector(state => state.auth.user)
  const nav = useNavigate()
  const [showSureBtn, setShowSureBtn] = useState()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [addCategory] = useAddCategoryMutation()
  useEffect(() => {
    if(data){
      console.log("categories :", data);
      setCategories(data?.categories)
    }
  }, [data])

  const dateFormat = (date) => {
    const newDate = new Date(date)
    return newDate.getDate() + "-" + newDate.getDay() + "-" + newDate.getFullYear()
  }

  const addCategoryHandler = async () => {
    const name = prompt("enter new category name")
    if(name){
      const {data, error} = await addCategory(name)
      if(data){
        console.log(data);
      }
      if(error){
        console.log(error?.data?.message);
        alert(`Warning : ${error?.data?.message}`)
      }
    }
  }

  const editCategoryHandler = async (id, originalName) => {
    const name = prompt("update category name", originalName)
    if(name){
      if(name != originalName){
        const {data, error} = await updateCategory({id, body : {name, user_id : user.id}})
        if(data){
          console.log("data",data);
        }
        if(error){
          console.log("error",error?.data?.message);
          alert(`Warning : ${error?.data?.message}`)

        }
      }
    }
  }

  const deleteCategoryHandler = async (id) => {
    const {data, error} = await deleteCategory(id)
    if(data){
      console.log(data);
      setShowSureBtn(false)
    }
    if(error){
      console.log(error);
    }
    setShowSureBtn(false)
  }

  return (
    <div className='mb-5'>
      <div className='mb-2 flex items-center justify-between'>
        <button className='button' onClick={addCategoryHandler}>
          Add Category
        </button>
      </div>
        <table className='table w-full'>
          <thead>
            <tr>
              <th className='py-2 px-3 border'>#</th>
              <th className='py-2 px-3 border'>Name</th>
              <th className='py-2 px-3 border'>Created User</th>
              <th className='py-2 px-3 border'>Created_at</th>
              <th className='py-2 px-3 border'>Products</th>
              <th className='py-2 px-3 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              categories?.map(category => 
              <tr key={uuid4()}>
                <td className='py-2 px-3 border text-center'>{category?.id}</td>
                <td className='py-2 px-3 border text-center'>{category?.name}</td>
                <td className='py-2 px-3 border text-center'>
                  <div className='flex items-center gap-2 justify-center'>
                  <div>
                  {
                    category?.user?.profile_photo_url ? (<>
                    <img className='w-[40px]' src={category?.user?.profile_photo_url} alt="" />
                    </>) : (<>
                        <BsPersonCircle className='text-[40px] rounded-full'/>
                    </>)
                    }
                  </div>
                  <Link to={`/dashboard/users/${category?.user?.id}`} className='hover:underline'>
                    {category?.user?.name}
                  </Link>
                  </div>
                </td>
                <td className='py-2 px-3 border text-center'>{dateFormat(category?.created_at)}</td>
                <td className='py-2 px-3 border relative'>
                  <div className='flex justify-center cursor-pointer hover:font-bold'
                  onClick={() => {
                    nav(`/dashboard/categories/${category?.category_slug}/products`)
                  }}
                  >
                    <div className="relative">
                    <BsBoxSeam />
                      <div 
                      
                      className='absolute -top-3 -right-2'>
                        <span className='text-red-500 font-bold'>
                        {category?.total_products}
                        </span>
                      </div>
                    </div>
                  
                  </div>
                </td>
                <td 
                className={`px-3 py-2 mx-2 border text-center`}>
                  <div className='flex justify-center gap-3'>
                  <Action icon={<BiEdit />} 
                  actionHandler={() => editCategoryHandler(category?.id, category?.name)}
                    text={"Edit"} textColor={"text-green-500"} 
                    />
                    <Action icon={<BiTrash className='text-2xl'/>}
                      actionHandler={() => {
                        setShowSureBtn(true)
                      }} 
                      text={"Remove"} textColor={"text-red-500"}/>
                  </div>
                  <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} actionHandler={() => deleteCategoryHandler(category.id)}/>

                </td>
              </tr>  
              )
            }
          </tbody>
        </table>
    </div>
  )
}

export default Categories
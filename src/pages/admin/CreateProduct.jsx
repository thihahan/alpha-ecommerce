import React, { useEffect, useRef, useState } from 'react'
import { useCreateProductMutation, useGetCategoriesQuery } from '../../api/productApi'
import { RxCross2 } from "react-icons/rx"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import {IoIosArrowForward} from "react-icons/io"

const CreateProduct = () => {
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const inputRef = useRef()
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState()
  const [productDescription, setProductDescription] = useState("")
  const [productStock, setProductStock] = useState()
  const [productImages, setProductImages] = useState()
  const [imageFiles, setImageFiles] = useState([])
  const [errorMessages, setErrorMessages] = useState()
  const [createProduct] = useCreateProductMutation()
  const {data, error, isLoading} = useGetCategoriesQuery()
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState()
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const uploadImgs = async (e) => {
    setLoading(true)
    const tempFiles = e.target.files 
    const files = [] 
    for (let i = 0; i < tempFiles.length; i++) {
      const type = tempFiles[i]?.type 
      if(type == "image/png" || type == "image/jpg" || type == "image/jpeg"){
        files.push(tempFiles[i])
      }else{
        alert(`${tempFiles[i]?.name} file type is not allowed`)
      }
    }
    setProductImages(e.target.files)
    const urls = []
    setImageFiles([...imageFiles,  ...files])
    setLoading(false)
  }
  const submitHandler =async (e) => {
    e.preventDefault()
    
    setLoading(true)
    const formData = new FormData()
    formData.append("productName", productName)
    formData.append("productPrice", productPrice)
    formData.append("productDescription", productDescription)
    formData.append("productStock", productStock)
    console.log(formData);
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images[]", imageFiles[i])      
    }
    categoryIds && categoryIds.forEach(element => {
      formData.append("category_ids[]", element)
    })
    const {data, error} = await createProduct(formData)
    if(data){
      nav("/dashboard")
      console.log("data : ", data);
    }
    if(error){
      console.log("error : ", error?.data?.errors);
      setErrorMessages((error?.data?.errors))
    }
    setLoading(false)
  }

  const imgRemoveHandler = (imgFile) => {
    setImageFiles(imageFiles.filter(file => file != imgFile))
  }

  const addCategory = (e, id) => {
    // e.target.class
    if(categoryIds){
      if(categoryIds.includes(id)){
        setCategoryIds(pre => pre?.filter(categoryId => categoryId != id))

      }else{
        setCategoryIds([...categoryIds, id])
      }
    }else{
      setCategoryIds([id])
    }
  }

  useEffect(() => {
    data && setCategories(data?.categories);
    console.log(data);
  }, [isLoading, categoryIds])
  return (
    <>
    {
      loading && <Loader />
    }
      <div className='mx-5'>
      <div className='my-5 flex justify-between items-center'>
        <h3 className='font-bold text-xl'>Add Product</h3>
        <div className='flex items-center gap-1'>
              <Link to={"/dashboard"} 
              
            className='font-bold cursor-pointer select-none'>
              <span>Products</span></Link>
            <span><IoIosArrowForward /></span>
            

            <span>Create</span>
        </div>
      </div>
        <div className={`${darkMode && "border-gray-500"} p-5 border rounded shadow-md`}>
            <form action="" onSubmit={submitHandler}>
              <div className='mb-3'>
                <label className='' htmlFor="name">Product Name </label>
                <input 
                onChange={(e) => setProductName(e.target.value)}
                className={`border ${darkMode && "bg-gray-700 border-gray-500"} w-full outline-none rounded shadow-sm py-3 px-1`} type="text" id='name' />
                {
                  errorMessages?.productName?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
                }
              </div>
              <div className='mb-3 '>
                <label className='' htmlFor="price">Product Price </label>
                <input 
                value={productPrice}
                onChange={(e) => e.target.value >= 0 && setProductPrice(e.target.value)}
                className={`border w-full outline-none rounded shadow-sm py-3 px-1 ${darkMode && "bg-gray-700 border-gray-500"}`} 
                type="number" id='price' />
                {
                  errorMessages?.productPrice?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
                }
              </div>
              <div className='mb-3 '>
                <label className='' htmlFor="description">Product Description </label>
                <textarea 
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)} rows="5"
                className={`border w-full outline-none rounded shadow-sm py-3 px-1 ${darkMode && "bg-gray-700 border-gray-500"}`} 
                id='description'></textarea>
                {
                  errorMessages?.productDescription?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
                }
              </div>
              <div className='mb-3 '>
                <label className='' htmlFor="stock">stock </label>
                <input 
                value={productStock}
                onChange={(e) => e.target.value > 0 && setProductStock(e.target.value)}
                className={`border w-full outline-none rounded shadow-sm py-3 px-1 ${darkMode && "bg-gray-700 border-gray-500"}`} 
                type="number" id='stock' />
                {
                  errorMessages?.productStock?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
                }
              </div>
              <div className='mb-3'>
                <label htmlFor="category mb-1">Categories</label>
                <div className={`border rounded p-5 ${darkMode && "border-gray-500"} flex flex-wrap`}>
                  {
                    categories?.map(category => <span key={category.id} onClick={(e) => addCategory(e, category.id)} 
                    className={`px-4 cursor-pointer select-none ${categoryIds?.includes(category.id) && "text-white bg-blue-500"} py-2 rounded-full border m-1`}>
                      {category.name}
                      </span>)
                  }
                  
                </div>
                  {
                    errorMessages?.category_ids?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
                  }
              </div>
              <div className={`mb-3 rounded`} onClick={() => inputRef.current.click()}>
                <label htmlFor="photos">Product Images</label>
                <input
                onChange={uploadImgs}
                type="file" id='photos' multiple className='hidden' ref={inputRef} />
                <h3 className={`py-4 w-full border rounded underline text-center select-none ${darkMode && "border-gray-500"}`}>Browse</h3>
              </div>
              
              <div className='flex flex-wrap gap-2'>
                {
                  imageFiles && imageFiles.map((imgFile,i) => (
                    <div key={i} className="w-[200px] relative">
                      <div onClick={() => imgRemoveHandler(imgFile)} className='p-2 hover:bg-gray-600 active:scale-105 transition duration-75 rounded-full absolute bg-gray-500 top-1 left-1'>
                        <RxCross2 className='text-white'/>
                      </div>
                      <img src={URL.createObjectURL(imgFile)} alt="" className='w-full' />
                  </div>
                  ))
                }
              </div>
              <div className='flex mt-3 justify-end mb-3'>
                <button className={`px-2 py-3 border rounded active:scale-105 transition duration-100  ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>add product</button>
              </div>
            </form>
        </div>
      </div>
    </>
  )
}

export default CreateProduct
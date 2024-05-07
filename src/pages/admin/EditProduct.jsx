import React, { useEffect, useRef, useState } from 'react'
import { useDeletePhotosMutation, useGetCategoriesQuery, 
  useGetProductQuery, useUpdateProductMutation } from '../../api/productApi'
import { RxCross2 } from "react-icons/rx"
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import Loader from '../../components/Loader'
import { IoIosArrowForward } from "react-icons/io"

const EditProduct = () => {
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const inputRef = useRef()
  const {id} = useParams()
  const [product, setProduct] = useState()
  const [productName, setProductName] = useState()
  const [productPrice, setProductPrice] = useState()
  const [productDescription, setProductDescription] = useState()
  const [productStock, setProductStock] = useState()
  const [imageFiles, setImageFiles] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [deletedImgUrls, setDeletedImgUrls] = useState([])
  const [errorMessages, setErrorMessages] = useState()
  const [categories, setCategories] = useState()
  const [categoryIds, setCategoryIds] = useState()
  const [customLoading, setCustomLoading] = useState(false)

  // api requests
  const [updateProduct] = useUpdateProductMutation()
  const [deletePhotos] = useDeletePhotosMutation()
  const {data, error, isLoading} = useGetCategoriesQuery()
  const productData = useGetProductQuery(id)
  const location = useLocation()
  const nav = useNavigate()
  const uploadImgs = async (e) => {
    const files = e.target.files 
    const urls = []
    for (let index = 0; index < files.length; index++) {
        urls.push({id : uuidv4(), url : URL.createObjectURL(files[index])})        
    }
    setImageFiles([...imageFiles,  ...files])
    setImageUrls([...imageUrls,...urls])

  }
  const submitHandler =async (e) => {
    e.preventDefault()
    setCustomLoading(true)
    // photos delete
    console.log("deleted img urls", deletedImgUrls);
    const photoDeletedData =await deletePhotos({ids : deletedImgUrls})
    console.log("photo delete data", photoDeletedData);
    if(photoDeletedData.data){
      console.log(data);
    }
    if(photoDeletedData.error){
      console.log(photoDeletedData.error);
    }

    const formData = new FormData()
    formData.append("_method", "PUT")
    formData.append("productName", productName)
    formData.append("productPrice", productPrice)
    formData.append("productDescription", productDescription)
    formData.append("productStock", productStock)
    categoryIds.forEach(element => {
      formData.append("category_ids[]", parseInt(element))
    });
    
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images[]", imageFiles[i])      
    }
    const {data, error} = await updateProduct({formData, id: product.id})

    if(data){
      const redirectTo = location.state?.redirectTo
      redirectTo ? nav(redirectTo) : nav("/dashboard")
    }
    if(error){
      console.log("error : ", error);
      setErrorMessages((error?.data?.errors))
    }
    setCustomLoading(false)
  }

  const imgRemoveHandler = async (id) => {
    console.log(id);
    setImageUrls(images => images.filter(img => img.id != id))
    setDeletedImgUrls([...deletedImgUrls, id])
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
    setCustomLoading(true)
    data && setCategories(data?.categories);
    if(productData.data){
        setProduct(productData.data.product)
        setProductName(productData.data.product?.name)
        setProductPrice(productData.data.product?.price)
        setProductDescription(productData.data.product?.description)
        setProductStock(productData.data.product?.stock_quantity)
        setCategoryIds(productData.data.product?.categories?.map(category => category.id))
        const urls = productData?.data?.product?.photos?.map(photo => {
            const urlData = {"id" : photo.id, "url" : `http://localhost:8000/storage/products/${photo.photo_url}`}
            return urlData 
        })
        setImageUrls(urls)
    }
    setCustomLoading(false)

  }, [isLoading, productData])
  return (
    <>
    {
      customLoading && <Loader />
    }
      <div className='mx-5'>
      <div className='my-5 flex justify-between items-center'>
        <h3 className='font-bold text-xl'>Edit Product</h3>
        <div className='flex items-center gap-1'>
              <Link to={"/dashboard"} 
              
            className='font-bold cursor-pointer select-none'>
              <span>Products</span></Link>
            <span><IoIosArrowForward /></span>
            <Link to={`/dashboard/products/${id}`} 
              
            className='font-bold cursor-pointer select-none'>
              <span>{product?.name}</span></Link>
            <span><IoIosArrowForward /></span>

            <span>Edit</span>
        </div>
      </div>
      <div className={`${darkMode && "border-gray-500"} p-5 border rounded shadow-md`}>
          <form action="" onSubmit={submitHandler}>
            <div className='mb-3'>
              <label className='' htmlFor="name">Product Name </label>
              <input 
              value={productName}
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

              onChange={(e) => e.target.value > 0 && setProductPrice(e.target.value)}
              className={`border w-full outline-none rounded shadow-sm py-3 px-1 ${darkMode && "bg-gray-700 border-gray-500"}`} 
              type="number" id='price' />
              {
                errorMessages?.productPrice?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
              }
            </div>
            <div className='mb-3 '>
              <label className='' htmlFor="description">Product Description </label>
              <textarea
              value={productDescription} rows="5"
              onChange={(e) => setProductDescription(e.target.value)}
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
              onChange={(e) => e.target.value >= 0 && setProductStock(e.target.value)}
              className={`border w-full outline-none rounded shadow-sm py-3 px-1 ${darkMode && "bg-gray-700 border-gray-500"}`} 
               type="number" id='stock' />
              {
                errorMessages?.productStock?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
              }
            </div>
            <div className='mb-3'>
              <label htmlFor="category mb-1">Category</label>
              <div>
                {
                  <div className={`border rounded p-5 ${darkMode && "border-gray-500"} flex flex-wrap`}>
                  {
                    categories?.map(category => <span key={category.id} onClick={(e) => addCategory(e, category.id)} 
                    className={`px-4 cursor-pointer select-none ${categoryIds?.includes(category.id) && "text-white bg-blue-500"} py-2 rounded-full border m-1`}>
                      {category.name}
                      </span>)
                  }
                  {
                    errorMessages?.category_ids?.map((message,i) => <p key={i} className="text-sm text-red-600">{message}</p>)
                  }
                </div>
                }
              </div>
            </div>
            <div className={`mb-3 rounded`} onClick={() => inputRef.current.click()}>
              <label htmlFor="photos">Product Images</label>
              <input
              onChange={uploadImgs}
              type="file" id='photos' multiple className='hidden' ref={inputRef} />
              <h3 className={`py-4 w-full border rounded underline text-center select-none ${darkMode && "border-gray-500"}`}>Browse</h3>
            </div>
            
            <div className='flex gap-2'>
              {
                imageUrls && imageUrls.map((imgUrl,i) => (
                  <div key={i} className="w-[200px] relative">
                    <div onClick={() => imgRemoveHandler(imgUrl.id)} className='p-2 hover:bg-gray-600 active:scale-105 transition duration-75 rounded-full absolute bg-gray-500 top-1 left-1'>
                      <RxCross2 className='text-white'/>
                    </div>
                    <img src={imgUrl.url} alt="" className='w-full' />
                </div>
                ))
              }
            </div>
            <div className='flex justify-between my-3'>
              <button className={`px-2 py-3 border rounded active:scale-105 transition duration-100  ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                <NavLink to={location.state?.redirectTo ? `${location.state?.redirectTo}` : ".."}>Back & Cancel</NavLink>
                </button> 

              <button className={`px-2 py-3 border rounded active:scale-105 transition duration-100  ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>update product</button>
            </div>
          </form>
      </div>
    </div>
    </>
  )
}

export default EditProduct
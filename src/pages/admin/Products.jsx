import React, { useEffect, useState } from 'react'
import { useAddCategoryMutation, useDeleteProductMutation
  , useGetCategoriesQuery, useGetProductsQuery } from '../../api/productApi'
import ProductsPagesSwicher from '../../components/ProductsPagesSwicher'
import {BiDetail,BiSolidEdit,BiTrash } from "react-icons/bi"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from "../../components/Loader"
import Action from '../../components/Action'
import AreYouSure from '../../components/AreYouSure'
import StockMenu from '../../components/StockMenu'
import SearchBox from '../../components/SearchBox'
import { createParmsObj } from '../../utils/createSearchParmsObj'
import {  addTotalProducts } from '../../features/ProductSlice'
import { LuArrowDownUp } from 'react-icons/lu'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [params, setParams] = useState()
  const productsData = useGetProductsQuery(params)
  const [links, setLinks] = useState()
  const [lastPage, setLastPage] = useState()
  const [products, setProducts] = useState()
  const [priceOrder, setPriceOrder] = useState()
  const [addCategory] = useAddCategoryMutation()
  const baseUrl = "http://localhost:8000/storage/products/"
  const [isLoading , setIsLoading] = useState(false)
  const [showSureBtn, setShowSureBtn] = useState(false)
  const [toDeleteId, setToDeleteId] = useState()
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [deleteProduct] = useDeleteProductMutation()
  const [orderByDesc, setOrderByDesc] = useState(false)
  const deleteProductHandler = async (productId) => {
    setIsLoading(true)
    const {data, error} = await deleteProduct(productId)
    if(data){
      console.log("data", data);
    }
    if(error){
      console.log("error", error);
    }
    setShowSureBtn(false)
    setIsLoading(false)
  }

  

  useEffect(() => {
    setIsLoading(true)
    const searchParamsString = searchParams.toString()
    setParams(searchParamsString)
  }, [searchParams])

  useEffect(() => {
    if(productsData.data){
      console.log("products data :", productsData?.data);
      setProducts(productsData?.data?.data)
      setLinks(productsData?.data?.meta?.links)
      setLastPage(productsData?.data?.meta?.last_page)
      dispatch(addTotalProducts(productsData?.data?.meta?.total))
    }
    setIsLoading(false)
  }, [productsData])

  useEffect(() => {
    const searchParamsObj = createParmsObj(searchParams)
    setSearchParams({...searchParamsObj, "price" : priceOrder})
    const searchParamsString = searchParams.toString()
    setParams(searchParamsString)
  }, [priceOrder])

  useEffect(() => {
    const price = searchParams.get("price")
    if(price){
      setPriceOrder(price)
    }
  }, [])

  useEffect(() => {
    const searchParamsObj = createParmsObj(searchParams)
    setSearchParams({...searchParamsObj, "orderby" : orderByDesc ? "desc" : "asc"})
  }, [orderByDesc])

  
  return (
    <>

    {
      isLoading && <Loader />
    }
    <div className='flex justify-between'>
    
      </div>
      <br />
      <div className='flex gap-2'>
          <div className='w-full h-screen overflow-scroll'>
            <div className="my-2 flex gap-2 justify-between">
              <div 
              className='relative w-full '>
                <SearchBox/>
              </div>
              <StockMenu />
              <div className='flex items-center gap-2 mx-2'>
                  <select name="" value={priceOrder}
                  onChange={(e) => setPriceOrder(e.target.value)}
                  id="" className='button'>
                    <option value="">Price</option>
                    <option value="max">max</option>
                    <option value="min">min</option>
                  </select>
              </div>
              <div className={`button flex items-center cursor-pointer ${orderByDesc && "bg-gray-200"}`}
          onClick={() => setOrderByDesc(!orderByDesc)}
          >
            <LuArrowDownUp />
          </div>
            </div>
          <table className={`border p-3 shadow-sm w-full table-auto`}>
            <thead className={`border-b py-3`}>
              <tr>
                <th className='px-3 py-2 mx-2'>#</th>
                <th className='px-3 py-2 mx-2'>Product</th>
                <th className='px-3 py-2 mx-2'>Price</th>
                <th className='px-3 py-2 mx-2'>Stock</th>
                <th></th>
                <th className='px-3 py-2 mx-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                products?.map((product, index) => (
                  <tr key={product.id}>
                    <td className={`px-3 py-2 mx-2 border text-center`}>{product.id}</td>
                    <td className={`px-3 py-2 mx-2 border`}>
                      <div className='flex gap-3 items-center'>
                        <div className=''>
                          <img src={baseUrl + product?.photos[0]?.photo_url} alt="" onClick={() => nav(`products/${product.id}`)}
                          className='w-[70px] rounded hover:scale-105 cursor-pointer' />

                        </div>
                      <h3>{product.name}</h3>


                      </div>
                    </td>
                    <td className={`px-3 py-2 mx-2 border text-center`}>{product.price} Ks</td>
                    <td className={`px-3 py-2 mx-2 border text-center`}>
                      {product?.stock_quantity == 0 ? <span className='text-red-500'>out of stock</span>
                       : product?.stock_quantity}
                    </td>

                    <td className={`px-3 py-2 mx-2 border text-center`}>orders</td>
                    <td className={`px-3 py-2 mx-2 border text-center`}>
                    <div className='flex justify-center'>
                      <Action icon={<BiDetail />} actionHandler={() => nav(`products/${product.id}`)}
                      text={"Detail"} textColor={""} 
                      />
                      {/*edit */}
                      <Action icon={<BiSolidEdit />} textColor={"text-green-500"} text={"Edit"} 
                      actionHandler={() => nav(`products/edit/${product?.id}`)} />
                      
                      <Action icon={<BiTrash />}
                      actionHandler={() => {
                        setShowSureBtn(true)
                        setToDeleteId(product.id) 
                        }} text={"Remove"} textColor={"text-red-500"}/>
                      </div>
                    </td>
                    <AreYouSure showSureBtn={showSureBtn} cancelHandler={() => setShowSureBtn(false)} 
                    actionHandler={() => deleteProductHandler(toDeleteId)}/>

                  </tr>

                  ))
                }
                </tbody>
            </table>
            {
              lastPage > 1 &&
            <ProductsPagesSwicher links={links} lastPage={lastPage} />

            }
          </div>
      </div>

    </>
  )
}

export default Products
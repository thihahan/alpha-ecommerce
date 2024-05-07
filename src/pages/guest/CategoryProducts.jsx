import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetCategoryProductsQuery } from '../../api/productApi';
import Product from '../../components/Product';
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';
import ProductsPagesSwicher from '../../components/ProductsPagesSwicher';
import uuid4 from 'uuid4';

const CategoryProducts = () => {
    const {category} = useParams()
    const [searchParams, setSearchParmas] = useSearchParams()
    const [params, setParms] = useState()
    const {data, error, isLoading} = useGetCategoryProductsQuery({category, params})
    const [products, setProducts] = useState()
    const baseUrl = "http://localhost:8000/storage/products/"
    const location = useLocation()
    const [links, setLinks] = useState()
    const darkMode = useSelector(state => state.darkMode.darkMode)
    const [customLoader, setCustomLoader] = useState(false)
    const [lastPage, setLastPage] = useState()
    const nav = useNavigate()
    const productDetailHandler = (product_id) => {
        return nav(`/products/${product_id}`, {state : {"redirectTo" : location.pathname }})
    }
    useEffect(() => {
        const searchParamsString = searchParams.toString()
        setParms(searchParamsString)
    }, [searchParams])

    useEffect(() => {
        setCustomLoader(true)
    }, [category, params])
    

    useEffect(() => {
        console.log("category data : ", data);
        if(data){
            setProducts(data?.data)
            setLinks(data?.meta?.links)
            setLastPage(data?.meta?.last_page)
        }
        setCustomLoader(false)
    }, [isLoading, data, searchParams])

    
    return (
        customLoader ? <Loader /> : 
        <div className=''>
           <div className="w-full h-screen overflow-scroll p-1">
           <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 justify-between mx-auto w-full gap-3'>
                {
                    products && products?.map((product,i) => 
                    <div key={uuid4()}
                    onClick={() => productDetailHandler(product.id)}
                    className={`w-full p-5 cursor-pointer hover:shadow-lg border shadow-sm transition duration-200 rounded relative ${darkMode && "border-gray-500"}`}>
                        {
                        product.photos && (
                          <div className='relative'
                          >
                            <div className='mb-3 flex justify-center rounded'>
                              <img className='w-[150px] h-[150px]' src={baseUrl + product.photos[0]?.photo_url} alt="" /></div>
                          </div>
                        )
                        
                        
                        }
                        <h3> {product?.name.substring(0, 15)}...</h3>
                        <h3>{product?.price} Ks</h3>
                        <h3>Stock - {product?.stock_quantity}</h3>
                        <div className="my-2">
                          <button className="button">Detail</button>
                        </div>
                    </div>
                    )
                }
            </div>
            {   
                  products?.length < 1 && 
                  <h3 className='text-lg text-center'>There is no products</h3>
            }
           </div>
           
           <hr />
            <div>
                {
                    lastPage > 1 && 
                <ProductsPagesSwicher links={links} lastPage={lastPage}/>
            }
            

            </div>
            
        </div>
    )
}

export default CategoryProducts
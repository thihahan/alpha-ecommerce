import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCart as addCartToSlice, addOrderCart, removeCart } from '../features/ProductSlice'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAddCartMutation } from '../api/cartApi'
import { AiOutlineShoppingCart } from "react-icons/ai"
import Loader from './Loader'

const HandleCart = ({product}) => {
  const cart = useSelector(state => state.products.cart)
  const isAuth = useSelector(state => state.auth.isAuth)
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const [quantity, setQuantity] = useState(1)
  const [buyQuantity, setBuyQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showCartBtn, setShowCartBtn] = useState(false)
  const dispatch = useDispatch()
  const [addCart] = useAddCartMutation()
  const nav = useNavigate()
  const productBuyHandler = async () => {
    setIsLoading(true)
    if(buyQuantity == 0){
      setIsLoading(false)
      return
    }
    if(isAuth){
        const {data, error} = await addCart({"product_id" : product.id, "quantity" : buyQuantity})
        if(data){
            nav("/orders/create", {state : {"redirectTo" : `/products/${product.id}`}})
        }
        if(error){
            console.log("response error from add cart request : ", error);
        }
    }else{
      return nav("/login", {state : {"message" : "You need to login first", 
      "redirectTo" : `/products/${product.id}`}})
    }
    setIsLoading(false)
  }

  
  const addToCartHandler = async () => {
    setIsLoading(true)
    if(quantity == 0){
      setIsLoading(false)
      return
    }
    if(isAuth){
        const {data, error} = await addCart({"product_id" : product.id, "quantity" : quantity})
        if(data){
            console.log("response data from add cart request : ", data);
            setIsLoading(false)
        }
        if(error){
            console.log("response error from add cart request : ", error);
        }
    }else{
      return nav("/login", {state : {"message" : "You need to login first", 
      "redirectTo" : `/products/${product.id}`}})
    }
    setIsLoading(false)

  }


  useEffect(() => {
    const bool = cart?.find(ele => ele?.product?.id == product?.id)
    bool ? setShowCartBtn(true) : setShowCartBtn(false)
  }, [cart])
  return (
    isLoading ? <Loader /> :
    <div className='flex justify-between'>
      <div className='flex flex-col'>
      <input type="number" name="" className='border p-2'
               value={buyQuantity} 
               onChange={(e) => (e.target.value > 0 && e.target.value <= product?.stock_quantity) && setBuyQuantity(e.target.value)}
               id="" />
      <button className={`${darkMode ? "darkmode-button" : "button"}`} onClick={productBuyHandler }>Buy Now</button>
      </div>
          {
            cart?.find(ele => ele?.product?.id == product?.id) ? (
              <div>
              <button className='button' onClick={() => nav("/cart")}>Cart</button>

              </div>
            ) : (
             <div className='flex flex-col'>
               <input type="number" name="" className='border p-2'
               value={quantity} 
               onChange={(e) => (e.target.value > 0 && e.target.value <= product?.stock_quantity) && setQuantity(e.target.value)}
               id="" />
              <button className='button flex items-center gap-3 justify-center' onClick={addToCartHandler}>
                <span><AiOutlineShoppingCart /></span>
                <span>Add To Cart</span>  
              </button>   

             </div>
            )
          }
            
    </div>
  )
}

export default HandleCart
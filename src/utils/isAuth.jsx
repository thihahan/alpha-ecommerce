import Cookies from "js-cookie"

export const isAuth = () => {
    if(Cookies.get("token")){
        return true
    }else{
        return false
    }
}
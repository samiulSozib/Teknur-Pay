import axios from "axios";
import { LOGOUT, SIGN_IN_FAIL, SIGN_IN_REQUEST, SIGN_IN_SUCCESS } from "../constants/authConstant";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import i18next from "i18next"; // Import i18next
import { base_url } from "../../utils/const";


const login_url=`${base_url}/login`

export const signIn=(singInInfo)=>{
    return async (dispatch)=>{
        
        dispatch({type:SIGN_IN_REQUEST})
        try{
            const response=await axios.post(login_url,singInInfo)
            console.log(response)
            const {api_token,user_info}=response.data.data
            //console.log(api_token)
            
            dispatch({type:SIGN_IN_SUCCESS,payload:{api_token,user_info}})
            Swal.fire({
                title: i18next.t("GOOD_JOB"),
                text: i18next.t("LOGIN_SUCCESS"),
                icon: "success",
                
              });
            
        }catch(error){
            console.log(error)
            const errorMessage=error.response.data.errors
           
            dispatch({type:SIGN_IN_FAIL,payload:errorMessage})
            Swal.fire({
                icon: "error",
                title: i18next.t("LOGIN_FAIL"),
                text: errorMessage,
              });
            
        }
    }
}

export const logout = () => {
    return (dispatch) => {
      localStorage.removeItem('user_info');
      localStorage.removeItem('token');
      dispatch({ type: LOGOUT });
      Swal.fire({
        title: i18next.t("GOOD_JOB"),
        text: i18next.t("LOGOUT_SUCCESS"),
        icon: "success"
      });
    };
  };
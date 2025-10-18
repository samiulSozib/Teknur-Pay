
import axios from "axios";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import { base_url } from "../../utils/const";
import { ADD_COMMISSION_GROUP_FAIL, ADD_COMMISSION_GROUP_REQUEST, ADD_COMMISSION_GROUP_SUCCESS, COMMISSION_GROUP_LIST_FAIL, COMMISSION_GROUP_LIST_REQUEST, COMMISSION_GROUP_LIST_SUCCESS } from "../constants/commissionGroupConstant";

export const getCommissionGroups=(page,items_per_page)=>{
    return async (dispatch)=>{
        
        dispatch({type:COMMISSION_GROUP_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const commission_group_url=`${base_url}/sub-reseller-commission-group? page=${page} & items_per_page=${items_per_page}`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(commission_group_url,config)
            console.log(response)
            const {groups}=response.data.data
            
            
           
            //console.log(response)
            dispatch({type:COMMISSION_GROUP_LIST_SUCCESS,payload:groups})
        }catch(error){
            dispatch({type:COMMISSION_GROUP_LIST_FAIL,payload:error.message})
        }
    }
}

export const addCommissionGroup=(commissionGroupData)=>{
    return async (dispatch)=>{
        
        dispatch({type:ADD_COMMISSION_GROUP_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const commission_group_url=`${base_url}/sub-reseller-commission-group`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` ,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const formData=new FormData()
            formData.append("group_name",commissionGroupData.groupName)
            formData.append('amount',commissionGroupData.amount)
            formData.append("commission_type",commissionGroupData.commissionType)

            const response=await axios.post(commission_group_url,formData,config)
            const {group}=response.data.data
            const message=response.data.message
            console.log(response)
           
            //console.log(message)
            dispatch({type:ADD_COMMISSION_GROUP_SUCCESS,payload:{group,message}})
            //toast.success("Sub Reseller Add Success")
        }catch(error){
            console.log(error)
            const errorMessage=error.response.data.message
            //toast.error(errorMessage)
            Swal.fire({
                      title: "Error!",
                      text: errorMessage,
                      icon: "error"
                    });
            dispatch({type:ADD_COMMISSION_GROUP_FAIL,payload:errorMessage})
        }
    }
}

import axios from "axios";

import { 
    TRANSACTION_LIST_REQUEST, 
    TRANSACTION_LIST_SUCCESS, 
    TRANSACTION_LIST_FAIL } from "../constants/transactionConstant";
import { base_url } from "../../utils/const";




export const getTransactions=(page,items_per_page)=>{
    return async (dispatch)=>{
        
        dispatch({type:TRANSACTION_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const transaction_url=`${base_url}/balance_transactions? page=${page} & items_per_page=${items_per_page}`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(transaction_url,config)
            const {reseller_balance_transactions}=response.data.data
            const total_items=response.data.payload.pagination.total
            const per_page=response.data.payload.pagination.items_per_page 
            const current_page=response.data.payload.pagination.from
            const total_pages=response.data.payload.pagination.page
            
           
            console.log(response)
            dispatch({type:TRANSACTION_LIST_SUCCESS,payload:{reseller_balance_transactions,total_items,per_page,current_page,total_pages}})
        }catch(error){
            dispatch({type:TRANSACTION_LIST_FAIL,payload:error.message})
        }
    }
}



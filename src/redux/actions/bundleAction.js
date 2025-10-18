import axios from "axios";

import { 
    BUNDLE_LIST_REQUEST, 
    BUNDLE_LIST_SUCCESS, 
    BUNDLE_LIST_FAIL } from "../constants/bundleConstant";
import { base_url } from "../../utils/const";




export const getBundles=(page,items_per_page,country_id,validity_type,company_id,service_category_id,search_tag)=>{
    return async (dispatch)=>{
        
        dispatch({type:BUNDLE_LIST_REQUEST})
        try{
            
            // console.log('country_id'+ country_id)
            // console.log('company_id'+ company_id)
            // console.log('service_category_id'+ service_category_id)

            const token = localStorage.getItem('token');

            const bundle_url=`${base_url}/bundles?page=${page}&items_per_page=${items_per_page}&country_id=${country_id}&
            validity_type=${validity_type}&company_id=${company_id}&service_category_id=${service_category_id}&search_tag=${search_tag}`            
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            
            const response=await axios.get(bundle_url,config)
            const {bundles}=response.data.data
            const total_items=response.data.payload.pagination.total_items
            const per_page=response.data.payload.pagination.per_page 
            const current_page=response.data.payload.pagination.current_page
            const total_pages=response.data.payload.pagination.total_pages
            //console.log(response)
            
            dispatch({type:BUNDLE_LIST_SUCCESS,payload:{bundles,total_items,per_page,current_page,total_pages}})
        }catch(error){
            dispatch({type:BUNDLE_LIST_FAIL,payload:error.message})
        }
    }
}



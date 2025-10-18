import axios from "axios";

import { 
    COUNTRY_LIST_REQUEST, 
    COUNTRY_LIST_SUCCESS, 
    COUNTRY_LIST_FAIL,
    DISTRICT_LIST_REQUEST,
    DISTRICT_LIST_SUCCESS,
    DISTRICT_LIST_FAIL,
    PROVINCE_LIST_REQUEST,
    PROVINCE_LIST_SUCCESS,
    PROVINCE_LIST_FAIL,
    LANGUAGE_LIST_REQUEST,
    LANGUAGE_LIST_SUCCESS,
    LANGUAGE_LIST_FAIL,
    HAWALA_CURRENCY_LIST_REQUEST,
    HAWALA_CURRENCY_LIST_SUCCESS,
    HAWALA_CURRENCY_LIST_FAIL,
    HAWALA_BRANCH_LIST_REQUEST,
    HAWALA_BRANCH_LIST_SUCCESS,
    HAWALA_BRANCH_LIST_FAIL,
    HELP_ARTICLE_LIST_REQUEST,
    HELP_ARTICLE_LIST_SUCCESS,
    HELP_ARTICLE_LIST_FAIL,
    PAYMENT_METHOD_LIST_REQUEST,
    PAYMENT_METHOD_LIST_SUCCESS,
    PAYMENT_METHOD_LIST_FAIL,
    PAYMENT_TYPE_LIST_REQUEST,
    PAYMENT_TYPE_LIST_SUCCESS,
    PAYMENT_TYPE_LIST_FAIL,
    CURRENCIES_LIST_REQUEST,
    CURRENCIES_LIST_SUCCESS,
    CURRENCIES_LIST_FAIL
} from "../constants/locationConstant";
import { base_url } from "../../utils/const";

export const getCountries=()=>{
    return async (dispatch)=>{
        
        dispatch({type:COUNTRY_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const countries_url=`${base_url}/countries`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(countries_url,config)
            const {countries}=response.data.data
            
            //console.log(countries)
            dispatch({type:COUNTRY_LIST_SUCCESS,payload:{countries}})
        }catch(error){
            dispatch({type:COUNTRY_LIST_FAIL,payload:error.message})
        }
    }
}


export const getDistricts=()=>{
    return async (dispatch)=>{
        
        dispatch({type:DISTRICT_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const districts_url=`${base_url}/districts`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(districts_url,config)
            const {districts}=response.data.data
            
            //console.log(districts)
            dispatch({type:DISTRICT_LIST_SUCCESS,payload:{districts}})
        }catch(error){
            dispatch({type:DISTRICT_LIST_FAIL,payload:error.message})
        }
    }
}


export const getProvinces=()=>{
    return async (dispatch)=>{
        
        dispatch({type:PROVINCE_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const provinces_url=`${base_url}/provinces`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(provinces_url,config)
            const {provinces}=response.data.data
            
            //console.log(provinces)
            dispatch({type:PROVINCE_LIST_SUCCESS,payload:{provinces}})
        }catch(error){
            dispatch({type:PROVINCE_LIST_FAIL,payload:error.message})
        }
    }
}


export const getLanguages=()=>{
    return async (dispatch)=>{
        
        dispatch({type:LANGUAGE_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const language_url=`${base_url}/languages`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(language_url,config)
            const {languages}=response.data.data
            
            //console.log(countries)
            dispatch({type:LANGUAGE_LIST_SUCCESS,payload:{languages}})
        }catch(error){
            dispatch({type:LANGUAGE_LIST_FAIL,payload:error.message})
        }
    }
}



export const getHawalaCurrencies=()=>{
    return async (dispatch)=>{
        
        dispatch({type:HAWALA_CURRENCY_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const hawala_currencies_url=`${base_url}/hawala-currency`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(hawala_currencies_url,config)
            const {rates}=response.data.data
            
            //console.log(countries)
            dispatch({type:HAWALA_CURRENCY_LIST_SUCCESS,payload:{rates}})
        }catch(error){
            dispatch({type:HAWALA_CURRENCY_LIST_FAIL,payload:error.message})
        }
    }
}


export const getHawalaBranches=()=>{
    return async (dispatch)=>{
        
        dispatch({type:HAWALA_BRANCH_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const hawala_branches_url=`${base_url}/hawala-branches`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(hawala_branches_url,config)
            const {hawalabranches}=response.data.data
            
            //console.log(countries)
            dispatch({type:HAWALA_BRANCH_LIST_SUCCESS,payload:{hawalabranches}})
        }catch(error){
            dispatch({type:HAWALA_BRANCH_LIST_FAIL,payload:error.message})
        }
    }
}



export const getHelpArticles=()=>{
    return async (dispatch)=>{
        
        dispatch({type:HELP_ARTICLE_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const url=`${base_url}/help-articles`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(url,config)
            const {articles}=response.data.data
            
            //console.log(countries)
            dispatch({type:HELP_ARTICLE_LIST_SUCCESS,payload:{articles}})
        }catch(error){
            dispatch({type:HELP_ARTICLE_LIST_FAIL,payload:error.message})
        }
    }
}


export const getPaymentMethods=()=>{
    return async (dispatch)=>{
        
        dispatch({type:PAYMENT_METHOD_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const url=`${base_url}/payment-methods`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(url,config)
            const {payment_methods}=response.data.data
            
            //console.log(countries)
            dispatch({type:PAYMENT_METHOD_LIST_SUCCESS,payload:{payment_methods}})
        }catch(error){
            dispatch({type:PAYMENT_METHOD_LIST_FAIL,payload:error.message})
        }
    }
}


export const getPaymentTypes=()=>{
    return async (dispatch)=>{
        
        dispatch({type:PAYMENT_TYPE_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const url=`${base_url}/payment-types`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(url,config)
            const {payment_types}=response.data.data
            
            //console.log(countries)
            dispatch({type:PAYMENT_TYPE_LIST_SUCCESS,payload:{payment_types}})
        }catch(error){
            dispatch({type:PAYMENT_TYPE_LIST_FAIL,payload:error.message})
        }
    }
}


export const getCurrencies=()=>{
    return async (dispatch)=>{
        
        dispatch({type:CURRENCIES_LIST_REQUEST})
        try{
            const token = localStorage.getItem('token');
            const url=`${base_url}/currency`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const response=await axios.get(url,config)
            const {currencies}=response.data.data
            
            //console.log(countries)
            dispatch({type:CURRENCIES_LIST_SUCCESS,payload:{currencies}})
        }catch(error){
            dispatch({type:CURRENCIES_LIST_FAIL,payload:error.message})
        }
    }
}
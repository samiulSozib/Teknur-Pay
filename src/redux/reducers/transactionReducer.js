import { 
    TRANSACTION_LIST_REQUEST, 
    TRANSACTION_LIST_SUCCESS, 
    TRANSACTION_LIST_FAIL } from "../constants/transactionConstant";


const initialState={
    transactionList:[],
    error:null ,
    loading:false,
    total_items:0,
    per_page:0,
    current_page:0,
    total_pages:0
    
}

const transactionListReducer=(state=initialState,action)=>{

    switch(action.type){
        case TRANSACTION_LIST_REQUEST:
            return {...state,loading:true}
        case TRANSACTION_LIST_SUCCESS:
            return {...state,loading:false,
                transactionList:action.payload.reseller_balance_transactions,
                total_items:action.payload.total_items,
                per_page:action.payload.per_page,
                current_page:action.payload.current_page,
                total_pages:action.payload.total_pages
            }
        case TRANSACTION_LIST_FAIL:
            return {...state,loading:false,error:action.payload}
        default:
            return state
    }
}

export default transactionListReducer
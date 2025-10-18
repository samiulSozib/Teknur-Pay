import { 
    BUNDLE_LIST_REQUEST, 
    BUNDLE_LIST_SUCCESS, 
    BUNDLE_LIST_FAIL } from "../constants/bundleConstant";


const initialState={
    bundleList:[],
    error:null ,
    loading:false,
    total_items:0,
    per_page:0,
    current_page:0,
    total_pages:0
}

const bundleListReducer=(state=initialState,action)=>{

    switch(action.type){
        case BUNDLE_LIST_REQUEST:
            return {...state,loading:true}
        case BUNDLE_LIST_SUCCESS:
            return {...state,loading:false,
                bundleList:action.payload.bundles,
                total_items:action.payload.total_items,
                per_page:action.payload.per_page,
                current_page:action.payload.current_page,
                total_pages:action.payload.total_pages
            }
        case BUNDLE_LIST_FAIL:
            return {...state,loading:false,error:action.payload}
        default:
            return state
    }
}

export default bundleListReducer
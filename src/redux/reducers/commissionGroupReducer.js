import {
  COMMISSION_GROUP_LIST_REQUEST,
  COMMISSION_GROUP_LIST_SUCCESS,
  COMMISSION_GROUP_LIST_FAIL,
  ADD_COMMISSION_GROUP_REQUEST,
  ADD_COMMISSION_GROUP_SUCCESS,
  ADD_COMMISSION_GROUP_FAIL,
} from "../constants/commissionGroupConstant";

const initialState = {
  commissionGroupList: [],
  loading: false,
  error: null,
  message: null,
  
};

const commissionGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case COMMISSION_GROUP_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case COMMISSION_GROUP_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        commissionGroupList: action.payload,
        
      };

    case COMMISSION_GROUP_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_COMMISSION_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_COMMISSION_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        commissionGroupList: [...state.commissionGroupList, action.payload.group],
        message: action.payload.message,
      };

    case ADD_COMMISSION_GROUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default commissionGroupReducer;

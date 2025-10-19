import { ADD_TRANSFER_COMMISSION_FAIL, ADD_TRANSFER_COMMISSION_REQUEST, ADD_TRANSFER_COMMISSION_SUCCESS, TRANSFER_COMMISSION_LIST_FAIL, TRANSFER_COMMISSION_LIST_REQUEST, TRANSFER_COMMISSION_LIST_SUCCESS } from "../constants/transferCommissionConstant";


const initialState = {
  transferCommissionList: [],
  loading: false,
  error: null,
  message: null,
  
};

const transferCommissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANSFER_COMMISSION_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TRANSFER_COMMISSION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
          transferCommissionList: action.payload,
        
      };

    case TRANSFER_COMMISSION_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_TRANSFER_COMMISSION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_TRANSFER_COMMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        transferCommissionList: [...state.transferCommissionList],
        message: action.payload.message,
      };

    case ADD_TRANSFER_COMMISSION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default transferCommissionReducer;

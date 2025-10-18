import { ADD_RESELLER_PAYMENT_FAIL, ADD_RESELLER_PAYMENT_REQUEST, ADD_RESELLER_PAYMENT_SUCCESS, RESELLER_PAYMENT_LIST_FAIL, RESELLER_PAYMENT_LIST_REQUEST, RESELLER_PAYMENT_LIST_SUCCESS } from "../constants/reseller_payment";


const initialState = {
  resellerPayments: [],
  loading: false,
  error: null,
  message: null,
  
};

const resellerPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESELLER_PAYMENT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case RESELLER_PAYMENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        resellerPayments: action.payload,
        
      };

    case RESELLER_PAYMENT_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_RESELLER_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_RESELLER_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        resellerPayments: [...state.resellerPayments, action.payload.payment],
        message: action.payload.message,
      };

    case ADD_RESELLER_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default resellerPaymentReducer;

import {
  SELLING_PRICE_LIST_REQUEST,
  SELLING_PRICE_LIST_SUCCESS,
  SELLING_PRICE_LIST_FAIL,
  ADD_SELLING_PRICE_REQUEST,
  ADD_SELLING_PRICE_SUCCESS,
  ADD_SELLING_PRICE_FAIL,
} from "../constants/sellingPriceConstant";

const initialState = {
  sellingPriceList: [],
  loading: false,
  error: null,
  message: null,
  
};

const sellingPriceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELLING_PRICE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SELLING_PRICE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        sellingPriceList: action.payload,
        
      };

    case SELLING_PRICE_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_SELLING_PRICE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_SELLING_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        sellingPriceList: [...state.sellingPriceList, action.payload.pricing],
        message: action.payload.message,
      };

    case ADD_SELLING_PRICE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default sellingPriceReducer;

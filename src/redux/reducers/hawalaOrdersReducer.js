import {
  ADD_HAWALA_ORDER_FAIL,
  ADD_HAWALA_ORDER_REQUEST,
  ADD_HAWALA_ORDER_SUCCESS,
  HAWALA_ORDER_LIST_FAIL,
  HAWALA_ORDER_LIST_REQUEST,
  HAWALA_ORDER_LIST_SUCCESS,
} from "../constants/hawalaOrderConstant";

const initialState = {
  orderList: [],
  loading: false,
  error: null,
  message: null,
  total_items: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
};

const hawalaOrdersReducer = (state = initialState, action) => {
  switch (action.type) {
    case HAWALA_ORDER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case HAWALA_ORDER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        orderList: action.payload.orders,
        total_items: action.payload.total_items,
        per_page: action.payload.per_page,
        current_page: action.payload.current_page,
        total_pages: action.payload.total_pages,
      };

    case HAWALA_ORDER_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_HAWALA_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_HAWALA_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orderList: [...state.orderList, action.payload.hawala_order],
        message: action.payload.message,
      };

    case ADD_HAWALA_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default hawalaOrdersReducer;

import {
  LOAN_REQUEST_LIST_REQUEST,
  LOAN_REQUEST_LIST_SUCCESS,
  LOAN_REQUEST_LIST_FAIL,
  ADD_LOAN_REQUEST_REQUEST,
  ADD_LOAN_REQUEST_SUCCESS,
  ADD_LOAN_REQUEST_FAIL,
} from "../constants/loanRequestConstant";

const initialState = {
  loanRequestList: [],
  loading: false,
  error: null,
  message: null,
  total_items: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
};

const loanRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    // 📥 Fetch all loan requests (with pagination)
    case LOAN_REQUEST_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOAN_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loanRequestList: action.payload.balances,
        total_items: action.payload.total_items,
        per_page: action.payload.par_page, // matches your payload key
        current_page: action.payload.current_page,
        total_pages: action.payload.total_pages,
      };

    case LOAN_REQUEST_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ➕ Add new loan request
    case ADD_LOAN_REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_LOAN_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        loanRequestList: [action.payload.balance, ...state.loanRequestList],
        message: action.payload.message,
      };

    case ADD_LOAN_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default loanRequestReducer;

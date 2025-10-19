import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { base_url } from "../../utils/const";
import { ADD_LOAN_REQUEST_FAIL, ADD_LOAN_REQUEST_REQUEST, ADD_LOAN_REQUEST_SUCCESS, LOAN_REQUEST_LIST_FAIL, LOAN_REQUEST_LIST_REQUEST, LOAN_REQUEST_LIST_SUCCESS } from "../constants/loanRequestConstant";


export const getLoanRequests = (page = 1, items_per_page = 10) => {
  return async (dispatch) => {
    dispatch({ type: LOAN_REQUEST_LIST_REQUEST });
    try {
      const token = localStorage.getItem("token");

      // ✅ Clean URL (removed space after page)
      const loan_request_url = `${base_url}/reseller-balances?page=${page}&items_per_page=${items_per_page}`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(loan_request_url, config);

      const balances = response.data?.data?.balances;

      // ✅ Extract data & pagination info
      const payload = {
        balances: balances?.data || [],
        current_page: balances?.current_page || 1,
        total_pages: balances?.last_page || 1,
        total_items: balances?.total || 0,
        par_page: balances?.per_page || items_per_page,
      };

      dispatch({ type: LOAN_REQUEST_LIST_SUCCESS, payload });
    } catch (error) {
      dispatch({
        type: LOAN_REQUEST_LIST_FAIL,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to load loan requests",
      });
    }
  };
};

export const addLoanRequest = (balance_amount) => {
  return async (dispatch) => {
    dispatch({ type: ADD_LOAN_REQUEST_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const loan_request_url = `${base_url}/reseller-balances/request-loan?balance_amount=${balance_amount}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(loan_request_url, config);
      const { balance } = response.data.data;
      const message = response.data.message;

      dispatch({
        type: ADD_LOAN_REQUEST_SUCCESS,
        payload: { balance, message },
      });
      
      return { success: true, message };
      
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      
      dispatch({ type: ADD_LOAN_REQUEST_FAIL, payload: errorMessage });
      
      // Return error instead of throwing
      return { success: false, error: errorMessage };
    }
  };
};

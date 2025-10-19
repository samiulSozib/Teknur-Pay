import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { base_url } from "../../utils/const";
import { ADD_TRANSFER_COMMISSION_FAIL, ADD_TRANSFER_COMMISSION_REQUEST, ADD_TRANSFER_COMMISSION_SUCCESS, TRANSFER_COMMISSION_LIST_FAIL, TRANSFER_COMMISSION_LIST_REQUEST, TRANSFER_COMMISSION_LIST_SUCCESS } from "../constants/transferCommissionConstant";


export const getTransferCommissions = (page = 1, items_per_page = 10) => {
  return async (dispatch) => {
    dispatch({ type: TRANSFER_COMMISSION_LIST_REQUEST });
    try {
      const token = localStorage.getItem("token");

      // ✅ Clean URL (removed space after page)
      const loan_request_url = `${base_url}/earning-transfer?page=${page}&items_per_page=${items_per_page}`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(loan_request_url, config);
      console.log(response)
      const {requests} = response.data?.data;

      dispatch({ type: TRANSFER_COMMISSION_LIST_SUCCESS, payload:requests });
    } catch (error) {
      dispatch({
        type: TRANSFER_COMMISSION_LIST_FAIL,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to load loan requests",
      });
    }
  };
};

export const addTransferCommission = (amount) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TRANSFER_COMMISSION_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const loan_request_url = `${base_url}/earning-transfer`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("amount", amount);

      const response = await axios.post(loan_request_url,formData, config);
      //const { request } = response.data.data;
      const message = response.data.message;

      dispatch({
        type: ADD_TRANSFER_COMMISSION_SUCCESS,
        payload: { message },
      });
      
      return { success: true, message };
      
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      
      dispatch({ type: ADD_TRANSFER_COMMISSION_FAIL, payload: errorMessage });
      
      // Return error instead of throwing
      return { success: false, error: errorMessage };
    }
  };
};

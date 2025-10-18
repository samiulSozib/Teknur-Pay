import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { base_url } from "../../utils/const";
import {
  ADD_RESELLER_PAYMENT_FAIL,
  ADD_RESELLER_PAYMENT_REQUEST,
  ADD_RESELLER_PAYMENT_SUCCESS,
  RESELLER_PAYMENT_LIST_FAIL,
  RESELLER_PAYMENT_LIST_REQUEST,
  RESELLER_PAYMENT_LIST_SUCCESS,
} from "../constants/reseller_payment";

export const getResellerPayments = () => {
  return async (dispatch) => {
    dispatch({ type: RESELLER_PAYMENT_LIST_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const selling_price_url = `${base_url}/reseller-payments`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(selling_price_url, config);
      //console.log(response)
      const { payments } = response.data.data;

      //console.log(payments)
      dispatch({ type: RESELLER_PAYMENT_LIST_SUCCESS, payload: payments });
    } catch (error) {
      dispatch({ type: RESELLER_PAYMENT_LIST_FAIL, payload: error.message });
    }
  };
};

export const addResellerPayments = (paymentData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_RESELLER_PAYMENT_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const selling_price_url = `${base_url}/reseller-payments`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("payment_method_id", paymentData.payment_method_id);
      formData.append("amount", paymentData.amount);
      formData.append("currency_id", paymentData.currency_id);
      formData.append("payment_date", paymentData.payment_date);
      formData.append("tracking_code", paymentData.tracking_code);
      formData.append("notes", paymentData.notes);
      formData.append("payment_type_id", paymentData.payment_type_id);
      // Only append payment_image if it exists
      if (paymentData.payment_image) {
        formData.append("payment_image", paymentData.payment_image);
      }

      // Only append extra images if they exist
      if (paymentData.extra_image_1) {
        formData.append("extra_image_1", paymentData.extra_image_1);
      }

      if (paymentData.extra_image_2) {
        formData.append("extra_image_2", paymentData.extra_image_2);
      }

      const response = await axios.post(selling_price_url, formData, config);

      if (response.data.success) {
        const { payment } = response.data.data;
        const message = response.data.message;

        dispatch({
          type: ADD_RESELLER_PAYMENT_SUCCESS,
          payload: { payment, message },
        });

        return { success: true, payment, message };
      } else {
        throw new Error(response.data.message || "Failed to add payment");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add payment";

      dispatch({
        type: ADD_RESELLER_PAYMENT_FAIL,
        payload: errorMessage,
      });

      return { error: errorMessage };
    }
  };
};

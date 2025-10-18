import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { base_url } from "../../utils/const";
import {
  ADD_SELLING_PRICE_FAIL,
  ADD_SELLING_PRICE_REQUEST,
  ADD_SELLING_PRICE_SUCCESS,
  SELLING_PRICE_LIST_FAIL,
  SELLING_PRICE_LIST_REQUEST,
  SELLING_PRICE_LIST_SUCCESS,
} from "../constants/sellingPriceConstant";

export const getSellingPrices = (page, items_per_page) => {
  return async (dispatch) => {
    dispatch({ type: SELLING_PRICE_LIST_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const selling_price_url = `${base_url}/reseller-customer-pricing? page=${page} & items_per_page=${items_per_page}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(selling_price_url, config);
      //console.log(response)
      const { pricings } = response.data.data;

      //console.log(pricings)
      dispatch({ type: SELLING_PRICE_LIST_SUCCESS, payload: pricings });
    } catch (error) {
      dispatch({ type: SELLING_PRICE_LIST_FAIL, payload: error.message });
    }
  };
};

export const addSellingPrice = (sellingData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_SELLING_PRICE_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const selling_price_url = `${base_url}/reseller-customer-pricing`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("service_id", sellingData.service);
      formData.append("commission_type", sellingData.commissionType);
      formData.append("amount", sellingData.amount);
      const response = await axios.post(selling_price_url, formData, config);
      const { pricing } = response.data.data;
      const message = response.data.message;
      //console.log(response);

      //console.log(message)
      dispatch({
        type: ADD_SELLING_PRICE_SUCCESS,
        payload: { pricing, message },
      });
      //toast.success("Sub Reseller Add Success")
    } catch (error) {
      //console.log(error);
      const errorMessage = error.response.data.message;
      //toast.error(errorMessage)
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
      dispatch({ type: ADD_SELLING_PRICE_FAIL, payload: errorMessage });
    }
  };
};

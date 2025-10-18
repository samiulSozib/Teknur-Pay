import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { base_url } from "../../utils/const";
import {
  ADD_HAWALA_ORDER_FAIL,
  ADD_HAWALA_ORDER_REQUEST,
  ADD_HAWALA_ORDER_SUCCESS,
  HAWALA_ORDER_LIST_FAIL,
  HAWALA_ORDER_LIST_REQUEST,
  HAWALA_ORDER_LIST_SUCCESS,
} from "../constants/hawalaOrderConstant";

export const getHawalaOrders = (
  page,
  items_per_page,
  filterStatus,
  order_type
) => {
  return async (dispatch) => {
    dispatch({ type: HAWALA_ORDER_LIST_REQUEST });
    try {
      const token = localStorage.getItem("token");
      //const orders_url = `${base_url}/hawala-orders?page=${page}&items_per_page=${items_per_page}`;
      const orders_url =
        `${base_url}/hawala-orders?page=${page}&items_per_page=${items_per_page}` +
        (filterStatus ? `&order_status=${filterStatus}` : "") +
        (order_type ? `&order_type=${order_type}` : ``);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(orders_url, config);

      // Debugging: Log the full response to verify structure
      //console.log('API Response:', response.data);

      // Make sure these paths match your actual API response structure
      const orders = response.data.data?.orders || [];
      const pagination = response.data.data?.pagination || {
        total_items: 0,
        per_page: items_per_page,
        current_page: page,
        total_pages: 0,
      };

      dispatch({
        type: HAWALA_ORDER_LIST_SUCCESS,
        payload: {
          orders,
          total_items: pagination.total_items,
          per_page: pagination.per_page,
          current_page: pagination.current_page,
          total_pages: pagination.total_pages,
        },
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch hawala orders";
      dispatch({ type: HAWALA_ORDER_LIST_FAIL, payload: errorMessage });
      toast.error(errorMessage);
    }
  };
};

export const addHawalaOrder = (data) => {
  return async (dispatch) => {
    dispatch({ type: ADD_HAWALA_ORDER_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const hawala_order_url = `${base_url}/hawala-orders`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      
      formData.append("sender_name", data.senderName);
      formData.append("receiver_name", data.receiverName);
      formData.append("hawala_amount", data.hawalaAmount);
      formData.append("hawala_amount_currency_id", data.currencyCodeId);
      const isSender = data.commission_paid_by_sender === "sender";

      formData.append("commission_paid_by_sender", isSender ? 1 : 0);
      formData.append("commission_paid_by_receiver", isSender ? 0 : 1);
      formData.append("receiver_id_card_number", data.receiverIdCardNumber);
      formData.append("receiver_father_name", data.receiverFatherName);
      formData.append("hawala_branch_id", data.branchId);

      const response = await axios.post(hawala_order_url, formData, config);
      const { hawala_order } = response.data.data;
      const message = response.data.message;
      //console.log(response);

      //console.log(message)
      dispatch({
        type: ADD_HAWALA_ORDER_SUCCESS,
        payload: { hawala_order, message },
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
      dispatch({ type: ADD_HAWALA_ORDER_FAIL, payload: errorMessage });
    }
  };
};

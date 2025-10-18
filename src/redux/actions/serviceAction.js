import axios from "axios";

import { 
    SERVICE_LIST_REQUEST, 
    SERVICE_LIST_SUCCESS, 
    SERVICE_LIST_FAIL } from "../constants/serviceConstant";
import { base_url } from "../../utils/const";




export const getServices = (service_category_id, country_id) => {
  return async (dispatch) => {
    dispatch({ type: SERVICE_LIST_REQUEST });

    try {
      const token = localStorage.getItem("token");

      // Base URL
      let services_url = `${base_url}/services`;

      // Add query params only if provided
      const params = [];
      if (service_category_id) {
        params.push(`service_category_id=${service_category_id}`);
      }
      if (country_id) {
        params.push(`country_id=${country_id}`);
      }
      if (params.length > 0) {
        services_url += "?" + params.join("&");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(services_url, config);
      const { services } = response.data.data;

      dispatch({ type: SERVICE_LIST_SUCCESS, payload: { services } });
    } catch (error) {
      dispatch({
        type: SERVICE_LIST_FAIL,
        payload: error?.response?.data?.message || error.message,
      });
    }
  };
};




import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  addSellingPrice,
  getSellingPrices,
} from "../../redux/actions/sellingPriceAction";
import { Edit } from "../../icons";
import { getServices } from "../../redux/actions/serviceAction";
import { serviceCategories } from "../../redux/actions/serviceCategoriesAction";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  addResellerPayments,
  getResellerPayments,
} from "../../redux/actions/resellerPaymentAction";
import {
  getCurrencies,
  getPaymentMethods,
  getPaymentTypes,
} from "../../redux/actions/locationAction";

export const ResellerPayment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    payment_method_id: "",
    amount: "",
    currency_id: "",
    payment_date: new Date().toISOString().split("T")[0], // Default to today's date
    tracking_code: "",
    notes: "",
    payment_type_id: "",
    payment_image: null,
    extra_image_1: null,
    extra_image_2: null,
  });

  // State for image previews
  const [imagePreviews, setImagePreviews] = useState({
    payment_image: null,
    extra_image_1: null,
    extra_image_2: null,
  });

  useEffect(() => {
    dispatch(getResellerPayments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPaymentMethods());
    dispatch(getCurrencies());
    dispatch(getPaymentTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(serviceCategories());
  }, [dispatch]);

  const { resellerPayments } = useSelector(
    (state) => state.resellerPaymentReducer
  );
  const { payment_methods, currencies, payment_types } = useSelector(
    (state) => state.locationReducer
  );

  const breadcrumbPaths = [
    { label: t("MENU.RESELLER_PAYMENTS"), href: "/reseller-payments" },
  ];

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData({
      payment_method_id: "",
      amount: "",
      currency_id: "",
      payment_date: new Date().toISOString().split("T")[0],
      tracking_code: "",
      notes: "",
      payment_type_id: "",
      payment_image: null,
      extra_image_1: null,
      extra_image_2: null,
    });
    setImagePreviews({
      payment_image: null,
      extra_image_1: null,
      extra_image_2: null,
    });
  };

  const handleClickOpenDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPayment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => ({
          ...prev,
          [field]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);
      const result = await dispatch(addResellerPayments(formData));

      // Check if the result contains an error
      if (result?.error) {
        throw new Error(result.error);
      }

      // Only show success if we have a success response
      if (result?.success) {
        Swal.fire({
          title: t("SUCCESS"),
          text: t("PAYMENT_REQUEST_ADDED_SUCCESSFULLY"),
          icon: "success",
          confirmButtonColor: "#10b981",
        });

        handleCloseDialog();
      }
    } catch (error) {
      Swal.fire({
        title: t("ERROR"),
        text: error?.message || t("FAILED_TO_ADD_PAYMENT_REQUEST"),
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleShare = async () => {
    if (modalRef.current) {
      try {
        const canvas = await html2canvas(modalRef.current);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "order_details.png", {
              type: "image/png",
            });
            const data = {
              files: [file],
              title: "Order Details",
              text: "Check out this order details!",
            };
            if (navigator.canShare && navigator.canShare(data)) {
              navigator.share(data).catch((error) => {
                console.error("Sharing failed:", error);
                alert("Sharing failed. Please try again.");
              });
            } else {
              alert("Sharing is not supported in this browser.");
            }
          }
        });
      } catch (error) {
        console.error("Error capturing modal content:", error);
        alert("Failed to capture modal content. Please try again.");
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-1">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenDialog}
              style={{ borderRadius: "50px" }}
              className="h-11 w-36 bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
            >
              {t("ADD_PAYMENT")}
            </button>
          </div>
        </div>
      </div>

      {/* reseller payment List */}
      <div className="border rounded-md bg-[#EEF4FF] col-span-12 space-y-6 xl:col-span-12 p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {resellerPayments.map((payment) => (
            <div
              key={payment.id}
              onClick={() => handleClickOpenDetails(payment)}
              className="cursor-pointer col-span-1 mb-1 border border-blue-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="bg-white rounded-lg p-1 flex justify-between items-center gap-1">
                {/* Left side - Company logo and details */}
                <div className="flex items-center gap-4 flex-grow">
                  {/* Company logo with better styling */}
                  {/* <div className="flex-shrink-0">
                    <img
                      className="w-12 h-12 rounded-lg object-contain border border-gray-200 p-1"
                      src={payment.payment_image_url}
                      alt=""
                    />
                  </div> */}

                  {/* Details container with better spacing */}
                  <div className="border border-gray-200 rounded-md p-2 flex-grow">
                    <div className="grid gap-2">
                      {/* Commission type row */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">
                          {t("PAYMENT_METHOD")}
                        </span>
                        <p className="text-sm font-semibold text-blue-600">
                          {payment?.payment_method?.method_name}
                        </p>
                      </div>

                      {/* Amount row */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">
                          {t("AMOUNT")}
                        </span>
                        <p className="text-sm font-medium text-gray-700">
                          {payment.amount} {payment?.currency?.code}
                        </p>
                      </div>

                      {/* status row */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">
                          {t("STATUS")}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md ${
                            payment.status?.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : payment.status?.toLowerCase() === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status?.toLowerCase() === "failed"
                              ? "bg-red-100 text-red-800"
                              : payment.status?.toLowerCase() === "rollbacked"
                              ? "bg-purple-100 text-purple-800"
                              : payment.status?.toLowerCase() === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                      {/* performed by row */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">
                          {t("PERFORMED_BY")}
                        </span>
                        <p className="text-sm font-medium text-gray-700">
                          {payment.performed_by_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Action buttons */}
                {/* <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedSubReseller(payment);
                      setIsEditing(true);
                    }}
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                    aria-label="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add payment Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] text-left max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{t("ADD_PAYMENT")}</h2>

            <div className="rounded-md border border-gray-300 p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Payment Method Dropdown */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("PAYMENT_METHOD")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="payment_method_id"
                      value={formData.payment_method_id}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">{t("SELECT_PAYMENT_METHOD")}</option>
                      {payment_methods.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.method_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount Input */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("AMOUNT")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("ENTER_AMOUNT")}
                      required
                    />
                  </div>

                  {/* Currency Dropdown */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("CURRENCY")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="currency_id"
                      value={formData.currency_id}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">{t("SELECT_CURRENCY")}</option>
                      {currencies.map((currency) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Date */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("PAYMENT_DATE")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="payment_date"
                        value={formData.payment_date}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Payment Image */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("PAYMENT_IMAGE")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1">
                        <div className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 truncate">
                              {formData.payment_image
                                ? formData.payment_image.name
                                : t("CHOOSE_FILE")}
                            </span>
                            <svg
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                        </div>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "payment_image")}
                          className="hidden"
                          accept="image/*"
                          required={!imagePreviews.payment_image}
                        />
                      </label>
                      {imagePreviews.payment_image && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              payment_image: null,
                            }));
                            setImagePreviews((prev) => ({
                              ...prev,
                              payment_image: null,
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    {imagePreviews.payment_image && (
                      <div className="mt-2">
                        <img
                          src={imagePreviews.payment_image}
                          alt="Payment preview"
                          className="h-20 w-20 object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Tracking Code */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("TRACKING_CODE")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tracking_code"
                      value={formData.tracking_code}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("ENTER_TRACKING_CODE")}
                      required
                    />
                  </div>

                  {/* Payment Type */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("PAYMENT_TYPE")}
                    </label>
                    <select
                      name="payment_type_id"
                      value={formData.payment_type_id}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t("SELECT_PAYMENT_TYPE")}</option>
                      {payment_types.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col w-full">
                    <label className="text-gray-600 text-sm mb-1 font-medium">
                      {t("NOTES")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder={t("ENTER_NOTES")}
                      required
                    />
                  </div>

                  {/* Extra Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Extra Image 1 */}
                    <div className="flex flex-col w-full">
                      <label className="text-gray-600 text-sm mb-1 font-medium">
                        {t("EXTRA_IMAGE_1")}
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1">
                          <div className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 truncate">
                                {formData.extra_image_1
                                  ? formData.extra_image_1.name
                                  : t("CHOOSE_FILE")}
                              </span>
                              <svg
                                className="w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                          </div>
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFileChange(e, "extra_image_1")
                            }
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                        {imagePreviews.extra_image_1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                extra_image_1: null,
                              }));
                              setImagePreviews((prev) => ({
                                ...prev,
                                extra_image_1: null,
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      {imagePreviews.extra_image_1 && (
                        <div className="mt-2">
                          <img
                            src={imagePreviews.extra_image_1}
                            alt="Extra image 1 preview"
                            className="h-20 w-20 object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      )}
                    </div>

                    {/* Extra Image 2 */}
                    <div className="flex flex-col w-full">
                      <label className="text-gray-600 text-sm mb-1 font-medium">
                        {t("EXTRA_IMAGE_2")}
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1">
                          <div className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 truncate">
                                {formData.extra_image_2
                                  ? formData.extra_image_2.name
                                  : t("CHOOSE_FILE")}
                              </span>
                              <svg
                                className="w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                          </div>
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFileChange(e, "extra_image_2")
                            }
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                        {imagePreviews.extra_image_2 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                extra_image_2: null,
                              }));
                              setImagePreviews((prev) => ({
                                ...prev,
                                extra_image_2: null,
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      {imagePreviews.extra_image_2 && (
                        <div className="mt-2">
                          <img
                            src={imagePreviews.extra_image_2}
                            alt="Extra image 2 preview"
                            className="h-20 w-20 object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-[50px] hover:bg-gray-100 transition"
                >
                  {t("CANCEL")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !formData.payment_method_id ||
                    !formData.amount ||
                    !formData.currency_id ||
                    !formData.payment_date ||
                    !formData.tracking_code ||
                    !formData.notes ||
                    !formData.payment_image
                  }
                  className="px-4 py-2 text-white font-medium bg-green-500 rounded-[50px] hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {t("SAVE")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* show details */}
      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-80 text-left m-2">
            <div
              ref={modalRef}
              className={`border ${
                selectedPayment.status === "failed"
                  ? "border-red-500"
                  : selectedPayment.status === "completed"
                  ? "border-green-500"
                  : "border-yellow-500"
              } rounded-md flex flex-col gap-3`}
            >
              {/* Status Image */}
              <div className="flex items-center justify-center mt-3">
                <img
                  src={
                    selectedPayment.status === "pending"
                      ? "/images/img/Pending.png"
                      : selectedPayment.status === "completed"
                      ? "/images/img/Success.png"
                      : "/images/img/Unsuccess.png"
                  }
                  alt=""
                  className="w-[70px] h-[70px] object-contain"
                />
              </div>

              {/* Payment Images Preview */}
              {(selectedPayment.payment_image_url ||
                selectedPayment.extra_image_1_url ||
                selectedPayment.extra_image_2_url) && (
                <div className="flex flex-wrap justify-center gap-2 p-2">
                  {selectedPayment.payment_image_url && (
                    <div
                      className="relative cursor-pointer"
                      onClick={() =>
                        window.open(selectedPayment.payment_image_url, "_blank")
                      }
                    >
                      <img
                        src={selectedPayment.payment_image_url}
                        alt="Payment"
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-30 transition-opacity">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v4h4v-4h-4z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  {selectedPayment.extra_image_1_url && (
                    <div
                      className="relative cursor-pointer"
                      onClick={() =>
                        window.open(selectedPayment.extra_image_1_url, "_blank")
                      }
                    >
                      <img
                        src={selectedPayment.extra_image_1_url}
                        alt="Extra 1"
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-30 transition-opacity">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v4h4v-4h-4z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  {selectedPayment.extra_image_2_url && (
                    <div
                      className="relative cursor-pointer"
                      onClick={() =>
                        window.open(selectedPayment.extra_image_2_url, "_blank")
                      }
                    >
                      <img
                        src={selectedPayment.extra_image_2_url}
                        alt="Extra 2"
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-30 transition-opacity">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v4h4v-4h-4z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 p-2">
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("PAYMENT_METHOD")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedPayment.payment_method?.method_name || "-"}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">{t("AMOUNT")}</span>
                  <span className="text-black text-sm">
                    {selectedPayment.amount}{" "}
                    {selectedPayment.currency?.code || "-"}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("PERFORMED_BY")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedPayment.performed_by_name}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">{t("NOTES")}</span>
                  <span className="text-black text-sm">
                    {selectedPayment.notes || "-"}
                  </span>
                </div>
              </div>

              <div
                className={`${
                  selectedPayment.status === "failed"
                    ? "bg-red-100 border-red-500"
                    : selectedPayment.status === "completed"
                    ? "bg-green-100 border-green-500"
                    : "bg-yellow-100 border-yellow-500"
                } border rounded-lg p-3 flex items-center m-3`}
              >
                {/* Date & Time Section */}
                <div className="flex flex-col ml-3 w-full">
                  <div className="flex items-center justify-between w-full text-gray-600 text-sm">
                    <span className="font-medium">{t("DATE")}</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(
                        selectedPayment?.payment_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-3 justify-between items-center py-2">
              {/* Optional buttons can be added here */}
            </div>

            <div className="flex flex-row justify-center">
              <button
                onClick={handleCloseDetails}
                className="border-2 border-gray-500 w-full rounded-[50px] py-2 text-black font-bold"
              >
                {t("CLOSE")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

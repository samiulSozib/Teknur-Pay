import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/actions/orderAction";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import html2canvas from "html2canvas";
import { addHawalaOrder, getHawalaOrders } from "../../redux/actions/hawalaOrderAction";
import { Select } from "@material-tailwind/react";
import AddHawalaDialog from "./AddHawalaDialog";
import Swal from "sweetalert2";

export default function HawalaOrders() {
  const [filterStatus, setFilterStatus] = useState("");
  const dispatch = useDispatch();
  const { orderList, total_items, per_page, current_page, total_pages } =
    useSelector((state) => state.hawalaOrdersReducer);
  const { user_info } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [from, setForm] = useState(0);
  const [to, setTo] = useState(0);
  const [showDialog, setShowDialog] = useState(false);



  const isRtl =
    i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    dispatch(getHawalaOrders(page, rowsPerPage, filterStatus, ""));
  }, [dispatch, page, rowsPerPage, filterStatus]);

  useEffect(() => {
    console.log(orderList);
  }, [dispatch, orderList, page, rowsPerPage, filterStatus]);

  useEffect(() => {
    if (current_page && per_page && total_items) {
      const fromValue = (current_page - 1) * per_page + 1;
      const toValue = Math.min(current_page * per_page, total_items);

      setForm(fromValue);
      setTo(toValue);
    }
  }, [current_page, per_page, total_items]);

  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < total_pages) setPage(page + 1);
  };

  const breadcrumbPaths = [{ label: t("HAWALA_ORDERS"), href: "/hawala-orders" }];

  const modalRef = useRef(null);

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

  // const handleDownload = async () => {
  //   if (modalRef.current) {
  //     try {
  //       // Wait for all images to load
  //       const images = modalRef.current.querySelectorAll('img');
  //       const imageLoadPromises = Array.from(images).map(
  //         (img) =>
  //           new Promise((resolve, reject) => {
  //             if (img.complete) {
  //               resolve();
  //             } else {
  //               img.onload = resolve;
  //               img.onerror = reject;
  //             }
  //           })
  //       );

  //       await Promise.all(imageLoadPromises);

  //       // Capture the modal content
  //       const canvas = await html2canvas(modalRef.current, {
  //         useCORS: true, // Enable cross-origin images
  //         logging: true, // Enable logging for debugging
  //         scale: 2, // Increase scale for better quality
  //         allowTaint: true, // Allow tainted images
  //       });

  //       // Download the image
  //       const link = document.createElement('a');
  //       link.href = canvas.toDataURL('image/png');
  //       link.download = 'order_details.png';
  //       link.click();
  //     } catch (error) {
  //       console.error('Error capturing modal content:', error);
  //       alert('Failed to capture modal content. Please try again.');
  //     }
  //   }
  // };

  const handleDownload = () => {
    // Ensure the page or modal content has the correct RTL direction
    const canvasParent = modalRef.current;
    canvasParent.style.direction = "rtl"; // Force RTL direction for correct Arabic rendering

    html2canvas(canvasParent, {
      useCORS: true, // Enable CORS to load external resources
      allowTaint: true, // Allow tainting of external resources
      backgroundColor: null, // Keep the background transparent
      textRendering: "geometricPrecision", // Improve text rendering quality
      logging: true, // Enable logging for debugging issues
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Debugging: To inspect the canvas content in the console
      //console.log(canvas);

      // Create a link to download the image
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${selectedOrder.rechargeble_account}.png`; // Filename for the image
      link.click(); // Trigger download
    });
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    
  };




  // const handleSubmitHawalaOrder = (formData) => {
  //   console.log("Form submitted:", formData);
  // };

    const handleSubmitHawalaOrder = async (formData) => {
      try {
        const result = await dispatch(addHawalaOrder(formData));
  
        // Check for error returned from thunk (if using rejectWithValue or custom return)
        if (result?.error) {
          throw new Error(result.error);
        }
  
        // ✅ Success alert
        Swal.fire({
          title: t("SUCCESS"),
          text: t("HAWALA_ORDER_PLACED_SUCCESSFULLY"),
          icon: "success",
          confirmButtonColor: "#10b981",
        });
        dispatch(getHawalaOrders())
  
      } catch (error) {
        // ❌ Error alert
        Swal.fire({
          title: t("ERROR"),
          text: error?.message || t("FAILED_TO_PLACED_HAWALA_ORDER"),
          icon: "error",
          confirmButtonColor: "#ef4444", // red-500
        });
      }
    };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="border rounded-md bg-[#EEF4FF] col-span-12 space-y-6 xl:col-span-12 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Phone Number Input */}
          <div className="bg-[#EEF4FF] rounded-lg">
            <form className="hidden">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Destination phone number"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </form>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-md w-full">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-md"
            >
              <option value="">{t("ALL")}</option>
              <option value="0">{t("PENDING")}</option>
              <option value="1">{t("CONFIRMED")}</option>
              <option value="2">{t("CANCELLED")}</option>
            </select>
          </div>

          {/* Transfer Amount Input */}
          <div className="bg-[#EEF4FF] rounded-lg">
            <div className="flex justify-end w-full">
              <button
                onClick={handleOpenDialog}
                style={{ borderRadius: "50px" }}
                className="h-11 w-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
              >
                {t("ADD_HAWALA_ORDER")}
              </button>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center">
            <button
              style={{ borderRadius: "50px" }}
              className="h-8 w-full bg-blue-800 text-white text-sm font-semibold hover:bg-green-600 transition"
            >
              {t("APPLY_FILTER")}
            </button>
          </div>
          <div className="flex items-center">
            <button
              style={{ borderRadius: "50px" }}
              className="border border-red-500 h-8 w-full bg-white text-red-500 text-sm font-semibold hover:bg-green-600 transition"
            >
              {t("CLEAR_FILTER")}
            </button>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {orderList.map((order) => (
            <div>
              {/* Main Card */}
              <div
                key={order.id}
                onClick={() => handleClickOpen(order)}
                className="cursor-pointer col-span-1 mb-3"
              >
                <div
                  className={`flex gap-1  flex-col bg-white shadow-md rounded-lg border ${
                    order.status == "cancelled"
                      ? "border-red-500"
                      : order.status == "pending"
                      ? "border-yellow-300"
                      : "border-green-500"
                  } p-2`}
                >
                  <div
                    className={`${
                      order.status == "cancelled"
                        ? "bg-red-500"
                        : order.status == "confirmed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    } font-medium text-white flex flex-row justify-between items-center rounded-t-md px-2 py-1`}
                  >
                    <span>
                      {t("HAWALA_NUMBER")} (# {order.hawala_number})
                    </span>
                    <span className="">{order.status}</span>
                  </div>

                  <div
                    className={`text-sm flex flex-row justify-between items-center rounded-md px-2 py-1`}
                  >
                    <span className="text-gray-500">{t("SENDER_NAME")}</span>
                    <span className="font-bold">{order.sender_name}</span>
                  </div>

                  <div
                    className={`text-sm flex flex-row justify-between items-center rounded-md px-2 py-1`}
                  >
                    <span className="text-gray-500">{t("RECEIVER_NAME")}</span>
                    <span className="font-bold">{order.receiver_name}</span>
                  </div>

                  <div
                    className={`text-sm flex flex-row justify-between items-center rounded-md px-2 py-1`}
                  >
                    <span className="text-gray-500">{t("HAWALA_AMOUNT")}</span>
                    <span className="font-bold">{order.hawala_amount}</span>
                  </div>

                  <div
                    className={`text-sm flex flex-row justify-between items-center rounded-md px-2 py-1`}
                  >
                    <span className="text-gray-500">{t("PAYABLE_AMOUNT")}</span>
                    <span className="font-bold">
                      {order.hawala_amount_currency_rate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* pagination */}
        <div className="flex flex-wrap items-center justify-end px-4 py-3 bg-white border-t-2 rounded-lg shadow-md space-x-4">
          {/* {t("ROWS_PER_PAGE")} selection */}
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{t("ROWS_PER_PAGE")}:</span>
            <select className="p-1 min-w-[60px] text-gray-700">
              <option>10</option>
              <option>20</option>
            </select>
          </div>

          {/* Pagination info */}
          <div className="text-gray-700 mx-4">
            {from}-{to} of {total_items}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 ${
                page === 1
                  ? "text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={goToPreviousPage}
              disabled={page === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className={`p-2 ${
                page === total_pages
                  ? "text-gray-300"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={goToNextPage}
              disabled={page === total_pages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* pagination */}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-80 text-left m-2 overflow-y-auto">
            <div
              ref={modalRef}
              className={`border ${
                selectedOrder.status == "cancelled"
                  ? "border-red-500"
                  : selectedOrder.status == "confirmed"
                  ? "border-green-500"
                  : "border-yellow-500"
              } rounded-md flex flex-col gap-3`}
            >
              <div className="flex flex-col items-center justify-center mt-3">
                <img
                  src="/images/img/teknur_pay.png"
                  alt=""
                  className="w-[60px] h-[60px] object-contain"
                />
                <span>{selectedOrder.status=="pending"?t('PENDING'):selectedOrder.status=="confirmed"?t('SUCCESSFUL'):t('CANCELLED')}</span>
              </div>

              <div className="flex flex-col gap-2 p-3">
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("HAWALA_NUMBER")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.hawala_number}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("HAWALA_AMOUNT")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.hawala_amount}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("SENDER_NAME")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.sender_name}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("RECEIVER_NAME")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.receiver_name}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("RECEIVER_ID_CARD_NUMBER")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.receiver_id_card_number}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("RECEIVER_FATHERS_NAME")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.receiver_father_name}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("HAWALA_CURRENCY_RATE")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.hawala_amount_currency_rate}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("HAWALA_CURRENCY_CODE")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.hawala_amount_currency_code}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("RESELLER_CURRENCY_RATE")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.reseller_prefered_currency_rate}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("RESELLER_CURRENCY_CODE")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.reseller_prefered_currency_code}
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">
                    {t("COMMISSION_PAID_BY")}
                  </span>
                  <span className="text-black text-sm">
                    {selectedOrder.commission_paid_by_receiver
                      ? t("RECEIVER")
                      : selectedOrder.paid_by_sender
                      ? t("SENDER")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-3 justify-between items-center">
              <button
                onClick={handleShare}
                className="rounded-[50px] bg-blue-700 m-3 px-5 py-2 w-[120px] text-white text-center"
              >
                {t("SHARE")}
              </button>
              <button
                onClick={handleDownload}
                className="rounded-[50px] bg-white m-3 px-5 py-2 w-[120px] text-blue-700 text-center border-2 border-blue-700"
              >
                {t("DOWNLOAD")}
              </button>
            </div>

            <div className="flex flex-row justify-center">
              <button
                onClick={handleClose}
                className="border-2 border-gray-500 w-full rounded-[50px] py-2 text-black font-bold"
              >
                {t("CLOSE")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add hawala order  Dialog */}
     <AddHawalaDialog
        showDialog={showDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitHawalaOrder}
      />
    </div>
  );
}

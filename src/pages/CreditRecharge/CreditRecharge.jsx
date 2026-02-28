// import { useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
// import { getOrders } from "../../redux/actions/orderAction";
// import { Dialpad } from "../../icons";
// import Input from "../../components/form/input/InputField";
// import {placeOrder,confirmPin,clearMessages, customRecharge} from '../../redux/actions/rechargeAction'
// import { getCountries, getCustomRechargeConfig } from "../../redux/actions/locationAction";
// import { toast } from "react-toastify";
// import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"
// import html2canvas from "html2canvas";

// export default function CreditRecharge() {
//   const [expanded, setExpanded] = useState(null);
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";
//   const [errorMessage,setErrorMessage]=useState("")
  
//   const dispatch=useDispatch()
//   const {serviceList}=useSelector((state)=>state.serviceListReducer)
//   const [amount,setAmount]=useState("")
//   const [countryId,setCountryId]=useState("9")
//   const [number,setNumber]=useState("")
//   const [phoneNumberError, setPhoneNumberError] = useState("");
//   const [phoneNumberLength,setPhoneNumberLength]=useState("10")
//   const { message,error, orderPlaced } = useSelector((state) => state.rechargeReducer);
//   const {countries,custom_recharge_info}=useSelector((state)=>state.locationReducer)
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [filterStatus, setFilterStatus] = useState("");
//   const { orderList,total_items, per_page, current_page, total_pages } = useSelector((state) => state.orderListReducer);
//   const { user_info } = useSelector((state) => state.auth);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [from, setForm] = useState(0);
//   const [to, setTo] = useState(0);
  
//   // New state for calculated values
//   const [calculatedValues, setCalculatedValues] = useState({
//     buying: 0,
//     selling: 0
//   });

//   useEffect(() => {
//     dispatch(getOrders(page + 1, rowsPerPage, filterStatus,"custom_recharge"));
//   }, [dispatch, page, rowsPerPage, filterStatus]);

//   useEffect(() => {
//     if (current_page && per_page && total_items) {
//       const fromValue = (current_page - 1) * per_page + 1;
//       const toValue = Math.min(current_page * per_page, total_items);

//       setForm(fromValue);
//       setTo(toValue);
//     }
//   }, [current_page, per_page, total_items]);

//   const goToPreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const goToNextPage = () => {
//     if (page < total_pages) setPage(page + 1);
//   };

//   useEffect(()=>{
//     dispatch(getCountries())
//     dispatch(getCustomRechargeConfig())
//   },[dispatch])

//   useEffect(()=>{
//     if(custom_recharge_info) {
//       console.log(custom_recharge_info.adjust_type)
//     }
//   },[dispatch,custom_recharge_info])

//   // Calculate buying and selling prices when amount or custom_recharge_info changes
//   useEffect(() => {
//     if (amount && custom_recharge_info && Object.keys(custom_recharge_info).length > 0) {
//       const base = parseFloat(amount) || 0;
      
//       // BUYING calculation
//       const adjustPercent = parseFloat(custom_recharge_info.adjust_value) || 0;
//       let buying = base;

//       if (custom_recharge_info.adjust_mode === "percentage") {
//         const adjustAmount = base * adjustPercent / 100;
        
//         if (custom_recharge_info.adjust_type === "increase") {
//           buying = base + adjustAmount;
//         } else if (custom_recharge_info.adjust_type === "decrease") {
//           buying = base - adjustAmount;
//         }
//       }

//       // SELLING calculation
//       const sellingPercent = parseFloat(custom_recharge_info.selling_adjust_value) || 0;
//       let selling = buying;

//       if (custom_recharge_info.selling_adjust_mode === "percentage") {
//         const sellingAmount = buying * sellingPercent / 100;
        
//         if (custom_recharge_info.selling_adjust_type === "increase") {
//           selling = buying + sellingAmount;
//         } else if (custom_recharge_info.selling_adjust_type === "decrease") {
//           selling = buying - sellingAmount;
//         }
//       }

//       setCalculatedValues({
//         buying: buying,
//         selling: selling
//       });
//     } else {
//       setCalculatedValues({
//         buying: 0,
//         selling: 0
//       });
//     }
//   }, [amount, custom_recharge_info]);

//   useEffect(() => {
//     const selectedCountry = countries.find(country => country.id === 9);
    
//     if (selectedCountry) {
//       setPhoneNumberLength(selectedCountry.phone_number_length)
//     }
//   }, [ dispatch,countries,phoneNumberLength,countryId]);

//   const modalRef = useRef(null);

//   const handleShare = async () => {
//     if (modalRef.current) {
//       try {
//         const canvas = await html2canvas(modalRef.current);
//         canvas.toBlob((blob) => {
//           if (blob) {
//             const file = new File([blob], "order_details.png", {
//               type: "image/png",
//             });
//             const data = {
//               files: [file],
//               title: "Order Details",
//               text: "Check out this order details!",
//             };
//             if (navigator.canShare && navigator.canShare(data)) {
//               navigator.share(data).catch((error) => {
//                 console.error("Sharing failed:", error);
//                 alert("Sharing failed. Please try again.");
//               });
//             } else {
//               alert("Sharing is not supported in this browser.");
//             }
//           }
//         });
//       } catch (error) {
//         console.error("Error capturing modal content:", error);
//         alert("Failed to capture modal content. Please try again.");
//       }
//     }
//   };

//   const handleDownload = () => {
//     const canvasParent = modalRef.current;
//     canvasParent.style.direction = "rtl";

//     html2canvas(canvasParent, {
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: null,
//       textRendering: "geometricPrecision",
//       logging: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = imgData;
//       link.download = `${selectedOrder.rechargeble_account}.png`;
//       link.click();
//     });
//   };

//   const handleNumberChange = (e) => {
//     const value = e.target.value;
//     setNumber(value);

//     if (value.length === 0) {
//       setPhoneNumberError("");
//     } else if (value.length < parseInt(phoneNumberLength)) {
//       setPhoneNumberError(`Number should be ${phoneNumberLength} digits.`);
//     } else if (value.length === parseInt(phoneNumberLength)) {
//       setPhoneNumberError("");
//     }
//   };

//   const handleRecharge=()=>{
//     if (!number || !amount) {
//       toast.error('Number and amount are required!');
//       Swal.fire({
//         title:t('ENTER_REQUIRED_FIELDS'),
//         showCancelButton: true,
//         showConfirmButton: true,
//         confirmButtonText: t("OK"),
//         cancelButtonText: t("CANCEL"),
//         customClass: {
//           popup: "rounded-xl p-6",
//           title: "text-lg font-semibold text-gray-900",
//           confirmButton:
//             "bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6 py-2 shadow-md mr-2",
//           cancelButton:
//             "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md",
//         },
//         buttonsStyling: false,
//       })
//       return;
//     }
    
//     Swal.fire({
//       title: t('ARE_YOU_SURE_ABOUT_YOUR_TRANSFER'),
//       showCancelButton: true,
//       showConfirmButton: true,
//       confirmButtonText: t("CONFIRMATION"),
//       cancelButtonText: t("CANCEL"),
//       customClass: {
//         popup: "rounded-xl p-6",
//         title: "text-lg font-semibold text-gray-900",
//         confirmButton:
//           "bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6 py-2 shadow-md mr-2",
//         cancelButton:
//           "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md",
//       },
//       buttonsStyling: false,
//     }).then((result) => {
//       if (result.isConfirmed) {
//         dispatch(customRecharge(9,number,amount));
//       }
//     });
//   }

//   useEffect(()=>{
//     if(message || error){
//       if(orderPlaced){
//         Swal.fire({
//           html: `
//             <div class="flex flex-col items-center">
//               <img src="/images/img/approval.png" 
//                    alt="Success" 
//                    class="w-20 mb-3" />
//               <h3 class="text-green-600 font-bold text-lg text-center">
//                 ${message}
//               </h3>
//             </div>
//           `,
//           showConfirmButton: true,
//           confirmButtonText: "Close",
//           customClass: {
//             popup: "rounded-xl p-6",
//             confirmButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md",
//           },
//         });
//         setNumber('')
//         setAmount('')
//         dispatch(clearMessages())
//       }
//       if(error){
//         Swal.fire({
//           html: `
//             <div class="flex flex-col items-center">
//               <img src="/images/img/red_cancel_icon.png" 
//                    alt="Success" 
//                    class="w-20 mb-3" />
//               <h3 class="text-green-600 font-bold text-lg text-center">
//                 ${message}
//               </h3>
//             </div>
//           `,
//           showConfirmButton: true,
//           confirmButtonText: "CLOSE",
//           customClass: {
//             popup: "rounded-xl p-6",
//             confirmButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md",
//           },
//         });
//         dispatch(clearMessages())
//         setErrorMessage(error)
//         dispatch(clearMessages())
//       }
//     }
//   },[dispatch,orderPlaced,error,message])

//   const handleClickOpen = (order) => {
//     setSelectedOrder(order);
//     setModalOpen(true);
//   };

//   const handleClose = () => {
//     setModalOpen(false);
//     setSelectedOrder(null);
//   };

//   const breadcrumbPaths = [
//     { label: t('AFGHANISTAN_TOP_UP'), href: "/credit-recharge" },
//   ];

//   return (
//     <div className="grid grid-cols-12 gap-4 md:gap-6">
//       <div className="col-span-12 space-y-6 xl:col-span-12">
//         <Breadcrumb paths={breadcrumbPaths} />
//       </div>

//       <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-4">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {/* Phone Number Input */}
//           <div>
//             <form>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2">
//                   <Dialpad className="h-[24px] w-[24px]" />
//                 </span>
//                 <Input
//                   value={number}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (value.length <= phoneNumberLength) {
//                       handleNumberChange(e);
//                     }
//                   }}
//                   type="text"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   error={phoneNumberError}
//                   hint={phoneNumberError}
//                   placeholder={t("ENTER_YOUR_NUMBER")}
//                   helperText={phoneNumberError}
//                   required
//                   inputProps={{
//                     min: 0,
//                   }}
//                   className={`h-11 rounded-lg border ${phoneNumberError ? 'border-red-500' : 'border-gray-200'} bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring ${
//                     phoneNumberError ? 'focus:border-red-500 focus:ring-red-500/10' : 'focus:border-brand-300 focus:ring-brand-500/10'
//                   } dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Transfer Amount Input */}
//           <div>
//             <form>
//               <div className="relative">
//                 <Input
//                   value={amount}
//                   type="text"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   placeholder={t('ENTER_TRANSFER_AMOUNT')}
//                   onChange={(e)=>setAmount(e.target.value)}
//                   className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
//                 />
//                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/80">
//                   {user_info?.currency?.code}
//                 </span>
//               </div>
//             </form>
//           </div>

//           {/* Submit Button */}
//           <div className="flex items-center">
//             <button onClick={handleRecharge} style={{borderRadius:'50px'}} className="h-11 w-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition">
//               {t('SEND_TO_DESTINATION')}
//             </button>
//           </div>
//         </div>

//         {/* Buy/Sell Calculation Section - New */}
//         {amount && custom_recharge_info && Object.keys(custom_recharge_info).length > 0 && (
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Buying Price */}
//               <div className="bg-white p-3 rounded-lg shadow-sm">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-orange-500">{t('BUYING_PRICE')}:</span>
//                   <span className="text-lg font-bold text-orange-500">
//                     {calculatedValues.buying.toFixed(2)} {user_info?.currency?.code}
//                   </span>
//                 </div>
//                 <div className="text-xs text-orange-500 mt-1">
//                   {custom_recharge_info.adjust_type === "increase" ? "+" : "-"} 
//                   {custom_recharge_info.adjust_value}% {t('ADJUSTMENT')}
//                 </div>
//               </div>
              
//               {/* Selling Price */}
//               <div className="bg-white p-3 rounded-lg shadow-sm">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-green-600">{t('SELLING_PRICE_NEW')}:</span>
//                   <span className="text-lg font-bold text-green-600">
//                     {calculatedValues.selling.toFixed(2)} {user_info?.currency?.code}
//                   </span>
//                 </div>
//                 <div className="text-xs text-green-500 mt-1">
//                   {custom_recharge_info.selling_adjust_type === "increase" ? "+" : "-"} 
//                   {custom_recharge_info.selling_adjust_value}% {t('ADJUSTMENT')}
//                 </div>
//               </div>
//             </div>
            
            
//           </div>
//         )}
//       </div>

//       <div className="border rounded-md bg-[#EEF4FF] col-span-12 space-y-6 xl:col-span-12 p-2">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {/* Phone Number Input */}
//           <div className="bg-[#EEF4FF] rounded-lg">
//             <form className="hidden">
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2">
//                   <svg
//                     className="fill-gray-500 dark:fill-gray-400"
//                     width="20"
//                     height="20"
//                     viewBox="0 0 20 20"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       clipRule="evenodd"
//                       d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
//                     />
//                   </svg>
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="Destination phone number"
//                   className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Transfer Amount Input */}
//           <div className="bg-[#EEF4FF] rounded-lg">
//             <form className="hidden">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Transfer amount"
//                   className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
//                 />
//                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/80">
//                   AFN
//                 </span>
//               </div>
//             </form>
//           </div>

//           {/* Submit Button */}
//           <div className="bg-white rounded-lg">
//             <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className="w-full rounded-md">
//               <option value="">{t("ALL")}</option>
//               <option value="0">{t("PENDING")}</option>
//               <option value="1">{t("CONFIRMED")}</option>
//               <option value="2">{t("REJECTED")}</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {/* Submit Button */}
//           <div className="flex items-center">
//             <button style={{borderRadius:'50px'}} className="h-8 w-full bg-blue-800 text-white text-sm font-semibold hover:bg-green-600 transition">
//               {t("APPLY_FILTER")}
//             </button>
//           </div>
//           <div className="flex items-center">
//             <button style={{borderRadius:'50px'}} className="border border-red-500 h-8 w-full bg-white text-red-500 text-sm font-semibold hover:bg-green-600 hover:text-white transition">
//               {t("CLEAR_FILTER")}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//           {orderList.map((order,index) => (
//             <div key={index} className="col-span-1">
//               {/* Main Card */}
//               <div onClick={()=>handleClickOpen(order)} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
//                 <div className="flex items-center space-x-3">
//                   <img className="w-12 h-12 rounded" src={order?.bundle?.service?.company?.company_logo} alt={order?.bundle?.service?.company?.name} />
//                   <div className="pr-2">
//                     <p className="text-sm font-medium">{t('ORDER_ID')}: #({order.id})</p>
//                     <p className="text-xs text-gray-500">{order.rechargeble_account}</p>
//                   </div>
//                 </div>
//                 <button
//                   className="text-blue-600 text-sm"
//                   onClick={() => setExpanded(expanded === order.id ? null : order.id)}
//                 >
//                   {expanded === order.id ? t("CLOSE") + " ▲" : t("SEE_MORE") + " ▼"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* pagination */}
//         <div className="flex flex-wrap items-center justify-end px-4 py-3 bg-white border-t-2 rounded-lg shadow-md space-x-4">
//           <div className="flex items-center space-x-2 text-gray-600">
//             <span></span>
//             <select className="p-1 min-w-[60px] text-gray-700">
//               <option>10</option>
//               <option>20</option>
//             </select>
//           </div>

//           <div className="text-gray-700 mx-4">
//             {from}-{to} of {total_items}
//           </div>

//           <div className="flex items-center space-x-2">
//             <button
//               className={`p-2 ${
//                 page === 1
//                   ? "text-gray-300"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//               onClick={goToPreviousPage}
//               disabled={page === 1}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <button
//               className={`p-2 ${
//                 page === total_pages
//                   ? "text-gray-300"
//                   : "text-gray-700 hover:text-gray-900"
//               }`}
//               onClick={goToNextPage}
//               disabled={page === total_pages}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-80 text-left m-2">
//             <div
//               ref={modalRef}
//               className={`border ${selectedOrder.status == 2
//                 ? "border-red-500"
//                 : selectedOrder.status == 1
//                   ? "border-green-500"
//                   : "border-yellow-500"
//                 } rounded-md flex flex-col gap-3`}
//             >
//               <div className="flex flex-col items-center justify-center bg-blue-50 pb-3">
//                 <img
//                   src="/images/img/teknur_pay.png"
//                   alt=""
//                   className="w-[80px] h-[80px] object-contain py-3"
//                 />
//                 <span>{selectedOrder.status == 0 ? t('PENDING') : selectedOrder.status == 1 ? t('SUCCESSFUL') : t('REJECTED')}</span>
//                 <span className="text-red-500">{selectedOrder.status==2?selectedOrder.reject_reason:''}</span>
//               </div>

//               <div className="flex flex-col gap-2 p-3">
//                 <div className="flex flex-row justify-between items-center">
//                   <img
//                     src={selectedOrder?.bundle.service.company.company_logo}
//                     alt="Logo"
//                     className="h-12 w-12 rounded-lg object-contain"
//                   />
//                   <span className="text-gray-400 text-sm">
//                     {selectedOrder.bundle.bundle_title}
//                   </span>
//                 </div>
//                 <hr />
//                 <div className="flex flex-row justify-between">
//                   <span className="text-gray-400 text-sm">
//                     {t("ORDER_ID")}
//                   </span>
//                   <span className="text-black text-sm">
//                     <span>{t('ID: ')}</span>{selectedOrder.id}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between w-full text-gray-600 text-sm">
//                   <span className="font-medium">{t("DATE")}</span>
//                   <span className="font-semibold text-gray-800">
//                     {new Date(selectedOrder?.created_at).toLocaleDateString()}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between w-full text-gray-600 text-sm">
//                   <span className="font-medium">{t("TIME")}</span>
//                   <span className="font-semibold text-gray-800">
//                     {new Date(selectedOrder?.created_at).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-blue-50 p-3 flex items-center">
//                 <div className="flex flex-col w-full">
//                   <div className="flex flex-row justify-between">
//                     <span className="text-gray-400 text-sm">
//                       {t("PHONE_NUMBER")}
//                     </span>
//                     <span className="text-black text-sm">
//                       {selectedOrder.rechargeble_account}
//                     </span>
//                   </div>
//                   <div className="flex flex-row justify-between">
//                     <span className="text-gray-400 text-sm">
//                       {t("SENDER")}
//                     </span>
//                     <span className="text-black text-sm">
//                       {selectedOrder.performed_by_name}
//                     </span>
//                   </div>
//                   <div className="flex flex-row justify-between">
//                     <span className="text-gray-400 text-sm">{t("PRICE")}</span>
//                     <span className="text-black text-sm">
//                       {user_info?.currency?.code}{" "}
//                       {selectedOrder.bundle.selling_price}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-row gap-3 justify-between items-center">
//               <button
//                 onClick={handleShare}
//                 className="rounded-[50px] bg-blue-700 m-3 px-5 py-2 w-[120px] text-white text-center"
//               >
//                 {t("SHARE")}
//               </button>
//               <button
//                 onClick={handleDownload}
//                 className="rounded-[50px] bg-white m-3 px-5 py-2 w-[120px] text-blue-700 text-center border-2 border-blue-700"
//               >
//                 {t("DOWNLOAD")}
//               </button>
//             </div>

//             <div className="flex flex-row justify-center">
//               <button
//                 onClick={handleClose}
//                 className="border-2 border-gray-500 w-full rounded-[50px] py-2 text-black font-bold"
//               >
//                 {t("CLOSE")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getOrders } from "../../redux/actions/orderAction";
import { Dialpad } from "../../icons";
import Input from "../../components/form/input/InputField";
import { placeOrder, confirmPin, clearMessages, customRecharge } from '../../redux/actions/rechargeAction';
import { getCountries, getCustomRechargeConfig } from "../../redux/actions/locationAction";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import html2canvas from "html2canvas";

export default function CreditRecharge() {
  const [expanded, setExpanded] = useState(null);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const { serviceList } = useSelector((state) => state.serviceListReducer);
  const [amount, setAmount] = useState("");
  const [countryId, setCountryId] = useState("9");
  const [number, setNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [phoneNumberLength, setPhoneNumberLength] = useState("10");
  const { message, error, orderPlaced } = useSelector((state) => state.rechargeReducer);
  const { countries, custom_recharge_info } = useSelector((state) => state.locationReducer);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");
  const { orderList, total_items, per_page, current_page, total_pages } = useSelector((state) => state.orderListReducer);
  const { user_info } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [from, setForm] = useState(0);
  const [to, setTo] = useState(0);

  const [calculatedValues, setCalculatedValues] = useState({ buying: 0, selling: 0 });

  useEffect(() => {
    dispatch(getOrders(page + 1, rowsPerPage, filterStatus, "custom_recharge"));
  }, [dispatch, page, rowsPerPage, filterStatus]);

  useEffect(() => {
    if (current_page && per_page && total_items) {
      setForm((current_page - 1) * per_page + 1);
      setTo(Math.min(current_page * per_page, total_items));
    }
  }, [current_page, per_page, total_items]);

  const goToPreviousPage = () => { if (page > 1) setPage(page - 1); };
  const goToNextPage = () => { if (page < total_pages) setPage(page + 1); };

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getCustomRechargeConfig());
  }, [dispatch]);

  useEffect(() => {
    if (custom_recharge_info) console.log(custom_recharge_info.adjust_type);
  }, [dispatch, custom_recharge_info]);

  useEffect(() => {
    if (amount && custom_recharge_info && Object.keys(custom_recharge_info).length > 0) {
      const base = parseFloat(amount) || 0;
      const adjustPercent = parseFloat(custom_recharge_info.adjust_value) || 0;
      let buying = base;
      if (custom_recharge_info.adjust_mode === "percentage") {
        const adjustAmount = base * adjustPercent / 100;
        buying = custom_recharge_info.adjust_type === "increase" ? base + adjustAmount : base - adjustAmount;
      }
      const sellingPercent = parseFloat(custom_recharge_info.selling_adjust_value) || 0;
      let selling = buying;
      if (custom_recharge_info.selling_adjust_mode === "percentage") {
        const sellingAmount = buying * sellingPercent / 100;
        selling = custom_recharge_info.selling_adjust_type === "increase" ? buying + sellingAmount : buying - sellingAmount;
      }
      setCalculatedValues({ buying, selling });
    } else {
      setCalculatedValues({ buying: 0, selling: 0 });
    }
  }, [amount, custom_recharge_info]);

  useEffect(() => {
    const selectedCountry = countries.find(country => country.id === 9);
    if (selectedCountry) setPhoneNumberLength(selectedCountry.phone_number_length);
  }, [dispatch, countries, phoneNumberLength, countryId]);

  const modalRef = useRef(null);

  const handleShare = async () => {
    if (modalRef.current) {
      try {
        const canvas = await html2canvas(modalRef.current);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "order_details.png", { type: "image/png" });
            const data = { files: [file], title: "Order Details", text: "Check out this order details!" };
            if (navigator.canShare && navigator.canShare(data)) {
              navigator.share(data).catch((error) => { console.error("Sharing failed:", error); alert("Sharing failed."); });
            } else { alert("Sharing is not supported in this browser."); }
          }
        });
      } catch (error) { console.error("Error capturing modal content:", error); alert("Failed to capture."); }
    }
  };

  const handleDownload = () => {
    const canvasParent = modalRef.current;
    canvasParent.style.direction = "rtl";
    html2canvas(canvasParent, { useCORS: true, allowTaint: true, backgroundColor: null, textRendering: "geometricPrecision", logging: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${selectedOrder.rechargeble_account}.png`;
      link.click();
    });
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setNumber(value);
    if (value.length === 0) setPhoneNumberError("");
    else if (value.length < parseInt(phoneNumberLength)) setPhoneNumberError(`Number should be ${phoneNumberLength} digits.`);
    else if (value.length === parseInt(phoneNumberLength)) setPhoneNumberError("");
  };

  const handleRecharge = () => {
    if (!number || !amount) {
      toast.error('Number and amount are required!');
      Swal.fire({
        title: t('ENTER_REQUIRED_FIELDS'), showCancelButton: true, showConfirmButton: true,
        confirmButtonText: t("OK"), cancelButtonText: t("CANCEL"),
        customClass: { popup: "rounded-xl p-6", title: "text-lg font-semibold text-gray-900", confirmButton: "bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6 py-2 shadow-md mr-2", cancelButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md" },
        buttonsStyling: false,
      });
      return;
    }
    Swal.fire({
      title: t('ARE_YOU_SURE_ABOUT_YOUR_TRANSFER'), showCancelButton: true, showConfirmButton: true,
      confirmButtonText: t("CONFIRMATION"), cancelButtonText: t("CANCEL"),
      customClass: { popup: "rounded-xl p-6", title: "text-lg font-semibold text-gray-900", confirmButton: "bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6 py-2 shadow-md mr-2", cancelButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md" },
      buttonsStyling: false,
    }).then((result) => { if (result.isConfirmed) dispatch(customRecharge(9, number, amount)); });
  };

  useEffect(() => {
    if (message || error) {
      if (orderPlaced) {
        Swal.fire({ html: `<div class="flex flex-col items-center"><img src="/images/img/approval.png" alt="Success" class="w-20 mb-3"/><h3 class="text-green-600 font-bold text-lg text-center">${message}</h3></div>`, showConfirmButton: true, confirmButtonText: "Close", customClass: { popup: "rounded-xl p-6", confirmButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md" } });
        setNumber(''); setAmount(''); dispatch(clearMessages());
      }
      if (error) {
        Swal.fire({ html: `<div class="flex flex-col items-center"><img src="/images/img/red_cancel_icon.png" alt="Error" class="w-20 mb-3"/><h3 class="text-green-600 font-bold text-lg text-center">${message}</h3></div>`, showConfirmButton: true, confirmButtonText: "CLOSE", customClass: { popup: "rounded-xl p-6", confirmButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md" } });
        dispatch(clearMessages()); setErrorMessage(error); dispatch(clearMessages());
      }
    }
  }, [dispatch, orderPlaced, error, message]);

  const handleClickOpen = (order) => { setSelectedOrder(order); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setSelectedOrder(null); };

  const breadcrumbPaths = [{ label: t('AFGHANISTAN_TOP_UP'), href: "/credit-recharge" }];

  const statusConfig = {
    0: { label: t('PENDING'), color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', dot: 'bg-amber-400' },
    1: { label: t('CONFIRMED'), color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', dot: 'bg-emerald-400' },
    2: { label: t('REJECTED'), color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', dot: 'bg-red-400' },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .cr-root { font-family: 'Sora', sans-serif; }
        .cr-mono { font-family: 'JetBrains Mono', monospace; }

        .cr-send-card {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }
        .cr-send-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
          border-radius: 50%;
        }
        .cr-send-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }

        .cr-input-wrapper {
          position: relative;
        }
        .cr-input {
          height: 52px;
          width: 100%;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          padding: 0 48px 0 44px;
          font-size: 14px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
          outline: none;
          backdrop-filter: blur(4px);
        }
        .cr-input::placeholder { color: rgba(255,255,255,0.35); }
        .cr-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .cr-input.error { border-color: rgba(239,68,68,0.6); }
        .cr-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
        }
        .cr-input-suffix {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.08);
          padding: 2px 8px;
          border-radius: 6px;
        }
        .cr-send-btn {
          height: 52px;
          width: 100%;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366F1, #4F46E5);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          letter-spacing: 0.01em;
        }
        .cr-send-btn:hover {
          background: linear-gradient(135deg, #818CF8, #6366F1);
          box-shadow: 0 6px 24px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }
        .cr-send-btn:active { transform: translateY(0); }

        .cr-price-pill {
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .cr-price-pill.buying {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
        }
        .cr-price-pill.selling {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
        }

        .cr-filters-section {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px 24px;
          margin-top: 0;
        }
        .cr-select {
          height: 40px;
          border-radius: 10px;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          padding: 0 12px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: #374151;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .cr-select:focus { border-color: #6366F1; }

        .cr-filter-btn {
          height: 40px;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          padding: 0 20px;
        }
        .cr-filter-btn.apply {
          background: #1E293B;
          color: #fff;
        }
        .cr-filter-btn.apply:hover { background: #0F172A; }
        .cr-filter-btn.clear {
          background: transparent;
          color: #EF4444;
          border: 1.5px solid #EF4444;
        }
        .cr-filter-btn.clear:hover { background: #FEF2F2; }

        .cr-order-card {
          background: #fff;
          border: 1px solid #F1F5F9;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .cr-order-card:hover {
          border-color: #C7D2FE;
          box-shadow: 0 4px 16px rgba(99,102,241,0.1);
          transform: translateY(-1px);
        }
        .cr-order-logo {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: contain;
          border: 1px solid #F1F5F9;
          background: #F8FAFC;
          padding: 2px;
          flex-shrink: 0;
        }
        .cr-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .cr-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cr-see-more-btn {
          font-size: 12px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          background: none;
          border: none;
          cursor: pointer;
          color: #6366F1;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .cr-see-more-btn:hover { background: #EEF2FF; }

        .cr-pagination {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 20px;
          background: #fff;
          border-top: 1px solid #F1F5F9;
          border-radius: 0 0 16px 16px;
        }
        .cr-pagination-btn {
          width: 34px; height: 34px;
          border-radius: 8px;
          border: 1.5px solid #E2E8F0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
        }
        .cr-pagination-btn:hover:not(:disabled) {
          border-color: #6366F1;
          color: #6366F1;
          background: #EEF2FF;
        }
        .cr-pagination-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .cr-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 16px;
        }
        .cr-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 380px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.2);
          animation: modalIn 0.25s ease;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cr-modal-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 28px 24px 20px;
          position: relative;
        }
        .cr-modal-logo {
          width: 64px; height: 64px;
          object-fit: contain;
          margin-bottom: 12px;
        }
        .cr-modal-body { padding: 0 24px 20px; }
        .cr-modal-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #F8FAFC;
          font-size: 13px;
        }
        .cr-modal-row:last-child { border-bottom: none; }
        .cr-modal-label { color: #94A3B8; font-weight: 400; }
        .cr-modal-value { color: #1E293B; font-weight: 600; }
        .cr-modal-actions {
          padding: 16px 24px;
          display: flex;
          gap: 10px;
          border-top: 1px solid #F1F5F9;
        }
        .cr-modal-action-btn {
          flex: 1;
          height: 42px;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .cr-modal-action-btn.share {
          background: #1E293B;
          color: #fff;
        }
        .cr-modal-action-btn.share:hover { background: #0F172A; }
        .cr-modal-action-btn.download {
          background: transparent;
          color: #6366F1;
          border: 1.5px solid #6366F1;
        }
        .cr-modal-action-btn.download:hover { background: #EEF2FF; }
        .cr-modal-close-btn {
          width: 100%;
          height: 42px;
          border-radius: 10px;
          background: #F8FAFC;
          border: none;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: background 0.2s;
          margin: 0 24px 20px;
          width: calc(100% - 48px);
          display: block;
        }
        .cr-modal-close-btn:hover { background: #E2E8F0; }

        .cr-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94A3B8;
          margin-bottom: 12px;
        }
        .cr-error-hint {
          font-size: 11px;
          color: #EF4444;
          margin-top: 4px;
          padding-left: 2px;
        }

        /* ── MOBILE RESPONSIVE ── */
        .cr-send-card { padding: 24px 20px; }
        .cr-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .cr-price-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 20px;
        }
        .cr-filter-bar {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .cr-filter-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          padding-top: 20px;
        }
        .cr-orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        @media (min-width: 640px) {
          .cr-form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .cr-form-grid .cr-btn-col {
            grid-column: span 2;
          }
        }
        @media (min-width: 900px) {
          .cr-form-grid {
            grid-template-columns: 1fr 1fr auto;
          }
          .cr-form-grid .cr-btn-col {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .cr-send-card { padding: 20px 16px; border-radius: 16px; }
          .cr-price-grid { grid-template-columns: 1fr; }
          .cr-price-pill { padding: 12px 14px; }
          .cr-filters-section { padding: 16px; border-radius: 12px; }
          .cr-filter-actions { width: 100%; padding-top: 0; }
          .cr-filter-btn { flex: 1; }
          .cr-filter-bar { gap: 8px; }
          .cr-orders-grid { grid-template-columns: 1fr; }
          .cr-order-card { padding: 12px; }
          .cr-modal { border-radius: 20px; }
          .cr-modal-header { padding: 20px 16px 16px; }
          .cr-modal-body { padding: 0 16px 16px; }
          .cr-modal-actions { padding: 12px 16px; }
          .cr-modal-close-btn { margin: 0 16px 16px; width: calc(100% - 32px); }
          .cr-pagination { padding: 12px 16px; }
        }

        @media (max-width: 360px) {
          .cr-send-card { padding: 16px 12px; }
          h2 { font-size: 18px !important; }
          .cr-input { height: 46px; font-size: 13px; }
          .cr-send-btn { height: 46px; font-size: 13px; }
        }
      `}</style>

      <div className="cr-root grid grid-cols-12 gap-4 md:gap-6">
        {/* Breadcrumb */}
        <div className="col-span-12">
          <Breadcrumb paths={breadcrumbPaths} />
        </div>

        {/* ── TOP-UP CARD ── */}
        <div className="col-span-12">
          <div className="cr-send-card">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ marginBottom: 24 }}>
                <p className="cr-section-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Afghanistan Mobile</p>
                <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>
                  {t('AFGHANISTAN_TOP_UP')}
                </h2>
              </div>

              <div className="cr-form-grid">
                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>
                    {t("ENTER_YOUR_NUMBER")}
                  </label>
                  <div className="cr-input-wrapper">
                    <span className="cr-input-icon">
                      <Dialpad className="h-5 w-5" />
                    </span>
                    <input
                      value={number}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= phoneNumberLength) handleNumberChange(e);
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="07XX XXX XXXX"
                      className={`cr-input ${phoneNumberError ? 'error' : ''}`}
                    />
                  </div>
                  {phoneNumberError && <p className="cr-error-hint">⚠ {phoneNumberError}</p>}
                </div>

                {/* Amount */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>
                    {t('ENTER_TRANSFER_AMOUNT')}
                  </label>
                  <div className="cr-input-wrapper">
                    <span className="cr-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9 10h6M9 14h6"/></svg>
                    </span>
                    <input
                      value={amount}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0.00"
                      onChange={(e) => setAmount(e.target.value)}
                      className="cr-input cr-mono"
                    />
                    <span className="cr-input-suffix">{user_info?.currency?.code}</span>
                  </div>
                </div>

                {/* Button */}
                <div className="cr-btn-col" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={handleRecharge} className="cr-send-btn" style={{ marginTop: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      {t('SEND_TO_DESTINATION')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Pills */}
              {amount && custom_recharge_info && Object.keys(custom_recharge_info).length > 0 && (
                <div className="cr-price-grid">
                  <div className="cr-price-pill buying">
                    <div>
                      <p style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{t('BUYING_PRICE')}</p>
                      <p style={{ fontSize: 10, color: 'rgba(245,158,11,0.7)', margin: '2px 0 0' }}>
                        {custom_recharge_info.adjust_type === "increase" ? "+" : "-"}{custom_recharge_info.adjust_value}% {t('ADJUSTMENT')}
                      </p>
                    </div>
                    <span className="cr-mono" style={{ fontSize: 20, fontWeight: 700, color: '#F59E0B' }}>
                      {calculatedValues.buying.toFixed(2)}
                    </span>
                  </div>
                  <div className="cr-price-pill selling">
                    <div>
                      <p style={{ fontSize: 11, color: '#10B981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{t('SELLING_PRICE_NEW')}</p>
                      <p style={{ fontSize: 10, color: 'rgba(16,185,129,0.7)', margin: '2px 0 0' }}>
                        {custom_recharge_info.selling_adjust_type === "increase" ? "+" : "-"}{custom_recharge_info.selling_adjust_value}% {t('ADJUSTMENT')}
                      </p>
                    </div>
                    <span className="cr-mono" style={{ fontSize: 20, fontWeight: 700, color: '#10B981' }}>
                      {calculatedValues.selling.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ORDERS SECTION ── */}
        <div className="col-span-12">
          <div className="cr-filters-section">
            {/* Filter Bar */}
            <div className="cr-filter-bar">
              <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                <p className="cr-section-label" style={{ marginBottom: 6 }}>Filter by status</p>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="cr-select" style={{ width: '100%' }}>
                  <option value="">{t("ALL")}</option>
                  <option value="0">{t("PENDING")}</option>
                  <option value="1">{t("CONFIRMED")}</option>
                  <option value="2">{t("REJECTED")}</option>
                </select>
              </div>
              <div className="cr-filter-actions">
                <button className="cr-filter-btn apply">{t("APPLY_FILTER")}</button>
                <button onClick={() => setFilterStatus("")} className="cr-filter-btn clear">{t("CLEAR_FILTER")}</button>
              </div>
            </div>

            {/* Section heading */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1E293B' }}>
                {t('ORDER_ID')} History
              </h3>
              {total_items > 0 && (
                <span style={{ fontSize: 12, color: '#94A3B8', background: '#F1F5F9', padding: '3px 10px', borderRadius: 100 }}>
                  {total_items} orders
                </span>
              )}
            </div>

            {/* Order Cards */}
            <div className="cr-orders-grid">
              {orderList.map((order, index) => {
                const sc = statusConfig[order.status] || statusConfig[0];
                return (
                  <div key={index} className="cr-order-card" onClick={() => handleClickOpen(order)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <img
                        className="cr-order-logo"
                        src={order?.bundle?.service?.company?.company_logo}
                        alt={order?.bundle?.service?.company?.name}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>#{order.id}</span>
                          <span className="cr-status-badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                            <span className={`cr-status-dot`} style={{ background: sc.color }}></span>
                            {sc.label}
                          </span>
                        </div>
                        <p className="cr-mono" style={{ margin: 0, fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.rechargeble_account}
                        </p>
                      </div>
                    </div>
                    <button
                      className="cr-see-more-btn"
                      onClick={(e) => { e.stopPropagation(); setExpanded(expanded === order.id ? null : order.id); }}
                    >
                      {expanded === order.id ? "▲" : "▼"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="cr-pagination" style={{ marginTop: 16 }}>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                {from}–{to} of {total_items}
              </span>
              <button className="cr-pagination-btn" onClick={goToPreviousPage} disabled={page === 1}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="cr-pagination-btn" onClick={goToNextPage} disabled={page === total_pages}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── ORDER DETAIL MODAL ── */}
        {modalOpen && selectedOrder && (() => {
          const sc = statusConfig[selectedOrder.status] || statusConfig[0];
          return (
            <div className="cr-modal-overlay" onClick={handleClose}>
              <div className="cr-modal" onClick={(e) => e.stopPropagation()}>
                {/* Receipt content for screenshot */}
                <div ref={modalRef}>
                  {/* Header */}
                  <div className="cr-modal-header" style={{ background: sc.bg, borderBottom: `1px solid ${sc.border}` }}>
                    <img src="/images/img/teknur_pay.png" alt="Logo" className="cr-modal-logo" />
                    <span className="cr-status-badge" style={{ background: '#fff', color: sc.color, border: `1.5px solid ${sc.border}`, fontSize: 13, padding: '5px 14px' }}>
                      <span className="cr-status-dot" style={{ background: sc.color }}></span>
                      {sc.label}
                    </span>
                    {selectedOrder.status === 2 && selectedOrder.reject_reason && (
                      <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6, textAlign: 'center' }}>{selectedOrder.reject_reason}</p>
                    )}
                  </div>

                  {/* Info rows */}
                  <div className="cr-modal-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0 12px' }}>
                      <img src={selectedOrder?.bundle.service.company.company_logo} alt="Co Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain', border: '1px solid #F1F5F9' }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{selectedOrder.bundle.bundle_title}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '0 0 4px' }} />

                    {[
                      { label: t("ORDER_ID"), value: `#${selectedOrder.id}` },
                      { label: t("DATE"), value: new Date(selectedOrder?.created_at).toLocaleDateString() },
                      { label: t("TIME"), value: new Date(selectedOrder?.created_at).toLocaleTimeString() },
                      { label: t("PHONE_NUMBER"), value: selectedOrder.rechargeble_account, mono: true },
                      { label: t("SENDER"), value: selectedOrder.performed_by_name },
                      { label: t("PRICE"), value: `${user_info?.currency?.code} ${selectedOrder.bundle.selling_price}`, mono: true, accent: true },
                    ].map(({ label, value, mono, accent }) => (
                      <div key={label} className="cr-modal-row">
                        <span className="cr-modal-label">{label}</span>
                        <span className={`cr-modal-value ${mono ? 'cr-mono' : ''}`} style={accent ? { color: '#6366F1' } : {}}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="cr-modal-actions">
                  <button onClick={handleShare} className="cr-modal-action-btn share">
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                      {t("SHARE")}
                    </span>
                  </button>
                  <button onClick={handleDownload} className="cr-modal-action-btn download">
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {t("DOWNLOAD")}
                    </span>
                  </button>
                </div>
                <button onClick={handleClose} className="cr-modal-close-btn">{t("CLOSE")}</button>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
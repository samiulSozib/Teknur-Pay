import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getOrders } from "../../redux/actions/orderAction";
import { Dialpad } from "../../icons";
import Input from "../../components/form/input/InputField";
import {placeOrder,confirmPin,clearMessages, customRecharge} from '../../redux/actions/rechargeAction'
import { getCountries } from "../../redux/actions/locationAction";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"





export default function CreditRecharge() {
  const [expanded, setExpanded] = useState(null);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";
  const [errorMessage,setErrorMessage]=useState("")


  


  const dispatch=useDispatch()
  const {serviceList}=useSelector((state)=>state.serviceListReducer)
  const [amount,setAmount]=useState("")
  const [countryId,setCountryId]=useState("9")
  const [number,setNumber]=useState("")
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [phoneNumberLength,setPhoneNumberLength]=useState("10")
  const { message,error, orderPlaced } = useSelector((state) => state.rechargeReducer);
  const {countries}=useSelector((state)=>state.locationReducer)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");
  const { orderList, total_items } = useSelector((state) => state.orderListReducer);
  const { user_info } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getOrders(page + 1, rowsPerPage, filterStatus,""));
  }, [dispatch, page, rowsPerPage, filterStatus]);

  useEffect(()=>{
    dispatch(getCountries())
  },[dispatch])

  useEffect(() => {
    const selectedCountry = countries.find(country => country.id === 9);
    
    if (selectedCountry) {
      
      setPhoneNumberLength(selectedCountry.phone_number_length)
    }

}, [ dispatch,countries,phoneNumberLength,countryId]);

const handleNumberChange = (e) => {
  const value = e.target.value;
  setNumber(value);
  //console.log(value.length)

  if (value.length === 0) {
    setPhoneNumberError("");  // Clear error if input is empty
  } else if (value.length < parseInt(phoneNumberLength)) {
    setPhoneNumberError(`Number should be ${phoneNumberLength} digits.`);
  } else if (value.length === parseInt(phoneNumberLength)) {
    setPhoneNumberError("");  // Clear error if length is correct
  }

  // if (value.length >= 3) {
    
  //   const prefix = value.substring(0, 3);
  //   const matchedService = serviceList.find(service =>
  //     service.company.companycodes.some(code => prefix.startsWith(code.reserved_digit))
  //   );

  //   if (!matchedService) {
  //     setPhoneNumberError(t('INVALID_PHONE'));
  //   } else {
  //     setPhoneNumberError("");
  //     setCompanyId(matchedService.company.id);
  //   }
  // } else {
  //   setCompanyId("");
  // }
};

const handleRecharge=()=>{
  console.log(number)
  console.log(amount)
  
  if (!number || !amount) {
    toast.error('Number and amount are required!');
    return;
  }
  Swal.fire({
      title: t('ARE_YOU_SURE_ABOUT_YOUR_TRANSFER'),
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: t("CONFIRMATION"),
      cancelButtonText: t("CANCEL"),
      customClass: {
        popup: "rounded-xl p-6",
        title: "text-lg font-semibold text-gray-900",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6 py-2 shadow-md mr-2",
        cancelButton:
          "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md",
      },
      buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(customRecharge(9,number,amount));
        }
      });
}

  useEffect(()=>{
    if(message || error){
    if(orderPlaced){
      Swal.fire({
        html: `
          <div class="flex flex-col items-center">
            <img src="/images/img/approval.png" 
                 alt="Success" 
                 class="w-20 mb-3" />
            <h3 class="text-green-600 font-bold text-lg text-center">
              ${message}
            </h3>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "Close",
        customClass: {
          popup: "rounded-xl p-6",
          confirmButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md",
        },
        
      });
      setNumber('')
      setAmount('')
      dispatch(clearMessages())
    }
    if(error){
      Swal.fire({
        html: `
          <div class="flex flex-col items-center">
            <img src="/images/img/red_cancel_icon.png" 
                 alt="Success" 
                 class="w-20 mb-3" />
            <h3 class="text-green-600 font-bold text-lg text-center">
              ${message}
            </h3>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "CLOSE",
        customClass: {
          popup: "rounded-xl p-6",
          confirmButton: "bg-white border border-gray-300 text-gray-900 font-medium rounded-full px-6 py-2 shadow-md",
        },
        
      });
      dispatch(clearMessages())
      setErrorMessage(error)
      dispatch(clearMessages())
    }
    }
  },[dispatch,orderPlaced,error,message])

  const handleClickOpen = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const breadcrumbPaths = [
    { label: t('CUSTOM_RECHARGE'), href: "/credit-recharge" },
  ];


  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Phone Number Input */}
            <div>
            <form>
                <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                   <Dialpad className="h-[24px] w-[24px]" />
                </span>
                <Input
                  value={number}
                  onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= phoneNumberLength) {
                        handleNumberChange(e);
                      }}
                    }
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  error={phoneNumberError}
                  hint={phoneNumberError}
                  placeholder={t("ENTER_YOUR_NUMBER")}
                  helperText={phoneNumberError}
                  required
                  inputProps={{
                      min: 0,
                  }}
                  className={`h-11 rounded-lg border ${phoneNumberError ? 'border-red-500' : 'border-gray-200'} bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring ${
                      phoneNumberError ? 'focus:border-red-500 focus:ring-red-500/10' : 'focus:border-brand-300 focus:ring-brand-500/10'
                    } dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                      />
                </div>
            </form>
            </div>

            {/* Transfer Amount Input */}
            <div>
            <form>
                <div className="relative">
                <Input
                    value={amount}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={t('ENTER_TRANSFER_AMOUNT')}
                    onChange={(e)=>setAmount(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/80">
                    {user_info?.currency?.code}
                </span>
                </div>
            </form>
            </div>

            {/* Submit Button */}
            <div className="flex items-center">
            <button onClick={handleRecharge} style={{borderRadius:'50px'}} className="h-11 w-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition">
                {t('SEND_TO_DESTINATION')}
            </button>
            </div>
        </div>
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

            {/* Transfer Amount Input */}
            <div className="bg-[#EEF4FF] rounded-lg">
                <form className="hidden">
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Transfer amount"
                        className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/80">
                        AFN
                    </span>
                    </div>
                </form>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg">
              <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className="w-full rounded-md">
                  <option value="">{t("ALL")}</option>
                  <option value="0">{t("PENDING")}</option>
                  <option value="1">{t("CONFIRMED")}</option>
                  <option value="2">{t("REJECTED")}</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Submit Button */}
            <div className="flex items-center">
                <button style={{borderRadius:'50px'}} className="h-8 w-full bg-blue-800 text-white text-sm font-semibold hover:bg-green-600 transition">
                    {t("APPLY_FILTER")}
                </button>
            </div>
            <div className="flex items-center">
                <button style={{borderRadius:'50px'}} className="border border-red-500 h-8 w-full bg-white text-red-500 text-sm font-semibold hover:bg-green-600 hover:text-white transition">
                    {t("CLEAR_FILTER")}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {orderList.map((order,index) => (
          <div key={index} className="col-span-1">
            {/* Main Card */}
            <div onClick={()=>handleClickOpen(order)} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img className="w-12 h-12 rounded" src={order?.bundle?.service?.company?.company_logo} alt={order?.bundle?.service?.company?.name} />
                <div>
                  <p className="text-sm font-medium">{t('ORDER_ID')}: #({order.id})</p>
                  <p className="text-xs text-gray-500">{order.rechargeble_account}</p>
                </div>
              </div>
              <button
                className="text-blue-600 text-sm"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                {expanded === order.id ? t("CLOSE") + " ▲" : t("SEE_MORE") + " ▼"}
              </button>
            </div>

          </div>
        ))}
      </div>

      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-80 text-left m-2">
          <div className={`border ${selectedOrder.status === 2 ? "border-red-500" : selectedOrder.status === 1 ? "border-green-500" : "border-yellow-500"} rounded-md flex flex-col gap-3`}>

              <div className="flex items-center justify-center mt-3">
                <img src={selectedOrder.status===0?'/images/img/Pending.png':selectedOrder.status===1?"/images/img/Success.png":"/images/img/Unsuccess.png"} alt="" className="w-[70px] h-[70px] object-contain"/>
              </div>

              <div className="flex flex-col gap-2 p-3">
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">{t("BUNDLE_TITLE")}</span>
                  <span className="text-black text-sm">{selectedOrder.bundle.bundle_title}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">{t("PHONE_NUMBER")}</span>
                  <span className="text-black text-sm">{selectedOrder.rechargeble_account}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">{t("VALIDITY")}</span>
                  <span className="text-black text-sm">{(selectedOrder?.bundle?.validity_type)?.toUpperCase()}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-gray-400 text-sm">{t("ORDER_ID")}</span>
                  <span className="text-black text-sm">{user_info?.currency?.code} {selectedOrder.bundle.selling_price}</span>
                </div>
              </div>

              <div className={`${selectedOrder.status === 2? "bg-red-100 border-red-500": selectedOrder.status === 1? "bg-green-100 border-green-500": "bg-yellow-100 border-yellow-500"} border rounded-lg p-3 flex items-center m-3`}>
                {/* Icon on the Left */}
                <img 
                  src={selectedOrder?.bundle.service.company.company_logo} 
                  alt="Logo" 
                  className="h-12 w-12 rounded-lg object-contain"
                />

                {/* Date & Time Section */}
                <div className="flex flex-col ml-3 w-full">
                  <div className="flex items-center justify-between w-full text-gray-600 text-sm">
                    <span className="font-medium">{t("DATE")}</span>
                    <span className="font-semibold text-gray-800">{new Date(selectedOrder?.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between w-full text-gray-600 text-sm mt-1">
                    <span className="font-medium">{t("TIME")}</span>
                    <span className="font-semibold text-gray-800">{new Date(selectedOrder?.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-row gap-3 justify-between items-center">
              <button className="rounded-[50px] bg-blue-700 m-3 px-5 py-2 w-[120px] text-white text-center">{t("SHARE")}</button>
              <button className="rounded-[50px] bg-white m-3 px-5 py-2 w-[120px] text-blue-700 text-center border-2 border-blue-700">{t("DOWNLOAD")}</button>
            </div>

            <div className="flex flex-row justify-center">
              <button onClick={handleClose} className="border-2 border-gray-500 w-full rounded-[50px] py-2 text-black font-bold">{t("CLOSE")}</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
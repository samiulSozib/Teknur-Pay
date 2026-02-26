import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from '../../redux/actions/locationAction'
import { placeOrder, confirmPin, clearMessages } from '../../redux/actions/rechargeAction'
import { getServices } from '../../redux/actions/serviceAction'
import { getBundles } from '../../redux/actions/bundleAction'
import Swal from "sweetalert2";
import Input from "../../components/form/input/InputField";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Dialpad, Search } from "../../icons";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"
import { Handbag, PhoneCall, Tag } from "lucide-react";

export default function BundlePage() {
  const [errorMessage, setErrorMessage] = useState("")
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const countryId = queryParams.get('countryId');
  const categoryId = queryParams.get('categoryId');
  const categoryName = queryParams.get('categoryName')
  const type = queryParams.get("type")

  const dispatch = useDispatch()
  const { serviceList } = useSelector((state) => state.serviceListReducer)
  const { bundleList, total_items, per_page, current_page, total_pages } = useSelector((state) => state.bundleListReducer)
  const { user_info } = useSelector((state) => state.auth)
  const [visibleRows, setVisibleRows] = useState({});
  const [validity, setValidity] = useState("");
  const [companyId, setCompanyId] = useState("")
  const [searchTag, setSearchTag] = useState("")
  const [number, setNumber] = useState("")
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pin, setPin] = useState("")
  const [phoneNumberLength, setPhoneNumberLength] = useState("")
  const [pinLength, setPinLength] = useState(4)
  const { message, error, loading, pinConfirmed, orderPlaced } = useSelector((state) => state.rechargeReducer);
  const { countries } = useSelector((state) => state.locationReducer)
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [from, setForm] = useState(0)
  const [to, setTo] = useState(0)

  // Add modal errors state
  const [modalErrors, setModalErrors] = useState({
    number: "",
    pin: ""
  });

  const isRtl =
    i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";

  // Load initial data once
  useEffect(() => {
    setIsLoading(true);
    dispatch(getServices(categoryId, countryId));
    dispatch(getCountries());

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, categoryId, countryId]);

  // Load bundles when filters change (excluding companyId from initial load)
  useEffect(() => {
    if (!isLoading) { // Only fetch bundles after initial load
      dispatch(getBundles(page, rowsPerPage, countryId, validity, companyId, categoryId, searchTag));
    }
  }, [validity, companyId, searchTag, page, rowsPerPage, countryId, categoryId, isLoading]);

  const categories = [
    { value: '', label: t('ALL') },
    { value: 'unlimited', label: t('UNLIMITED') },
    { value: 'monthly', label: t('MONTHLY') },
    { value: 'weekly', label: t('WEEKLY') },
    { value: 'daily', label: t('DAILY') },
    { value: 'hourly', label: t('HOURLY') },
    { value: 'nightly', label: t('NIGHTLY') },
  ];

  const filteredServiceList = useMemo(() => {
    if (type == "social") return serviceList;
    if ((number.length < 3 && number.length >= 0)) return serviceList; // Return all services if no companyId is set
    return serviceList.filter(service => service.company.id === companyId);
  }, [companyId, serviceList, number.length]);

  useEffect(() => {
    if (number.length >= 3) {
      const matchedService = serviceList.find((service) =>
        service.company.companycodes.some((code) =>
          number.startsWith(code.reserved_digit)
        )
      );
      console.log(matchedService)
      if (matchedService) {
        setCompanyId(matchedService?.company?.id);
      } else {
        setCompanyId("");
      }
    } else if (number.length < 3 && number.length > 0) {
      setCompanyId("")
    }
  }, [number, serviceList]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBundleSelect = (bundle) => {
    setSelectedBundle(bundle);
    setModalOpen(true);

    if (number.length >= 3) {
      const prefix = number.substring(0, 3);
      const matchedService = serviceList.find(service =>
        service.company.companycodes.some(code => prefix.startsWith(code.reserved_digit))
      );
      console.log(matchedService)
      if (!matchedService) {
        toast.error("Invalid Phone")
        return;
      }
    }

    if (number.length === parseInt(phoneNumberLength)) {
      setSelectedBundle(bundle);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    const selectedCountry = countries.find(country => country.id === parseInt(countryId));

    if (selectedCountry) {
      setPhoneNumberLength(selectedCountry.phone_number_length)
    }
  }, [dispatch, countries, phoneNumberLength, countryId]);

  // Add validation function
  const validateModalFields = () => {
    let newErrors = {};

    if (!number) {
      newErrors.number = t('PHONE_NUMBER_IS_REQUIRED');
    } else if (number.length !== parseInt(phoneNumberLength)) {
      newErrors.number = `Number should be ${phoneNumberLength} digits.`;
    }

    if (!pin) {
      newErrors.pin = t('PIN_IS_REQUIRED');
    } else if (pin.length !== 4) {
      newErrors.pin = "PIN must be 4 digits.";
    }

    setModalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update handleCloseModal to clear errors
  const handleCloseModal = () => {
    setModalOpen(false)
    setErrorMessage("")
    setNumber('')
    setPhoneNumberError("")
    setSelectedBundle(null)
    setPin("")
    setModalErrors({ number: "", pin: "" }) // Clear modal errors
  }

  // Update checkPIN function
  const checkPIN = () => {
    if (validateModalFields()) {
      dispatch(confirmPin(pin, selectedBundle.id, number))
    }
  }

  useEffect(() => {
    if (message || error) {
      if (orderPlaced) {
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
          confirmButtonText: t("CLOSE"),
          customClass: {
            popup: "rounded-xl p-6",
            confirmButton: "swal-confirm-button"
          },
          didOpen: () => {
            document.querySelector(".swal-confirm-button").style.border = "2px solid gray";
          }
        });

        setNumber('')
        dispatch(clearMessages())
        handleCloseModal()
      }
      if (error) {
        setErrorMessage(error)
        dispatch(clearMessages())
      }
    }
  }, [dispatch, orderPlaced, error, message])

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setNumber(value);

    if (value.length === 0) {
      setPhoneNumberError("");  // Clear error if input is empty
    } else if (value.length < phoneNumberLength) {
      setPhoneNumberError(`Number should be ${phoneNumberLength} digits.`);
    } else if (value.length === phoneNumberLength) {
      setPhoneNumberError("");  // Clear error if length is correct
    }
    else if (value.length >= 3) {
      let matchedService = null;
      let matchedPrefix = "";

      // Find the service that matches the longest possible prefix
      for (const service of serviceList) {
        if (service?.company?.companycodes) {
          for (const code of service.company.companycodes) {
            const reservedLength = code.reserved_digit?.length || 0;
            if (reservedLength > 0 && value.length >= reservedLength) {
              const prefix = value.substring(0, reservedLength);
              if (prefix === code.reserved_digit) {
                // Prefer the longest matching prefix
                if (!matchedService || reservedLength > matchedPrefix.length) {
                  matchedService = service;
                  matchedPrefix = code.reserved_digit;
                }
              }
            }
          }
        }
      }

      if (selectedBundle) {
        if (matchedService?.company?.id != selectedBundle?.service?.company_id) {
          console.log(matchedService?.company?.id != selectedBundle?.service?.company_id);
          setPhoneNumberError("Invalid Phone");
        } else {
          setPhoneNumberError("");
        }
      } else if (!matchedService) {
        setPhoneNumberError("Invalid Phone");
      } else {
        setPhoneNumberError("");
        setCompanyId(matchedService?.company?.id);
      }
    }
    else {
      setCompanyId("");
    }
  };

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

  const breadcrumbPaths = [
    { label: categoryName, href: '/' },
    { label: t("BUNDLE"), href: "" }
  ];

  const [errors, setErrors] = useState({
    reseller_name: "",
    contact_name: "",
    phone: "",
    email: "",
  });


  return (
    <>
      <PageMeta
        title=""
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* title section */}
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <div>
            <Breadcrumb paths={breadcrumbPaths} />
          </div>
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <Input
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                type="text"
                placeholder={t('SEARCH_HERE')}
                required
                inputProps={{
                  min: 0,
                }}
                className={`h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
              />
              <span className="absolute left-0 top-0 flex h-11 w-[46px] items-center justify-center border-r border-gray-200 dark:border-gray-800">
                <Search className="h-5 w-5" />
              </span>
            </div>

            <div className="relative">
              {type == "social" && (
                <Input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  type="number"
                  placeholder={t("ENTER_YOUR_NUMBER")}
                  required
                  inputProps={{
                    min: 0,
                  }}
                  className={`h-11 rounded-lg border border-gray-200' bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring focus:border-brand-300 focus:ring-brand-500/10'
                dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                />
              )}
              {type == "nonsocial" && (
                <Input
                  value={number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= phoneNumberLength) {
                      handleNumberChange(e);
                    }
                  }}
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
                  className={`h-11 rounded-lg border ${phoneNumberError ? 'border-red-500' : 'border-gray-200'} bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring ${phoneNumberError ? 'focus:border-red-500 focus:ring-red-500/10' : 'focus:border-brand-300 focus:ring-brand-500/10'
                    } dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                />
              )}

              <span className="absolute left-0 top-0 flex h-11 w-[46px] items-center justify-center border-r border-gray-200 dark:border-gray-800">
                <Dialpad className="h-6 w-6" />
              </span>
            </div>

            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredServiceList.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => setCompanyId(service?.company?.id)}
                    className={`flex-shrink-0 px-4 py-2 text-[16px] font-medium rounded-lg border transition-all
                    ${companyId === service?.company?.id
                        ? "bg-gradient-to-r from-purple-300 to-blue-300 text-gray-900 shadow-md"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <img
                      src={service?.company?.company_logo}
                      alt={service?.company?.company_name}
                      className="w-10 h-10 rounded-lg object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide flex gap-1">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setValidity(category.value)}
                className={`px-2 py-1 text-[12px] font-medium rounded-lg border transition-all
                            ${validity === category.value
                    ? "bg-gradient-to-r from-purple-300 to-blue-300 text-gray-900 shadow-md"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* bundle list with loading indicator */}
        <div className="col-span-12 space-y-6 xl:col-span-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
                <p className="text-gray-600">{t('loading_bundles')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-3">
                {bundleList.map((bundle, index) => (
                  <div key={index} onClick={() => handleBundleSelect(bundle)} className="flex flex-row items-center gap-3 p-3 rounded-2xl border border-gray-200 shadow-sm cursor-pointer">
                    <img className="w-[50px] h-[50px] rounded-lg object-contain" src={bundle.service.company.company_logo} alt="Company Logo" />

                    <div className="flex flex-col w-full">
                      <div className="flex flex-row justify-between items-center">
                        <span className="text-[12px] font-medium text-gray-800">{bundle?.bundle_title}</span>
                        <span className="text-[10px] text-purple-600 font-medium">{t(bundle?.validity_type)}</span>
                      </div>

                      <div className="flex flex-row justify-between items-center">
                        <span className="text-[12px] font-semibold text-red-600">{t('BUY')} : {bundle.buying_price} <span className="text-[10px]">{user_info?.currency?.code}</span></span>
                        <span className="text-[12px] font-semibold text-green-600">{t('SELL')} : {bundle.selling_price} <span className="text-[10px]">{user_info?.currency?.code}</span></span>

                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* pagination - only shows after bundles are loaded */}
              {bundleList.length > 0 && (
                <div className={`flex flex-wrap items-center justify-end px-4 py-3 bg-white border-t-2 rounded-lg shadow-md space-x-4 ${isRtl ? 'rtl' : ''}`}>
                  {/* {t("")} selection */}
                  <div className={` flex items-center ${isRtl ? 'pl-2' : 'pr-2'} text-gray-600`}>
                    <span className={`${isRtl ? 'pl-2' : 'pr-2'}`}></span>
                    <select
                      className="p-1 px-2 min-w-[60px] text-gray-700 border rounded-md"
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setPage(1); // Reset to first page when rows per page changes (recommended)
                      }}
                      dir="ltr"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Pagination info */}
                  <div className={`text-gray-700 ${isRtl ? 'mx-4' : 'mx-4'}`} dir={isRtl ? "rtl" : "ltr"}>
                    {isRtl ? `${total_items} من ${to}-${from}` : `${from}-${to} of ${total_items}`}
                  </div>

                  {/* Navigation buttons */}
                  <div className={`flex items-center ${isRtl ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <button
                      className={`p-2 ${page === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                      onClick={isRtl ? goToNextPage : goToPreviousPage}
                      disabled={isRtl ? page === total_pages : page === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        transform={isRtl ? "scale(-1,1)" : "none"}
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
                      className={`p-2 ${(isRtl ? page === total_pages : page === 1)
                        ? "text-gray-300"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                      onClick={isRtl ? goToPreviousPage : goToNextPage}
                      disabled={isRtl ? page === 1 : page === total_pages}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        transform={isRtl ? "scale(-1,1)" : "none"}
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
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl w-80">
            {/* Header with Company Info */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3">
              <div className="flex flex-col items-center">
                <img
                  className="h-14 w-14 object-cover rounded-lg border-2 border-white shadow bg-white p-2"
                  src={selectedBundle?.service?.company?.company_logo}
                  alt={selectedBundle?.service?.company?.company_name}
                />
                <h2 className="font-bold mt-1 text-white text-center text-base">
                  {selectedBundle?.service?.company?.company_name}
                </h2>
              </div>

              {/* Bundle Title Section */}
              <div className="mt-2 flex justify-between bg-white/20 backdrop-blur-sm rounded-md p-1.5 items-center text-white">
                <div className="text-white font-medium text-xs">{t('BUNDLE_TITLE')}</div>
                <div className="font-bold text-white bg-white/30 px-2 py-0.5 rounded-full text-xs">
                  {selectedBundle?.bundle_title}
                </div>
              </div>
            </div>

            {/* Buy/Sale Section */}
            <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-1.5 rounded-md">
                    <Handbag className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{t('BUY')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-bold text-gray-800">
                    {selectedBundle?.buying_price}
                  </span>
                  <span className="text-xs font-medium text-orange-500">{user_info?.currency?.code}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-1.5"></div>

              <div className="flex justify-between items-center pt-0.5">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-md">
                    <Tag className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{t('SELL')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-bold text-gray-800">{selectedBundle?.selling_price}</span>
                  <span className="text-xs font-medium text-purple-600">{user_info?.currency?.code}</span>
                </div>
              </div>
            </div>

            {/* Validity Section */}
            <div className="mt-3 bg-purple-50 rounded-lg p-2 border border-purple-100">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-gray-600">{t('VALIDITY')}:</span>
                <span className="text-xs font-semibold text-purple-700 bg-white px-3 py-1 rounded-full">
                  {t(selectedBundle?.validity_type)}
                </span>
              </div>
            </div>

            {/* Enter Number Field */}
            <div className="mt-3">
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  <div className="bg-blue-100 p-1 rounded-md">
                    <PhoneCall className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                </div>
                <input
                  type={type === "social" ? "number" : "text"}
                  inputMode={type === "social" ? "numeric" : "numeric"}
                  pattern={type === "social" ? undefined : "[0-9]*"}
                  placeholder={t('ENTER_YOUR_NUMBER')}
                  value={number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= phoneNumberLength) {
                      if (type === "social") {
                        setNumber(value);
                      } else {
                        handleNumberChange(e);
                      }
                      if (modalErrors.number) {
                        setModalErrors({ ...modalErrors, number: "" });
                      }
                    }
                  }}
                  className={`w-full p-2 pl-9 text-sm border rounded-lg focus:outline-none transition-all ${modalErrors.number || phoneNumberError
                    ? 'border-red-300 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                    }`}
                  maxLength={phoneNumberLength}
                />
              </div>
              {(modalErrors.number || phoneNumberError) && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="text-red-500 text-xs">●</span> {modalErrors.number || phoneNumberError}
                </p>
              )}
            </div>

            {/* PIN Field */}
            <div className="mt-3">
              <div className="flex justify-center">
                <div className="relative w-[160px]">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <div className="bg-green-100 p-1 rounded-md">
                      <svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 4) {
                        setPin(value);
                        if (modalErrors.pin) {
                          setModalErrors({ ...modalErrors, pin: "" });
                        }
                      }
                    }}
                    className={`w-full p-2 pl-9 text-center tracking-[6px] font-mono text-base border rounded-lg focus:outline-none transition-all ${modalErrors.pin
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                      }`}
                    maxLength={4}
                    placeholder="••••"
                  />
                </div>
              </div>
              {modalErrors.pin && (
                <p className="text-red-500 text-xs mt-1 text-center flex items-center justify-center gap-1">
                  <span className="text-red-500 text-xs">●</span> {modalErrors.pin}
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-xs flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Buttons */}
            {loading ? (
              <div className="flex justify-center py-3 mt-3">
                <div className="animate-spin h-6 w-6 border-2 border-gray-200 border-t-purple-600 rounded-full"></div>
              </div>
            ) : (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={checkPIN}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-lg font-medium text-sm hover:from-green-600 hover:to-green-700 transition-all shadow-sm shadow-green-500/30"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('CONFIRM')}
                  </span>
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:from-gray-200 hover:to-gray-300 transition-all border border-gray-300"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t('CANCEL')}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
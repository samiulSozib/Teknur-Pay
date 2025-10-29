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

export default function BundlePage() {
  const [errorMessage, setErrorMessage] = useState("")
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const countryId = queryParams.get('countryId');
  const categoryId = queryParams.get('categoryId');
  const categoryName=queryParams.get('categoryName')

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

  useEffect(() => {
    // Set loading state when component mounts
    setIsLoading(true);
    
    dispatch(getServices(categoryId, countryId))
    dispatch(getBundles(page, rowsPerPage, countryId, validity, companyId, categoryId, searchTag))
    dispatch(getCountries())
    
    // Set a 2-second timeout to hide the loading spinner
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, validity, companyId, searchTag, page, rowsPerPage, categoryId, countryId])

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

      if (matchedService) {
        setCompanyId(matchedService.company.id);
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

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrorMessage("")
    setNumber('')
    setPhoneNumberError("")
    setSelectedBundle(null)
    setPin("")
  }

  const checkPIN = () => {
    dispatch(confirmPin(pin, selectedBundle.id, number))
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
      const prefix = value.substring(0, 3);
      const matchedService = serviceList.find(service =>
        service.company.companycodes.some(code => prefix.startsWith(code.reserved_digit))
      );

      if (selectedBundle) {
        if (matchedService.company.id !== selectedBundle.service.company_id) {
          setPhoneNumberError("Invalid Phone")
        } else {
          setPhoneNumberError("")
        }
      }
      else if (!matchedService) {
        setPhoneNumberError("Invalid Phone")
      } else {
        setPhoneNumberError("");
        setCompanyId(matchedService.company.id);
      }
    } else {
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
              <span className="absolute left-0 top-0 flex h-11 w-[46px] items-center justify-center border-r border-gray-200 dark:border-gray-800">
                <Dialpad className="h-6 w-6" />
              </span>
            </div>

            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredServiceList.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => setCompanyId(service?.company.id)}
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
                        <span className="text-[10px] text-purple-600 font-medium">{bundle?.validity_type?.charAt(0).toUpperCase() + bundle?.validity_type?.slice(1)}</span>
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
                  <div className="text-gray-700 mx-4">{from}-{to} of {total_items}</div>

                  {/* Navigation buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 ${page === 1 ? "text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                      onClick={goToPreviousPage}
                      disabled={page === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      className={`p-2 ${page === total_pages ? "text-gray-300" : "text-gray-700 hover:text-gray-900"}`}
                      onClick={goToNextPage}
                      disabled={page === total_pages}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
          <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-80 text-left flex flex-col gap-4 ">
            <div className="flex gap-2 border border-gray-300 p-2 rounded-md">
              <img
                className="w-[70px] h-[70px] rounded-lg object-contain"
                src={selectedBundle?.service?.company?.company_logo}
                alt="Company Logo"
              />

              <div className="flex flex-col w-full">
                <div className="flex flex-row justify-between items-center">
                  <span className="text-[14px] font-medium text-gray-800">{t("BUNDLE_TITLE")}</span>
                  <span className="text-[12px] text-purple-600 font-medium">{selectedBundle?.bundle_title}</span>
                </div>

                <div className="flex flex-row justify-between items-center">
                  <span className="text-[14px] font-semibold">{t("SELL")}</span>
                  <span className="text-[12px] font-semibold text-gray-900">{selectedBundle?.selling_price} {user_info?.currency?.code}</span>
                </div>

                <div className="flex flex-row justify-between items-center">
                  <span className="text-[14px] font-medium text-gray-800">{t("VALIDITY")}</span>
                  <span className="text-[12px] text-purple-600 font-medium">{selectedBundle?.validity_type?.charAt(0).toUpperCase() + selectedBundle?.validity_type?.slice(1)}</span>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-400 rounded-md p-2 mt-2 flex flex-col items-center gap-3">
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <Dialpad className="h-[24px] w-[24px]" />
                </span>

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
                  error={Boolean(phoneNumberError)}
                  hint={phoneNumberError}
                  placeholder={t("ENTER_YOUR_NUMBER")}
                  helperText={phoneNumberError}
                  required
                  inputProps={{
                    min: 0,
                  }}
                  className={`rounded-lg border ${phoneNumberError ? 'border-red-500' : 'border-gray-200'} bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring ${phoneNumberError ? 'focus:border-red-500 focus:ring-red-500/10' : 'focus:border-brand-300 focus:ring-brand-500/10'} dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                />
              </div>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <Dialpad className="h-[24px] w-[24px]" />
                </span>

                <Input
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  type="password"
                  placeholder={t('ENTER_PIN')}
                  required
                  max={4}
                  className={`rounded-lg border border-gray-200'} bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
              </div>
            ) : (
              <div className="flex flex-row justify-between mt-2">
                <button disabled={!!phoneNumberError || !number} onClick={checkPIN} className="bg-green-500 rounded-[50px] px-3 py-2 w-[100px] text-white">{t('CONFIRM')}</button>
                <button onClick={handleCloseModal} className="bg-white text-red-500 px-3 py-2 w-[100px] border border-red-500 rounded-[50px]">{t("CANCEL")}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
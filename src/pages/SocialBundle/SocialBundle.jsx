import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from '../../redux/actions/locationAction'
import { placeOrder, confirmPin, clearMessages } from '../../redux/actions/rechargeAction'
import { getServices } from '../../redux/actions/serviceAction'
import { getBundles } from '../../redux/actions/bundleAction'
import Input from "../../components/form/input/InputField";
import { Dialpad } from "../../icons";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"
import { toast } from "react-toastify";
import { Handbag, PhoneCall, Tag, ArrowLeft } from "lucide-react";

export default function SocialBundle() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const countryId = queryParams.get('countryId');
  const categoryId = queryParams.get('categoryId');
  const companyId = queryParams.get('companyId')
  const [searchTag, setSearchTag] = useState("")
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pin, setPin] = useState("")
  const [number, setNumber] = useState("")
  const { error, orderPlaced, message, loading } = useSelector((state) => state.rechargeReducer);
  const { user_info } = useSelector((state) => state.auth)
  const [errorMessage, setErrorMessage] = useState("")
  const { countries } = useSelector((state) => state.locationReducer)
  const [phoneNumberLength, setPhoneNumberLength] = useState("")
  const [modalErrors, setModalErrors] = useState({
    number: "",
    pin: ""
  });

  const dispatch = useDispatch()
  const { bundleList, total_items, per_page, current_page, total_pages } = useSelector((state) => state.bundleListReducer)
  const { t } = useTranslation()
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [from, setForm] = useState(0)
  const [to, setTo] = useState(0)

  useEffect(() => {
    dispatch(getCountries());
  }, [])

  useEffect(() => {
    const selectedCountry = countries.find(country => country.id === parseInt(countryId));
    if (selectedCountry) {
      setPhoneNumberLength(selectedCountry.phone_number_length)
    }
  }, [countries, countryId]);

  useEffect(() => {
    dispatch(getBundles(page, rowsPerPage, countryId, "", companyId, categoryId, searchTag))
  }, [dispatch, searchTag, page, rowsPerPage])

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
  };

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrorMessage("")
    setNumber("")
    setPin("")
    setModalErrors({ number: "", pin: "" })
  }

  // Validation function
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

  const handleGoBack = () => {
    navigate(-1); // This goes back to the previous page
  };

  const breadcrumbPaths = [
    { label: t('SOCIAL_BUNDLE'), href: '/' }
  ];

  return (
    <>
      <PageMeta
        title="TekNur Pay"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* title section with back button */}
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
            </button>
            <Breadcrumb paths={breadcrumbPaths} />
          </div>
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          
          </div>
        </div>

        {/* bundle list  */}
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-3">
            {bundleList.map((bundle) => (
              <div key={bundle.id} onClick={() => handleBundleSelect(bundle)} className="cursor-pointer flex flex-row items-center gap-3 p-3 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <img className="w-[50px] h-[50px] rounded-lg object-contain" src={bundle.service.company.company_logo} alt="Company Logo" />

                <div className="flex flex-col w-full">
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-[12px] font-medium text-gray-800">{bundle?.bundle_title}</span>
                    <span className="text-[10px] text-purple-600 font-medium">{t(bundle.validity_type)}</span>
                  </div>

                  <div className="flex flex-row justify-between items-center">
                    <span className="text-[12px] font-semibold">{t('SELL')}:</span>
                    <span className="text-[12px] font-semibold text-gray-900">{bundle.selling_price} {user_info?.currency?.code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="flex flex-wrap items-center justify-end px-4 py-3 bg-white border-t-2 rounded-lg shadow-md space-x-4">
            {/* {t("")} selection */}
            <div className="flex items-center space-x-2 text-gray-600">
              <span></span>
              <select
                className="p-1 min-w-[60px] text-gray-700 border rounded-md"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
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
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-4 rounded-xl shadow-xl w-80">
        {/* Header with Company Info */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3">
            <div className="flex flex-col items-center">
                <img
                    className="h-12 w-12 object-cover rounded-lg border-2 border-white shadow"
                    src={selectedBundle?.service?.company?.company_logo}
                    alt={selectedBundle?.service?.company?.name}
                />
                <h2 className="font-bold mt-1 text-white text-center text-base">
                    {selectedBundle?.service?.company?.name || "Clash of Clans"}
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

        {/* Enter ID Field */}
        <div className="mt-3">
            <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <div className="bg-blue-100 p-1 rounded-md">
                        <PhoneCall className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                </div>
                <input
                    type="text"
                    placeholder={t('ENTER_ID')}
                    value={number}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= phoneNumberLength) {
                            setNumber(value);
                            if (modalErrors.number) {
                                setModalErrors({ ...modalErrors, number: "" });
                            }
                        }
                    }}
                    className={`w-full p-2 pl-9 text-sm border rounded-lg focus:outline-none transition-all ${modalErrors.number
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        }`}
                />
            </div>
            {modalErrors.number && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="text-red-500 text-xs">●</span> {modalErrors.number}
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
                        Confirmation
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
                        Cancel
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
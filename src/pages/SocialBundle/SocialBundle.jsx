import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {getCountries} from '../../redux/actions/locationAction'
import {placeOrder,confirmPin,clearMessages} from '../../redux/actions/rechargeAction'
import {getServices} from '../../redux/actions/serviceAction'
import {getBundles} from '../../redux/actions/bundleAction'
import Input from "../../components/form/input/InputField";
import { Dialpad } from "../../icons";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"



export default function SocialBundle() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const countryId = queryParams.get('countryId');
    const categoryId = queryParams.get('categoryId');
    const companyId=queryParams.get('companyId')
    const [searchTag,setSearchTag]=useState("")

    const [selectedBundle, setSelectedBundle] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [pin,setPin]=useState("")
    const [number,setNumber]=useState("")
    const { error,orderPlaced,message,loading } = useSelector((state) => state.rechargeReducer);
    const {user_info}=useSelector((state)=>state.auth)
    const [errorMessage,setErrorMessage]=useState("")

    const dispatch=useDispatch()
    const {bundleList,total_items,per_page,current_page,total_pages}=useSelector((state)=>state.bundleListReducer)
    const [visibleRows, setVisibleRows] = useState({});
    const {t}=useTranslation()
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [from,setForm]=useState(0)
    const [to,setTo]=useState(0)
    
    

      useEffect(()=>{
        dispatch(getBundles(page,rowsPerPage,countryId,"",companyId,categoryId,searchTag))
      },[dispatch,searchTag,page,rowsPerPage])


      const handleChangePage = (_, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
    
      const handleBundleSelect = (bundle) => {
        //if(number.length===0){
          //toast.error(t('ENTER_YOUR_NUMBER'))
          //return;
        //}
        //console.log(bundle)
          setSelectedBundle(bundle);
          setModalOpen(true);
        
      };

      const handleCloseModal=()=>{
        setModalOpen(false)
        setErrorMessage("")
        setNumber("")
      }
    
      const checkPIN=()=>{
        dispatch(confirmPin(pin,selectedBundle.id,number))
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
            confirmButtonText: t("CLOSE"),
            customClass: {
              popup: "rounded-xl p-6",
              confirmButton: "swal-confirm-button"
            },
            didOpen: () => {
              document.querySelector(".swal-confirm-button").style.border = "2px solid gray";
            }
          });
          dispatch(clearMessages())
          handleCloseModal()
        }
        if(error){
          setErrorMessage(error)
          dispatch(clearMessages())
        }
        }
      },[dispatch,orderPlaced,error,message])

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
        { label: t("PRODUCT_PACKAGE"), href: "/product-and-packages" },
        {label:t('SOCIAL_PACKAGES'),href:'/social'},
        {label:t('SOCIAL_BUNDLE'),href:'/social-bundle'}
      ];

  return (
    <>
      <PageMeta
        title="TekNur Pay"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

            <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <Dialpad className="h-[24px] w-[24px]" />
                

            </span>

            <Input
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                placeholder={t('SEARCH_HERE')}
                required
                inputProps={{
                    min: 0,
                }}
                className={`h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring focus:border-brand-300 focus:ring-brand-500/10'
                 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
            />
            </div>



            <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <Dialpad className="h-[24px] w-[24px]" />
                

            </span>

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
            </div>



        </div>

            
        </div>

        {/* bundle list  */}
        <div className="col-span-12 space-y-6 xl:col-span-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-3">


            {bundleList.map((bundle)=>(
            <div key={bundle.id} onClick={()=>handleBundleSelect(bundle)} className="cursor pointer flex flex-row items-center gap-3 p-3 rounded-2xl border border-gray-200 shadow-sm">
                <img className="w-[50px] h-[50px] rounded-lg object-contain" src={bundle.service.company.company_logo} alt="Company Logo" />

                <div className="flex flex-col w-full">
                    <div className="flex flex-row justify-between items-center">
                        <span className="text-[12px] font-medium text-gray-800">{bundle?.bundle_title}</span>
                        <span className="text-[10px] text-purple-600 font-medium">{bundle.validity_type?.toUpperCase() }</span>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                        <span className="text-[12px] font-semibold">Sale:</span>
                        <span className="text-[12px] font-semibold text-gray-900">{bundle.selling_price} {user_info?.currency?.code}</span>
                    </div>
                </div>
            </div>

            ))}
               
            </div>

            {/* pagination */}
            <div className="flex flex-wrap items-center justify-end px-4 py-3 bg-white border-t-2 rounded-lg shadow-md space-x-4">
              {/* Rows per page selection */}
              <div className="flex items-center space-x-2 text-gray-600">
                <span>Rows per page:</span>
                <select className="p-1 min-w-[60px] text-gray-700">
                  <option>5</option>
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

        {/* pagination */}

        </div>


        
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-80 text-left flex flex-col gap-4">
          
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={number}
                onChange={(e) =>setNumber(e.target.value)}
                placeholder={t("ENTER_YOUR_NUMBER")}
                required
                inputProps={{
                  min: 0,
                }}
                className={`rounded-lg border border-gray-200'bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
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
                className={`rounded-lg border border-gray-200' bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
              />
              {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            </div>
          </div>

          {loading?(
            <div className="flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          
          ):(
          <div className="flex flex-row justify-between mt-2">
            <button disabled={number.length<3} onClick={checkPIN} className="bg-green-500 rounded-[50px] px-3 py-2 w-[100px] text-white">{t('CONFIRM')}</button>
            <button onClick={handleCloseModal} className="bg-white text-red-500 px-3 py-2 w-[100px] border border-red-500 rounded-[50px]">{t("CANCEL")}</button>
          </div>
        )}
      
        </div>
      </div>
      
        )}
    </>
  );
}

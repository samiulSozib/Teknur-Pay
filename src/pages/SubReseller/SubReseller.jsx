import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getSubReseller, getSingleSubReseller, changeSubResellerStatus, deleteSubReseller } from '../../redux/actions/subResellerAction';
import { ChangeBalance, CloseEye, CloseIcon, Deactive, Delete, Edit, SetPassword } from "../../icons";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"




export default function SubReseller() {
    const dispatch = useDispatch();
    const { subResellerList, total_items, singleSubReseller,per_page,current_page,total_pages } = useSelector((state) => state.subResellerListReducer);
    const { user_info } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [searchTag, setSearchTag] = useState("");
  
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [isEditing,setIsEditing]=useState(false)
    const [selectedSubReseller, setSelectedSubReseller] = useState(null);
    const [view,setView]=useState(false)
    const [selectedDetails,setSelectedDetails]=useState(null)
    const {t}=useTranslation()
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [from,setForm]=useState(0)
    const [to,setTo]=useState(0)
 

    useEffect(() => {
        dispatch(getSubReseller(page,rowsPerPage));
      }, [dispatch, page, rowsPerPage]);

      useEffect(()=>{
        console.log(singleSubReseller)
      },[dispatch,singleSubReseller])

      const addSubReseller=()=>{
        navigate('/add-sub-reseller')
      }

      const handleConfirmStatusChange = () => {
        setIsEditing(false)
      
        Swal.fire({
          title: selectedSubReseller.status === 1?t('ARE_YOU_SURE_YOU_WANT_TO_DE_ACTIVE_THIS_RESELLER'):t('ARE_YOU_SURE_YOU_WANT_TO_ACTIVE_THIS_RESELLER'),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText:  t("YES"),
          cancelButtonText: t("CANCEL"),
        }).then((result) => {
          if (result.isConfirmed) {
            handleChangeStatusSubReseller(); // Execute the status change if confirmed
          }
        });
      };

      const handleChangeStatusSubReseller = async () => {
        await dispatch(changeSubResellerStatus(selectedSubReseller.id));
      };

      const handleDeleteConfirmation = () => {
        setIsEditing(false)
        Swal.fire({
          title: t('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_RESELLER'),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText:  t("YES"),
          cancelButtonText:  t("CANCEL"),
        }).then((result) => {
          if (result.isConfirmed) {
            handleDeleteSubReseller(); 
          }
        });
      };

      const handleDeleteSubReseller = async () => {
        await dispatch(deleteSubReseller(selectedSubReseller.id));
      };

      const handleSingleSubReseller=(resellerId)=>{
        dispatch(getSingleSubReseller(resellerId))
        setView(true)
      }

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
        { label: t('SUB_RESELLER'), href: "/sub-reseller" },
      ];


  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Phone Number Input */}
            <div className="">
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
            <div className="">
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
            <div className="flex items-center justify-items-end">
            <button onClick={addSubReseller} style={{borderRadius:'50px'}} className="h-11 w-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition">
                {t("ADD_SUB_RESELLER")}
            </button>
            </div>
        </div>
        </div>

      <div className="border rounded-md bg-[#EEF4FF] col-span-12 space-y-6 xl:col-span-12 p-2">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {subResellerList.map((sub_reseller) => (
            <>
              {/* Main Card */}
              <div key={sub_reseller.id} className="col-span-1 mb-3 border-[2px] border-blue-300 rounded-md">
                <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img className="w-12 h-12" src={sub_reseller.profile_image_url} alt="" />
                    <div>
                      <p className="text-sm font-medium">{sub_reseller.reseller_name}</p>
                      <p className="text-xs text-gray-500">{sub_reseller.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CloseEye onClick={()=>handleSingleSubReseller(sub_reseller.id)} className="cursor-pointer h-8 w-8"/>
                    <Edit onClick={()=>{setSelectedSubReseller(sub_reseller),setIsEditing(true)}} className="cursor-pointer h-8 w-8"/>
                  </div>
                  
                  
                </div>
              </div>

              
            </>
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
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-80 text-left m-2">
          <div className="flex flex-col divide-y divide-gray-300">
            {/* Deactivate Option */}
            <button 
              onClick={handleConfirmStatusChange} 
              className={`flex items-center gap-3 py-4 px-6 rounded-lg transition-all duration-300 
                  ${selectedSubReseller.status===1 ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-300 text-white hover:bg-red-300"}
              `}
          >
              <span className="text-lg">
                  <Deactive className="h-[24px] w-[24px]" />
              </span>
              <span className="text-sm font-medium">
                  {selectedSubReseller.status===1 ? "Active" : "Deactivated"}
              </span>
          </button>

            {/* Change Balance Option */}
            <button onClick={()=>navigate("/sub-reseller-change-balance",{state:{reseller:selectedSubReseller}})} className="flex items-center gap-3 py-4 px-6 text-gray-700 hover:bg-gray-100">
              <span className="text-lg"><ChangeBalance className="h-[24px] w-[24px]"/></span>
              <span className="text-sm font-medium">{t("CHANGE_BALANCE")}</span>
            </button>

            {/* Set Password Option */}
            <button onClick={()=>navigate("/sub-reseller-set-password",{state:{reseller:selectedSubReseller}})} className="flex items-center gap-3 py-4 px-6 text-gray-700 hover:bg-gray-100">
              <span className="text-lg"><SetPassword className="h-[24px] w-[24px]"/></span>
              <span className="text-sm font-medium">{t('SET_PASSWORD')}</span>
            </button>

            {/* Delete Option */}
            <button onClick={handleDeleteConfirmation} className="flex items-center gap-3 py-4 px-6 text-gray-700 hover:bg-gray-100">
              <span className="text-lg"><Delete className="h-[24px] w-[24px]"/></span>
              <span className="text-sm font-medium">{t("DELETE")}</span>
            </button>
            
          </div>

        {/* Close Button */}
        <button
          onClick={()=>setIsEditing(false)}
          className="w-full mt-4 py-3 text-center text-gray-700 font-medium bg-white border-2 rounded-[50px] hover:bg-gray-200"
        >
          Close
        </button>
        </div>
        </div>
      )}

      {view && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-2 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[90%] lg:w-[60%] text-left">
            <div className="rounded-md border border-gray-400 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="flex flex-col w-full">
                  <div className="text-gray-600 text-sm w-full flex justify-center">
                    <span className="font-medium">{t('TODAY_ORDER')}</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-1 w-full flex justify-center bg-gray-200 rounded-md py-2">
                    <span className="font-semibold text-gray-800">{singleSubReseller?.reseller?.today_orders}</span>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="text-gray-600 text-sm w-full flex justify-center">
                    <span className="font-medium">{t('TOTAL_ORDER')}</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-1 w-full flex justify-center bg-gray-200 rounded-md py-2">
                    <span className="font-semibold text-gray-800">{singleSubReseller?.reseller?.total_orders}</span>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="text-gray-600 text-sm w-full flex justify-center">
                    <span className="font-medium">{t('TODAY_SALE')}</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-1 w-full flex justify-center bg-gray-200 rounded-md py-2">
                    <span className="font-semibold text-gray-800">{singleSubReseller?.today_sale}</span>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="text-gray-600 text-sm w-full flex justify-center">
                    <span className="font-medium">{t('TOTAL_SALE')}</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-1 w-full flex justify-center bg-gray-200 rounded-md py-2">
                    <span className="font-semibold text-gray-800">{singleSubReseller?.total_sale}</span>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="text-gray-600 text-sm w-full flex justify-center">
                    <span className="font-medium">{t('TODAY_PROFIT')}</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-1 w-full flex justify-center bg-gray-200 rounded-md py-2">
                    <span className="font-semibold text-gray-800">{singleSubReseller?.today_profit}</span>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="text-gray-600 text-sm w-full flex justify-center">
                    <span className="font-medium">{t('TOTAL_PROFIT')}</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-1 w-full flex justify-center bg-gray-200 rounded-md py-2">
                    <span className="font-semibold text-gray-800">{singleSubReseller?.total_profit}</span>
                  </div>
                </div>

              </div>
                
                <div className="flex flex-row justify-between mt-3 bg-gray-200 rounded-md py-2 px-1">
                  <h1>{t('ACCOUNT_BALANCE')}</h1>
                  <h1>{singleSubReseller?.reseller?.balance} {user_info.currency.code}</h1>
                </div>

            </div>
          <button
            onClick={()=>setView(false)}
            className="w-full mt-4 py-3 text-center text-gray-700 font-medium bg-white border-2 rounded-[50px] hover:bg-gray-200"
          >
            {t("CLOSE")}
          </button>
          </div>
        </div>
       )}
    </div>
  );
}
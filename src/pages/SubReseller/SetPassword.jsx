import React, { useEffect, useState } from 'react';
import { CloseEye } from '../../icons'; // Ensure this is correctly imported
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify'; // Correct import for ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Input from '../../components/form/input/InputField';
import { setSubResellerPassword } from '../../redux/actions/subResellerAction';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"


export const SetPassword = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps"; 

    const location=useLocation()
    const reseller=location.state?.reseller 
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState(null);




  

    const handleSetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")

          setValidationError("Passwords do not match");
          return;
        }
        if (newPassword === "") {
          setValidationError("Please enter a password");
          return;
        }
        setValidationError(null);
        await dispatch(setSubResellerPassword(reseller.id, newPassword, confirmPassword));
       
      };

      const breadcrumbPaths = [
        { label: t('SUB_RESELLER'), href: "/sub-reseller" },
        {label:t('SET_PASSWORD'),href:"/"}
      ];

    return (
        <div className="col-span-12 space-y-6 xl:col-span-12">
                <Breadcrumb paths={breadcrumbPaths} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
                <div>
                    <form>
                        <div className="relative">
                            <Input
                                type="password"
                                value={newPassword}
                                error={validationError}
                                hint={validationError}
                                onChange={(e) => setNewPassword(e.target.value)} 
                                placeholder={t("ENTER_NEW_PASSWORD")}
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/80">
                                <CloseEye />
                            </span>
                        </div>
                    </form>
                </div>

                <div>
                    <form>
                        <div className="relative">
                            <Input
                                value={confirmPassword}
                                error={validationError}
                                hint={validationError}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                placeholder={t('CONFIRM_PASSWORD')}
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center">
                    <button 
                        onClick={handleSetPassword} 
                        style={{ borderRadius: '50px' }} 
                        className="h-11 w-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
                    >
                        {t("CONFIRM_SUBMIT")}
                    </button>
                </div>
            </div>

            {/* Toast container */}
            <ToastContainer position="bottom-center" // Adjust the position as needed
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={isRtl}
                pauseOnFocusLoss
                draggable
                pauseOnHover/>
        </div>
    );
};

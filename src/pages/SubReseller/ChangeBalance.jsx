import React, { useState } from 'react';
import { CloseEye } from '../../icons'; // Ensure this is correctly imported
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ToastContainer, toast } from 'react-toastify'; // Correct import for ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Input from '../../components/form/input/InputField';
import { changeSubResellerBalance, setSubResellerPassword } from '../../redux/actions/subResellerAction';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"


export const ChangeBalance = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps"; 
    const { user_info } = useSelector((state) => state.auth);


    const location = useLocation();
    const reseller = location.state?.reseller;

    const [newBalance, setNewBalance] = useState("");
    const [balanceError, setBalanceError] = useState(null);
    const [transactionType, setTransactionType] = useState("credit"); // Default to "credit"

    const handleChangeBalance = async () => {
        if (!newBalance || isNaN(newBalance)) {
          setBalanceError("Please enter a valid balance");
          return;
        }
        if (transactionType === "") {
          setBalanceError("Please select status");
          return;
        }
        setBalanceError(null);
        await dispatch(changeSubResellerBalance(reseller.id, parseFloat(newBalance), transactionType));
    
        if (!balanceError) {
        }
      };

      const breadcrumbPaths = [
        { label: t('SUB_RESELLER'), href: "/sub-reseller" },
        {label: t('CHANGE_BALANCE'),href:"/"}
      ];

    return (
        <div className="col-span-12 space-y-6 xl:col-span-12">
                <Breadcrumb paths={breadcrumbPaths} />

            <div 
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg transition-all duration-300 ${
                    transactionType === "credit" ? "bg-green-100" : "bg-red-100"
                }`}
            >
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="transactionType"
                            value="credit"
                            checked={transactionType === "credit"}
                            onChange={() => setTransactionType("credit")}
                            className="form-radio text-blue-500"
                        />
                        <span>{t("CREDIT")}</span>
                    </label>
                </div>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="transactionType"
                            value="debit"
                            checked={transactionType === "debit"}
                            onChange={() => setTransactionType("debit")}
                            className="form-radio text-red-500"
                        />
                        <span>{t("DEBIT")}</span>
                    </label>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Password Input */}
                <div>
                    <form>
                        <div className="relative">
                            <Input
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={newBalance}
                                error={balanceError}
                                hint={balanceError}
                                onChange={(e) => setNewBalance(e.target.value)} 
                                placeholder={t("ENTER_TRANSFER_AMOUNT")}
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/80">
                                <CloseEye />
                            </span>
                        </div>
                    </form>
                </div>

                {/* Confirm Password Input */}
                <div>
                    <form>
                        <div className="relative">
                            <Input
                                value={user_info?.currency?.code}
                                type="text"
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>
                    </form>
                </div>

                {/* Transaction Type Selection */}
                

                {/* Submit Button */}
                <div className="flex items-center">
                    <button 
                        onClick={handleChangeBalance} 
                        style={{ borderRadius: '50px' }} 
                        className="h-11 w-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
                    >
                        {t("CONFIRM_SUBMIT")}
                    </button>
                </div>
            </div>

            {/* Toast container */}
            <ToastContainer 
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={isRtl}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { CloseEye } from '../../icons'; // Ensure this is correctly imported
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { dashboardData, changePIN } from '../../redux/actions/dashboardAction';
import { ToastContainer, toast } from 'react-toastify'; // Correct import for ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export const ChangePassword = () => {
    const dispatch = useDispatch();
    const { information } = useSelector((state) => state.dashboardReducer);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps"; 

    const [openDialog, setOpenDialog] = useState(false);
    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmNewPin, setConfirmNewPin] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(dashboardData());
    }, [dispatch]);

    const handlePinSubmit = () => {
        if (currentPin === "" || newPin === "" || confirmNewPin === "") {
            toast.error("Enter your PIN in all fields"); // Show error toast
            return;
        }
        if (newPin !== confirmNewPin) {
            toast.error("New PIN and confirm PIN must match"); // Show error toast
            return;
        }
        dispatch(changePIN(currentPin, newPin));
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div className="col-span-12 space-y-6 xl:col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                    <form>
                        <div className="relative">
                            <input
                                value={currentPin}
                                onChange={(e) => setCurrentPin(e.target.value)}
                                type="password"
                                placeholder={t("CURRENT_PIN")}
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
                            <input
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value)}
                                type="password"
                                placeholder={t("NEW_PIN")}
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
                            <input
                                value={confirmNewPin}
                                onChange={(e) => setConfirmNewPin(e.target.value)}
                                type="password"
                                placeholder={t("CONFIRM_NEW_PIN")}
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center">
                    <button 
                        onClick={handlePinSubmit} 
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

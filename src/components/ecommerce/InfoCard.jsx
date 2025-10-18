import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { dashboardData } from "../../redux/actions/dashboardAction";
import { useTranslation } from "react-i18next";
import { CalenderIcon, GroupIcon } from "../../icons";

export default function InfoCard() {
  const dispatch = useDispatch();
  const { information } = useSelector((state) => state.dashboardReducer);
  const { user_info } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(dashboardData());
  }, [dispatch]);

  const cardItems = [
    { label: t("BALANCE"), value: information.balance },
    { label: t("LOAN_BALANCE"), value: information.loan_balance },
    { label: t("SALE"), value: information.today_sale },
    { label: t("PROFIT"), value: information.today_profit },
  ];

  // 🗓️ Get today’s date (formatted as YYYY-MM-DD)
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


  return (
    <>
      {/* 🌐 Mobile View — show only first card */}
      <div className="block sm:hidden border border-gray p-2 rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-black-500 dark:text-gray-400">{t('FINANCIAL_REPORT')}</span>
          <span className="text-[14px] text-blue-500 dark:text-gray-400" onClick={() => setShowModal(true)}>{t('SEE_ALL')}</span>
        </div>
        <div
          className="h-[100px] flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-white/[0.03] cursor-pointer transition hover:shadow-md"
          onClick={() => setShowModal(true)}
        >
          {/* Left: Icon + Label */}

          <div className="flex items-center space-x-3">

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-white/[0.1]">
              <GroupIcon />
            </div>
            <span className="text-[14px] text-gray-500 dark:text-gray-400">
              {cardItems[0].label}
            </span>
          </div>

          {/* Right: Value */}
          <div className="text-right">
            <span className="font-bold text-gray-800 text-md dark:text-white/90">
              {cardItems[0].value} {user_info?.currency?.code}
            </span>
          </div>
        </div>
      </div>

      {/* 💻 Desktop View — show all cards inline */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cardItems.map((item, idx) => (
          <div
            key={idx}
            className="h-[100px] flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            {/* Left: Icon + Label */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-white/[0.1]">
                <GroupIcon />
              </div>
              <span className="text-[14px] text-gray-500 dark:text-gray-400">
                {item.label}
              </span>
            </div>

            {/* Right: Value */}
            <div className="text-right">
              <span className="font-bold text-gray-800 text-md dark:text-white/90">
                {item.value} {user_info?.currency?.code}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 📱 Mobile Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-11/12 max-w-md shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* Modal Title */}
            <h3 className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              {t("ACCOUNT_SUMMARY")}
            </h3>

            {/* 📅 Additional Info Card */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.05] p-2 space-y-2 mb-5">
              {/* Row 1 — Date Input */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={today}
                  disabled
                  className="w-full bg-gray-100 dark:bg-white/[0.1] text-gray-700 dark:text-gray-200 
               px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CalenderIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>



              {/* Row 2 — Currency Info */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("CURRENCY")}
                </span>
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-200 border rounded-md px-2">
                  {user_info?.currency?.code || "N/A"}
                </span>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {cardItems.map((item, idx) => (
                <div
                  key={idx}
                  className="h-[60px] flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 dark:border-gray-800 dark:bg-white/[0.05]"
                >
                  {/* Left: Icon + Label */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-white/[0.1]">
                      <GroupIcon />
                    </div>
                    <span className="text-[14px] text-gray-500 dark:text-gray-400">
                      {item.label}
                    </span>
                  </div>

                  {/* Right: Value */}
                  <div className="text-right">
                    <span className="font-bold text-gray-800 text-md dark:text-white/90">
                      {item.value} {user_info?.currency?.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>




          </div>
        </div>
      )}
    </>
  );
}

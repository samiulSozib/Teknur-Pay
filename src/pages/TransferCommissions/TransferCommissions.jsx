import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransferCommission,
  getTransferCommissions,
} from "../../redux/actions/transferCommissionAction";
import Select from "react-select";
import Swal from "sweetalert2";

export const TransferCommissions = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
  });

  useEffect(() => {
    dispatch(getTransferCommissions());
  }, [dispatch]);

  const { transferCommissionList, loading } = useSelector(
    (state) => state.transferCommissionReducer
  );
  const { user_info } = useSelector((state) => state.auth);

  const breadcrumbPaths = [
    { label: t("HOME"), href: "/dashboard" },
    { label: t("TRANSFER_COMMISSIONS"), href: "/transfer-commissions" },
  ];

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData({
      amount: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseAllBalance = () => {
    const totalBalance = parseFloat(user_info?.reseller?.total_earning_balance) || 0;
    if (totalBalance > 0) {
      setFormData((prev) => ({
        ...prev,
        amount: totalBalance.toString(),
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const totalBalance = parseFloat(user_info?.reseller?.total_earning_balance) || 0;
      const requestedAmount = parseFloat(formData.amount);

      if (requestedAmount > totalBalance) {
        Swal.fire({
          title: t("ERROR"),
          text: t("AMOUNT_EXCEEDS_BALANCE"),
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      const result = await dispatch(addTransferCommission(formData.amount));

      if (result?.error) {
        throw new Error(result.error);
      }

      Swal.fire({
        title: t("SUCCESS"),
        text: t("TRANSFER_COMMISSION_ADDED_SUCCESSFULLY"),
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      handleCloseDialog();
      dispatch(getTransferCommissions()); // Refresh the list
    } catch (error) {
      Swal.fire({
        title: t("ERROR"),
        text: error?.message || t("FAILED_TO_ADD_TRANSFER_COMMISSION"),
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {t("TRANSFER_COMMISSIONS")}
          </h2>
          <button
            onClick={handleOpenDialog}
            style={{ borderRadius: "50px" }}
            className="h-11 w-48 bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
          >
            {t("ADD_NEW")}
          </button>
        </div>
      </div>

      {/* Transfer Commission List */}
      <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {transferCommissionList.map((transfer) => (
              <div
                key={transfer.id}
                className="col-span-1 mb-1 border border-blue-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="bg-white rounded-lg p-1 flex justify-between items-center gap-1">
                  {/* Left side - Company logo and details */}
                  <div className="flex items-center gap-4 flex-grow">


                    {/* Details container with better spacing */}
                    <div className=" p-2 flex-grow">
                      <div className="grid gap-2">
                        {/* a mount */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500  tracking-wide">
                            {t("AMOUNT")}
                          </span>
                          <p className="text-sm font-semibold text-blue-600">
                            {transfer.amount}
                          </p>
                        </div>

                        {/* status */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500  tracking-wide">
                            {t("STATUS")}
                          </span>
                          <p className="text-sm font-medium text-gray-700">
                            {transfer.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex-shrink-0">
                    {/* <button
                    onClick={() => {
                      setSelectedSubReseller(sellingPrice);
                      setIsEditing(true);
                    }}
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                    aria-label="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Transfer Commission Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[40%] text-left">
            <h2 className="text-xl font-semibold mb-4">
              {t("REQUEST_TRANSFER_COMMISSION")}
            </h2>

            <div className="rounded-md border border-gray-300 p-5 space-y-4">
              {/* Amount Input */}
              <div className="flex flex-col w-full">
                <label className="text-gray-700 text-sm mb-2 font-medium flex items-center justify-between">
                  <span>{t("AMOUNT")}</span>
                  <span className="text-xs text-gray-500">
                    {t("AVAILABLE_BALANCE")}
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Amount Input */}
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("ENTER_AMOUNT")}
                    min="1"
                    max={user_info?.reseller?.total_earning_balance || 0}
                  />

                 

                  {/* Total Earning Balance (Non-editable box) */}
                  <div className="min-w-[140px] border border-gray-300 bg-gray-50 rounded-md px-3 py-2 flex items-center justify-center text-gray-700 font-medium">
                    {user_info?.reseller?.total_earning_balance ?? "0.00"} <span className="text-bold font-bold cursor-pointer" onClick={handleUseAllBalance}>{t("USE_ALL")}</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-[50px] hover:bg-gray-100 transition"
              >
                {t("CANCEL")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.amount}
                className="px-4 py-2 text-white font-medium bg-green-500 rounded-[50px] hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                {t("SUBMIT_REQUEST")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
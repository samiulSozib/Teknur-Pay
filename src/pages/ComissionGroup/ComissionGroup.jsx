import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  addSellingPrice,
  getSellingPrices,
} from "../../redux/actions/sellingPriceAction";
import {
  getCommissionGroups,
  addCommissionGroup,
} from "../../redux/actions/commissionGroupAction";
import { Edit } from "../../icons";
import { getServices } from "../../redux/actions/serviceAction";
import { serviceCategories } from "../../redux/actions/serviceCategoriesAction";
import Select from "react-select";
import Swal from "sweetalert2";
import { getHawalaOrders } from "../../redux/actions/hawalaOrderAction";

export const CommissionGroup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    commissionType: "",
    groupName: "",
    amount: "",
  });

  // Sample dropdown options
  const commissionTypes = [
    { value: "percentage", label: t("PERCENTAGE") },
    { value: "fixed", label: t("FIXED_AMOUNT") },
  ];

  useEffect(() => {
    dispatch(getCommissionGroups());
    dispatch(getHawalaOrders())
  }, [dispatch]);



  


  const { commissionGroupList } = useSelector(
    (state) => state.commissionGroupReducer
  );

  const breadcrumbPaths = [
    { label: t("MENU.COMMISSION_GROUP"), href: "/commission-groups" },
  ];

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData({
      commissionType: "",
      groupName: "",
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

  const handleSubmit = async () => {
    try {
      const result = await dispatch(addCommissionGroup(formData));

      // Check for error returned from thunk (if using rejectWithValue or custom return)
      if (result?.error) {
        throw new Error(result.error);
      }

      // ✅ Success alert
      Swal.fire({
        title: t("SUCCESS"),
        text: t("COMMISSION_GROUP_ADDED_SUCCESSFULLY"),
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      handleCloseDialog();
    } catch (error) {
      // ❌ Error alert
      Swal.fire({
        title: t("ERROR"),
        text: error?.message || t("FAILED_TO_ADD_COMMISSION_GROUP"),
        icon: "error",
        confirmButtonColor: "#ef4444", // red-500
      });
    }
  };



  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="border rounded-md bg-white col-span-12 space-y-6 xl:col-span-12 p-1">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenDialog}
              style={{ borderRadius: "50px" }}
              className="h-11 w-40 bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
            >
              {t("ADD_COMMISSION_GROUP")}
            </button>
          </div>
        </div>
      </div>

      {/* COMMISSION GROUP List */}
      <div className="border rounded-md bg-[#EEF4FF] col-span-12 space-y-6 xl:col-span-12 p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {commissionGroupList.map((group) => (
            <div
              key={group.id}
              className="col-span-1 mb-1 border border-blue-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="bg-white rounded-lg p-1 flex justify-between items-center gap-1">
                {/* Left side - Company logo and details */}
                <div className="flex items-center gap-4 flex-grow">
                  {/* Company logo with better styling */}

                  {/* Details container with better spacing */}
                  <div className="border border-gray-200 rounded-md p-2 flex-grow">
                    <div className="grid gap-2">
                      {/* group name row */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t("GROUP_NAME")}
                        </span>
                        <p className="text-sm font-medium text-gray-700">
                          {group.group_name}
                        </p>
                      </div>

                      {/* Commission type row */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t("COMMISSION_TYPE")}
                        </span>
                        <p className="text-sm font-semibold text-blue-600">
                          {group.commission_type}
                        </p>
                      </div>

                      {/* Amount row */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {t("AMOUNT")}
                        </span>
                        <p className="text-sm font-medium text-gray-700">
                          {group.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Action buttons */}
                {/* <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedSubReseller(group);
                      setIsEditing(true);
                    }}
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                    aria-label="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add COMMISSION GROUP  Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[40%] text-left">
            <h2 className="text-xl font-semibold mb-4">
              {t("ADD_COMMISSION_GROUP")}
            </h2>

            <div className="rounded-md border border-gray-300 p-5 space-y-4">
              {/* group name Input */}
              <div className="flex flex-col w-full">
                <label className="text-gray-600 text-sm mb-1 font-medium">
                  {t("GROUP_NAME")}
                </label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("ENTER_GROUP_NAME")}
                />
              </div>

              {/* Commission Type Dropdown */}
              <div className="flex flex-col w-full">
                <label className="text-gray-600 text-sm mb-1 font-medium">
                  {t("COMMISSION_TYPE")}
                </label>
                <select
                  name="commissionType"
                  value={formData.commissionType}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("SELECT_COMMISSION_TYPE")}</option>
                  {commissionTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input */}
              <div className="flex flex-col w-full">
                <label className="text-gray-600 text-sm mb-1 font-medium">
                  {t("AMOUNT")}
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("ENTER_AMOUNT")}
                />
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
                disabled={
                  !formData.commissionType ||
                  !formData.groupName ||
                  !formData.amount
                }
                className="px-4 py-2 text-white font-medium bg-green-500 rounded-[50px] hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                {t("SAVE")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

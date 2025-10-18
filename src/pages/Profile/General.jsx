import React, { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { dashboardData,changePIN } from '../../redux/actions/dashboardAction';


export const General = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName1: "Name",
    fullName2: "Name",
    fullName3: "Name",
    fullName4: "Name",
    fullName5: "Name",
    fullName6: "Name",
    fullName7: "Name",
    fullName8: "Name",
  });
  
  const dispatch = useDispatch();
  const { information } = useSelector((state) => state.dashboardReducer);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps"; 


  const [openDialog, setOpenDialog] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [validationError, setValidationError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(dashboardData());
  }, [dispatch]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancelClick = () => {
    setFormData({ ...backupData });
    setIsEditing(false);
  };



  return (
    <div className="col-span-12 space-y-6 xl:col-span-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-3">
        {/* Image Box */}
        <div className="border rounded-md items-center flex flex-col justify-center h-[350px] gap-2">
          <img className="h-[120px] w-[120px] rounded-[50px] border border-gray-700 shadow-md" src={information?.user_info?.profile_image_url} alt="" />
          <h5 className="text-sm text-gray-500 p-2 text-center">
          </h5>
        </div>

        {/* Info Section 1 */}
        

        <div className="flex flex-col bg-white rounded-md p-3 h-[450px] gap-2 justify-between">
          <div>
              <Label htmlFor="">{t('RESELLER_NAME')}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information?.user_info?.reseller_name}
                onChange={handleChange}
                // disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("CONTACT_NAME")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information?.user_info?.contact_name}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("PHONE")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information?.user_info?.phone}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("EMAIL")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information?.user_info?.email}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("TOTAL_SALE")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information.today_sale}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
        </div>

        

        <div className="flex flex-col bg-white rounded-md p-3 h-[450px] gap-2 justify-between">
            <div>
              <Label htmlFor="">{t("BALANCE")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information.balance}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("LOAN_BALANCE")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information.loan_balance}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("TOTAL_SOLD_AMOUNT")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information.total_sold_amount}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("TOTAL_REVENUE")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information.total_revenue}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("TOTAL_PROFIT")}</Label>
              <Input
                type="text"
                id=""
                name=""
                placeholder="Enter your name"
                value={information.today_profit}
                onChange={handleChange}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="hidden flex justify-end gap-2 mt-2">
        {isEditing && (
          <button
            onClick={handleCancelClick}
            className="border border-red-400 text-red-500 rounded-[50px] p-2 w-[150px]"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleEditClick}
          className="bg-blue-700 text-white rounded-[50px] p-2 w-[150px]"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getHawalaBranches,
  getHawalaCurrencies,
} from "../../redux/actions/locationAction";

const AddHawalaDialog = ({ showDialog, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { hawalaCurrencies, hawalaBranches } = useSelector(
    (state) => state.locationReducer
  );
  const dispatch = useDispatch();
  const { user_info } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getHawalaCurrencies());
    dispatch(getHawalaBranches());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    receiverFatherName: "",
    receiverIdCardNumber: "",
    hawalaAmount: "",
    currencyCodeId: "",
    branchId: "",
    commissionPaidBy: "sender",
  });

  const [finalAmount, setFinalAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const resellerCurrencyPreferenceId = user_info.currency_preference_id;
  const resellerCurrencyPreferenceCode = user_info.currency_preference_code;

  // Filter currencies based on reseller's preference
  const filteredCurrencies =
    hawalaCurrencies?.filter(
      (rate) =>
        rate.from_currency_id === resellerCurrencyPreferenceId.toString()
    ) || [];

  // Get unique to_currencies from filtered rates
  const availableToCurrencies = filteredCurrencies.reduce((acc, rate) => {
    if (!acc.some((currency) => currency.id === rate.to_currency.id)) {
      acc.push(rate.to_currency);
    }
    return acc;
  }, []);

  // Calculate final amount when amount or currency changes
  useEffect(() => {
    if (formData.hawalaAmount && formData.currencyCodeId) {
      const selectedRate = filteredCurrencies.find(
        (rate) => rate.to_currency_id === formData.currencyCodeId
      );
      //console.log(formData.currencyCodeId)

      //console.log(selectedRate)

      if (selectedRate) {
        const amount = parseFloat(formData.hawalaAmount);
        const rate = amount / parseFloat(selectedRate.amount);
        const final = selectedRate.sell_rate * rate;
        setFinalAmount(final.toFixed(2));
        setExchangeRate(rate);
      }
    } else {
      setFinalAmount(0);
      setExchangeRate(0);
    }
  }, [formData.hawalaAmount, formData.currencyCodeId, filteredCurrencies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const selectedCurrency = availableToCurrencies.find(
      (c) => c.id.toString() === formData.currencyCodeId
    );

    onSubmit({
      ...formData,
      finalAmount,
      exchangeRate,
      toCurrencyCode: selectedCurrency?.code,
      fromCurrencyCode: resellerCurrencyPreferenceCode,
      toCurrencyName: selectedCurrency?.name,
    });
    onClose();
    setFormData({
      senderName: "",
      receiverName: "",
      receiverFatherName: "",
      receiverIdCardNumber: "",
      hawalaAmount: "",
      currencyCodeId: "",
      branchId: "",
      commissionPaidBy: "sender",
    });
  };

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] overflow-y-auto flex flex-col text-left">
        <div className="flex flex-row items-center justify-between gap-2 mb-2">
          <h2 className="text-xl font-semibold">{t("ADD_HAWALA_ORDER")}</h2>
          <button
            onClick={() => setShowRatesModal(true)}
            className="bg-gray-300 rounded-lg px-2 py-1 text-sm"
          >
            {t("TODAYS_RATE")}
          </button>
        </div>

        <div className="rounded-md border border-gray-300 p-5 space-y-4">
          {/* Sender Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("SENDER_NAME")} *
              </label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("SENDER_NAME")}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("RECEIVER_NAME")} *
              </label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("RECEIVER_NAME")}
                required
              />
            </div>
          </div>

          {/* Receiver Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("RECEIVER_FATHERS_NAME")} *
              </label>
              <input
                type="text"
                name="receiverFatherName"
                value={formData.receiverFatherName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("RECEIVER_FATHERS_NAME")}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("RECEIVER_ID_CARD_NUMBER")} *
              </label>
              <input
                type="number"
                name="receiverIdCardNumber"
                value={formData.receiverIdCardNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("RECEIVER_ID_CARD_NUMBER")}
                required
              />
            </div>
          </div>

          {/* Amount and Currency Conversion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("HAWALA_AMOUNT")} *
              </label>
              <input
                type="number"
                name="hawalaAmount"
                value={formData.hawalaAmount}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("HAWALA_AMOUNT")}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("DESTINATION_CURRENCY")} *
              </label>
              <select
                name="currencyCodeId"
                value={formData.currencyCodeId}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t("SELECT_CURRENCY")}</option>
                {availableToCurrencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversion Details */}
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  {t("EXCHANGE_RATE")}
                </span>
                <span className="font-medium">
                  {exchangeRate > 0
                    ? `1 ${resellerCurrencyPreferenceCode} = ${exchangeRate}`
                    : t("N/A")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  {t("FINAL_AMOUNT")}
                </span>
                <span className="font-medium">
                  {finalAmount > 0
                    ? `${finalAmount} ${resellerCurrencyPreferenceCode}`
                    : t("N/A")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  {t("SOURCE_CURRENCY")}
                </span>
                <span className="font-medium">
                  {resellerCurrencyPreferenceCode}
                </span>
              </div>
            </div>
          </div>

          {/* Branch and Commission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("HAWALA_BRANCH")} *
              </label>
              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t("SELECT_BRANCH")}</option>
                {hawalaBranches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                {t("COMMISSION_PAID_BY")} *
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="commissionPaidBy"
                    value="sender"
                    checked={formData.commissionPaidBy === "sender"}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  {t("SENDER")}
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="commissionPaidBy"
                    value="receiver"
                    checked={formData.commissionPaidBy === "receiver"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  {t("RECEIVER")}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              onClose(),
                setFormData({
                  senderName: "",
                  receiverName: "",
                  receiverFatherName: "",
                  receiverIdCardNumber: "",
                  hawalaAmount: "",
                  currencyCodeId: "",
                  branchId: "",
                  commissionPaidBy: "sender",
                });
            }}
            className="px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-[50px] hover:bg-gray-100 transition"
          >
            {t("CANCEL")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !formData.senderName ||
              !formData.receiverName ||
              !formData.receiverFatherName ||
              !formData.receiverIdCardNumber ||
              !formData.hawalaAmount ||
              !formData.currencyCodeId ||
              !formData.branchId
            }
            className="px-4 py-2 text-white font-medium bg-green-500 rounded-[50px] hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {t("SAVE")}
          </button>
        </div>
      </div>

      {showRatesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {t("TODAYS_EXCHANGE_RATES")}
              </h3>
              <button
                onClick={() => setShowRatesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {hawalaCurrencies?.map((rate) => (
                <div
                  key={rate.id}
                  className="bg-gray-50 p-3 rounded-md border-l-4 border-blue-400"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-700">
                      <span className="font-semibold">
                        {rate.amount} {rate.from_currency?.code}
                      </span>{" "}
                      {t('to')}{" "}
                      <span className="font-semibold">
                        {rate.to_currency?.code}
                      </span>{" "}
                      —
                      <span className="text-green-600 font-medium ml-1">
                        {t('BUYING')}
                      </span>{" "}
                      {rate.buy_rate} {rate.to_currency?.code},
                      <span className="text-red-500 font-medium ml-2">
                        {t('SELLING')}
                      </span>{" "}
                      {rate.sell_rate} {rate.to_currency?.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowRatesModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {t("CLOSE")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHawalaDialog;

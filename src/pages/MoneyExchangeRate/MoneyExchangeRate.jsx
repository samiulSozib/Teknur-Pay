import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getHawalaCurrencies } from "../../redux/actions/locationAction";

const MoneyExchangeRate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hawalaCurrencies } = useSelector((state) => state.locationReducer);

  useEffect(() => {
    dispatch(getHawalaCurrencies());
  }, [dispatch]);

  return (
    <div className="p-2 min-h-screen bg-gray-50">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
        {t("TODAYS_EXCHANGE_RATES")}
      </h1>

      <div className="space-y-3">
        {hawalaCurrencies?.length > 0 ? (
          hawalaCurrencies.map((rate) => (
            <div
              key={rate.id}
              className="bg-white p-3 sm:p-4 rounded-lg shadow-sm flex flex-col sm:flex-col justify-between border-l-4 border-blue-400"
            >
              {/* Amount & Currency */}
              <div className="text-gray-700 text-[10px] sm:text-[12px] md:text-sm mb-1">
                <span className="font-semibold">
                  {rate.amount} {rate.from_currency?.code}
                </span>{" "}
                {t("to")}{" "}
                <span className="font-semibold">{rate.to_currency?.code}</span>
              </div>

              {/* Buying & Selling with justify-between */}
              <div className="flex flex-row justify-between text-[10px] sm:text-[12px] md:text-sm">
                <span className="text-green-600 font-medium">
                  {t("BUYING")}: {rate.buy_rate} {rate.to_currency?.code}
                </span>
                <span className="text-red-500 font-medium">
                  {t("SELLING")}: {rate.sell_rate} {rate.to_currency?.code}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center text-[10px] sm:text-[12px] md:text-sm">
            {t("NO_RATES_AVAILABLE")}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoneyExchangeRate;

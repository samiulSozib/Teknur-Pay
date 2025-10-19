import { useTranslation } from "react-i18next";


export default function TransactionCards() {
  const { t } = useTranslation();

  const actionButtons = [
    {
      label: t("PAYMENT_RECEIPT_REQUEST"),
      color: "bg-blue-400 hover:bg-blue-400",
      icon:"/public/assets/icons/wallet.png",
      link: "/reseller-payments"
    },
    {
      label: t("REQUEST_LOAN_BALANCE"),
      color: "bg-green-400 hover:bg-green-400",
      icon:"/public/assets/icons/transactionsicon.png",
      link: "/loan-requests"
    },
    {
      label: t("MONEY_EXCHANGE"),
      color: "bg-purple-400 hover:bg-purple-400",
      icon:"/public/assets/icons/exchange.png",
      link: "/hawala-orders", 
    },
    {
      label: t("MONEY_EXCHANGE_RATES"),
      color: "bg-orange-400 hover:bg-orange-400",
      icon:"/public/assets/icons/exchange-rate.png",
      link: "/money-exchnage-rate"
    },
    {
      label: t("BALANCE_TRANSACTION"),
      color: "bg-pink-400 hover:bg-pink-400",
      icon:"/public/assets/icons/transactionsicon.png",
      link: "/transactions"
    },
    {
      label: t("TRANSFER_COMMISSION_TO_BALANCE"),
      color: "bg-teal-400 hover:bg-teal-400",
      icon:"/public/assets/icons/transactionsicon.png",
      link: "/transfer-commissions"
    },
  ];

    const handleCardClick = (btn) => {
    if (btn.link) {
      window.location.href=btn.link
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4">
      {actionButtons.map((btn, idx) => (
        <div
          key={idx}
          onClick={() => handleCardClick(btn)}
          className={`flex items-center justify-start sm:justify-center lg:flex-row gap-3 sm:gap-4 
            text-white font-semibold rounded-xl shadow-md cursor-pointer transition-transform transform hover:scale-105 ${btn.color}
            h-12 sm:h-16 lg:h-36 px-4 sm:px-6`}
        >
          <img
            src={btn.icon}
            alt={btn.label}
            className="w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 object-contain filter brightness-0 invert"
          />
          <span className="text-sm sm:text-base lg:text-lg">{btn.label}</span>
        </div>
      ))}
    </div>
  );
}

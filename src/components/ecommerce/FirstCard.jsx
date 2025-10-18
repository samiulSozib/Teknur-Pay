import { useTranslation } from "react-i18next";

export default function FirstCard() {
  const {t}=useTranslation()
  return (
    <div className="h-[270px] rounded-2xl border border-gray-200 bg-[#C8FACD] dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-center">
        
        {/* Text Section */}
        <div className="flex-1 p-4 md:p-8 text-center sm:text-left">
          <span className="text-xl tracking-tighter font-bold text-black block">{t('WHATSAPP_CARD_FIRST_TEXT')}</span>
          <p className="text-sm tracking-tighter text-gray-700 mt-2">
          {t('WHATSAPP_CARD_SECOND_TEXT')}
          </p>
          <button className="mt-3 px-4 py-2 bg-green-600 rounded-lg text-white text-sm w-full sm:w-auto">
          {t('CONTACT_SUPPORT')}
          </button>
        </div>

        {/* Image Section */}
        <div className="hidden md:flex relative items-center justify-center p-4 sm:p-3">
          {/* Background Image */}
          <div className="relative flex items-center justify-center w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full">
            <img src="/images/img/background.png" alt="Background" className="absolute inset-0 w-full h-full object-contain" />
          </div>
          
          {/* WhatsApp Icon */}
          <div className="absolute flex items-center justify-center w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] bg-green-500 rounded-full shadow-lg border-4 border-white">
            <img className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] object-contain" src="/images/img/whatsapp.png" alt="WhatsApp Icon" />
          </div>
        </div>

      </div>
    </div>
  );
}

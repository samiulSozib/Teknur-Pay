import { useTranslation } from "react-i18next";

export default function FirstCard() {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    const phoneNumber = "+93708488200";
    const message = t('WHATSAPP_CARD_MESSAGE') || "Hello, I would like to contact support";
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="h-[270px] rounded-2xl border border-gray-200 bg-gradient-to-br from-[#C8FACD] to-[#b5f0bb] dark:border-gray-800 dark:bg-white/[0.03] p-5 md:p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/30 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/20 rounded-full blur-2xl -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-700"></div>
      
      <div className="flex flex-col sm:flex-row items-center h-full relative z-10 gap-4">
        
        {/* Text Section */}
        <div className="flex-1 text-center sm:text-left">
          {/* Small badge */}
          <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-green-700 mb-3 border border-green-200">
            📱 24/7 Support
          </span>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {t('WHATSAPP_CARD_FIRST_TEXT')}
          </h3>
          
          <p className="text-sm text-gray-600 mb-5 max-w-md leading-relaxed">
            {t('WHATSAPP_CARD_SECOND_TEXT')}
          </p>
          
          <button 
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2 sm:inline-flex"
            onClick={handleWhatsAppClick}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" />
            </svg>
            {t('CONTACT_SUPPORT')}
          </button>
        </div>

        {/* WhatsApp Icon */}
        <div className="relative">
          {/* Ring animation */}
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-75"></div>
          
          {/* Icon container */}
          <div className="relative flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-xl w-20 h-20 group-hover:scale-105 transition-transform duration-300 group-hover:shadow-green-500/40">
            <img 
              className="w-10 h-10 object-contain filter drop-shadow-md" 
              src="/images/img/whatsapp.png" 
              alt="WhatsApp" 
            />
            
            {/* Small notification dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
          
          {/* Simple tooltip */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            WhatsApp
          </div>
        </div>

      </div>
    </div>
  );
}
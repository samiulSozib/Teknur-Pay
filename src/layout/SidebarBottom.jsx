import { useTranslation } from "react-i18next";

export default function SidebarBottom() {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    const phoneNumber = "+93708488200";
    const message = t('CONTACT_US_MESSAGE') || "Hello, I would like to get more information";
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      className={`flex justify-center items-center mx-auto w-full max-w-60 rounded-[50PX] bg-green-600 px-2 py-2 text-center dark:bg-white/[0.02] mb-5 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-green-300 hover:bg-green-700 transition-colors`}
      onClick={handleWhatsAppClick}
      aria-label={t('CONTACT_US_VIA_WHATSAPP') || "Contact us via WhatsApp"}
    >
      <span className="mr-3 overflow-hidden rounded-full h-8 w-8">
        <img 
          src="/images/img/whatsapp.png" 
          className="w-8 h-8 object-contain" 
          alt="WhatsApp" 
        />
      </span>

      <span className="block mr-1 text-sm text-white font-bold">
        {t('CONTACT_US')}
      </span>
    </button>
  );
}
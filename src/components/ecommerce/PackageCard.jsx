import { useNavigate } from "react-router";
import { Conversation, Internet, Mobile, SocialBundle } from "../../icons";
import { useTranslation } from "react-i18next";
  
export default function PackageCard() {
  const {t}=useTranslation()
    const navigate=useNavigate()
    const gotoInternetPackage=()=>{
        navigate('/internet')
    }
    const gotoSocialBundle=()=>{
      navigate('/social')
    }
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        <div className="cursor-pointer rounded-2xl border border-gray-200 bg-[#C8FACD] p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col justify-center items-center gap-2" onClick={gotoInternetPackage}>
            <div className="bg-green-300 rounded-full p-6">
              <Internet className="w-10 h-10"/>
            </div>
            <h4 className="text-center">{t('INTERNET_PACKAGE')}</h4>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#D0F2FF] p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="bg-blue-300 rounded-full p-6">
              <Mobile className="w-10 h-10"/>
            </div>
            <h4 className="text-center">{t('MOBILE_CHARGING')}</h4>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#FFF7CD] p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="bg-yellow-200 rounded-full p-6">
              <Conversation className="w-10 h-10"/>
            </div>
            <h4 className="text-center">{t('CONVERSATION_PACKAGE')}</h4>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#FFE7D9] p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="cursor-pointer flex flex-col justify-center items-center gap-2" onClick={gotoSocialBundle}>
            <div className="bg-orange-200 rounded-full p-6">
              <SocialBundle className="w-10 h-10"/>
            </div>
            <h4 className="text-center">{t('SOCIAL_BUNDLE')}</h4>
          </div>
        </div>
      </div>
    );
  }
  
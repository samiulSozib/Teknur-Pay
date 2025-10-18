import PageMeta from "../../components/common/PageMeta";
import FastCard from "../../components/ecommerce/FirstCard"
import SliderCard from "../../components/ecommerce/SliderCard"
import InfoCard from "../../components/ecommerce/InfoCard"
import DashboardGrid from "../../components/ecommerce/DashboardGrid";
import { useTranslation } from "react-i18next";

export default function Home() {

  const { t } = useTranslation()

  return (
    <>
      <PageMeta
        title="TekNur Pay"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">


        <div className="hidden sm:block col-span-12 xl:col-span-7">
          < FastCard />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <SliderCard />
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-12">

          <InfoCard />

        </div >

        <div
          className="col-span-12 xl:col-span-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center py-3 rounded-lg shadow-md transition duration-300 cursor-pointer"
          onClick={() => {
            window.location.href = "/credit-recharge"; // redirect to the desired link
          }}
        >
          {t('CREDIT_TRANSFER')}
        </div>



        <div className="col-span-12 xl:col-span-12">
          <DashboardGrid />
        </div>
      </div>
    </>
  );
}

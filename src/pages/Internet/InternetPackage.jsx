import PageMeta from "../../components/common/PageMeta";
import InternetPackageCard from "../../components/ecommerce/InternetPackageCard";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"
import { useTranslation } from "react-i18next";


export default function InternetPackage() {
  const {t}=useTranslation()
  const breadcrumbPaths = [
    { label: t("PRODUCT_PACKAGE"), href: "/product-and-packages" },
    {label: t("INTERNET_PACKAGE"),href:'/internet'}
  ];
  return (
    <>
      <PageMeta
        title="TekNur Pay"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        
        <div className="col-span-12 space-y-6 xl:col-span-12">
            <div>
              <Breadcrumb paths={breadcrumbPaths} />
            </div>

            <InternetPackageCard/>

        </div>


        
      </div>
    </>
  );
}

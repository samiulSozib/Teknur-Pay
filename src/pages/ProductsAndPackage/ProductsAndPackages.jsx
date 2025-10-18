import PageMeta from "../../components/common/PageMeta";
import PackageCard from "../../components/ecommerce/PackageCard"
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"

export default function ProductsAndPackages() {
  const breadcrumbPaths = [
    { label: "Product and Packages", href: "/product-and-packages" },
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
            <PackageCard />

        </div>


        
      </div>
    </>
  );
}

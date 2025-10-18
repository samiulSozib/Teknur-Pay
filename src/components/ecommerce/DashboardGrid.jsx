import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { serviceCategories } from "../../redux/actions/serviceCategoriesAction";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function DashboardGrid() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceCategoryList } = useSelector((state) => state.serviceCategoriesReducer);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(serviceCategories());
  }, [dispatch]);

  // Function to handle category click
  const handleCategoryClick = (serviceCategory) => {
    if (serviceCategory.type === 'nonsocial') {
      // Navigate to nonsocial page with query parameters
      navigate(`/nonsocial?categoryId=${serviceCategory.id}&categoryName=${encodeURIComponent(serviceCategory.category_name)}`);
    } else {
      // Navigate to social page with query parameters
      navigate(`/bundle?type=social&categoryId=${serviceCategory.id}&countryId=2&categoryName=${encodeURIComponent(serviceCategory.category_name)}`);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:gap-6">
      {serviceCategoryList
        ?.filter((serviceCategory) => serviceCategory.services?.length > 0)
        .map((serviceCategory, index) => {
          // Light background colors
          const bgColors = [
            "bg-blue-50",
            "bg-green-50",
            "bg-pink-50",
            "bg-yellow-50",
            "bg-purple-50",
            "bg-orange-50",
            "bg-teal-50",
          ];

          const bgColor = bgColors[index % bgColors.length];

          return (
            <div
              key={serviceCategory.id || index}
              onClick={() => handleCategoryClick(serviceCategory)}
              className={`flex flex-col items-center justify-center text-center 
                          h-[120px] sm:h-[150px] 
                          rounded-2xl border border-gray-200 p-3 sm:p-6 dark:border-gray-800 
                          cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${bgColor}`}
            >
              <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                {serviceCategory.category_name}
              </span>

              <img
                src={serviceCategory.category_image_url}
                alt={serviceCategory.category_name}
                className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
              />
              
              {/* Optional: Show badge for category type */}
              {/* <span className={`text-xs mt-1 px-2 py-1 rounded-full ${
                serviceCategory.type === 'nonsocial' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {serviceCategory.type === 'nonsocial' ? t('nonsocial') : t('social')}
              </span> */}
            </div>
          );
        })}
    </div>
  );
}
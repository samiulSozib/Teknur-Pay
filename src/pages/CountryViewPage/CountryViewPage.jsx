import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import { useTranslation } from "react-i18next";

export default function CountryViewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { serviceCategoryList } = useSelector((state) => state.serviceCategoriesReducer);

  const categoryId = parseInt(searchParams.get('categoryId'));
  const categoryName = searchParams.get('categoryName');
  const categoryImage = searchParams.get('categoryImage');

  const [countries, setCountries] = useState([]);

  // Function to get countries for the category
  const getCountriesWithImagesByCategoryId = (serviceCategories, categoryId) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    
    if (!category || category.type !== 'nonsocial') {
      return [];
    }
    
    const countriesMap = new Map();
    
    category.services.forEach(service => {
      if (service.company && service.company.country) {
        const country = service.company.country;
        if (!countriesMap.has(country.id)) {
          countriesMap.set(country.id, {
            id: country.id,
            name: country.country_name,
            flag_image: country.country_flag_image_url,
            telecom_code: country.country_telecom_code
          });
        }
      }
    });
    
    return Array.from(countriesMap.values());
  };

  // Handle country click - navigate to services page
  const handleCountryClick = (countryId, countryName) => {
    navigate(`/bundle?type=nonsocial&countryId=${countryId}&categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}&countryName=${encodeURIComponent(countryName)}`);
  };

  useEffect(() => {
    if (categoryId && serviceCategoryList) {
      const countryList = getCountriesWithImagesByCategoryId(serviceCategoryList, categoryId);
      setCountries(countryList);
    }
  }, [categoryId, serviceCategoryList]);

  if (!categoryId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">Category not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t('back_to_home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${categoryName} - TekNur Pay`}
        description={`Available countries for ${categoryName}`}
      />
      
      <div className="container mx-auto px-4 py-8">
        

        {/* Countries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {countries.map((country) => (
            <div
              key={country.id}
              onClick={() => handleCountryClick(country.id, country.name)}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-blue-300"
            >
              <img
                src={country.flag_image}
                alt={country.name}
                className="w-16 h-12 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-medium text-gray-800 dark:text-white text-center">
                {country.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {country.telecom_code}
              </span>
            </div>
          ))}
        </div>

        {countries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {t('no_countries_available')}
            </p>
          </div>
        )}

     
      </div>
    </>
  );
}
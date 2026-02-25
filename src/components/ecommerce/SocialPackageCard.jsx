import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { serviceCategories } from '../../redux/actions/serviceCategoriesAction';
import { categorizeServices } from '../../utils/utils';

export default function InternetPackageCard() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { serviceCategoryList } = useSelector((state) => state.serviceCategoriesReducer);
  const [categorizedServices, setCategorizedServices] = useState({});
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const navigate = useNavigate();

  const categoryId = parseInt(searchParams.get('categoryId'));
  const categoryName = searchParams.get('categoryName');
  const categoryImage = searchParams.get('categoryImage');

  useEffect(() => {
    dispatch(serviceCategories());
  }, [dispatch]);

  useEffect(() => {
    if (serviceCategoryList) {
      const categorized = categorizeServices(serviceCategoryList);
      setCategorizedServices(categorized);
    }
  }, [serviceCategoryList]);

  // Filter companies based on categoryName from params
  useEffect(() => {
    if (categorizedServices.social && categoryName) {
      // Find the category that matches the categoryName from params
      const matchingCategory = Object.keys(categorizedServices.social).find(
        (cat) => cat.toLowerCase() === categoryName?.toLowerCase()
      );
      
      if (matchingCategory) {
        setFilteredCompanies(categorizedServices.social[matchingCategory].companies || []);
      } else {
        setFilteredCompanies([]);
      }
    }
  }, [categorizedServices, categoryName]);

  const handleCategoryClick = (type, countryId, categoryId, companyId) => {
    if (type === 'social') {
      navigate(`/social-bundle?type=${type}&countryId=${countryId}&categoryId=${categoryId}&companyId=${companyId}`);
    }
  };

  // Don't render if no companies match the category
  if (filteredCompanies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No companies found for {categoryName}
      </div>
    );
  }

  return (
    <div className="mb-[20px]">
      <h6 className="text-lg font-bold mb-3">{categoryName}</h6>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredCompanies.map((company, index) => (
            <div 
              key={index} 
              className="bg-white shadow-md rounded-lg cursor-pointer text-center p-4 transition hover:shadow-lg hover:scale-105 transform duration-200"
              onClick={() =>
                handleCategoryClick(
                  "social",
                  company.countryId,
                  company.categoryId,
                  company.companyId
                )
              }
            >
              <div className="flex flex-col items-center gap-3">
                <img
                  src={company.companyLogo}
                  alt={company.companyName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png'; // Add a placeholder image
                  }}
                />
                <h4 className="text-black font-bold text-sm text-center">{company.companyName}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
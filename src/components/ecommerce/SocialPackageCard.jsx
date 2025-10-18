import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { serviceCategories } from '../../redux/actions/serviceCategoriesAction';
import { categorizeServices } from '../../utils/utils';

  
export default function InternetPackageCard() {
  const dispatch = useDispatch();
  const { serviceCategoryList } = useSelector((state) => state.serviceCategoriesReducer);
  const [categorizedServices, setCategorizedServices] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(serviceCategories());
  }, [dispatch]);

  useEffect(()=>{
    //console.log(serviceCategories)
  },[dispatch])

  useEffect(() => {
    if (serviceCategoryList) {
      const categorized = categorizeServices(serviceCategoryList);
      //console.log(categorized);
      setCategorizedServices(categorized);
    }
  }, [serviceCategoryList]);

  const handleCategoryClick=(type,countryId,categoryId,companyId)=>{
    if(type=='social'){
      navigate(`/social-bundle?type=${type}&countryId=${countryId}&categoryId=${categoryId}&companyId=${companyId}`);
    }
  }
    
    useEffect(()=>{
      console.log(categorizeServices)
    },[dispatch])
    return (
      <div className="">

        {Object.keys(categorizedServices.social||{}).map((categoryName)=>(

       
        <div key={categoryName} className="mb-[20px]">
        <h6 className="text-lg font-bold mb-1">{categoryName}</h6>

        <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {categorizedServices.social[categoryName].companies.map((company, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg cursor-pointer text-center p-4 transition hover:shadow-lg"
                onClick={() =>
                handleCategoryClick(
                    "social",
                    company.countryId,
                    company.categoryId,
                    company.companyId
                )
                }
            >
                <div className="flex flex-col sm:flex-row items-center gap-3">
                <img
                    src={company.companyLogo}
                    alt={company.companyName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                />
                <h4 className="text-black font-bold text-sm sm:text-base">{company.companyName}</h4>
                </div>
            </div>
            ))}
        </div>
        </div>



        </div>

        ))}

        
      </div>
    );
  }
  
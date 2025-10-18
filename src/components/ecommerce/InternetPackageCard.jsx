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
    if(type=='nonsocial'){
      navigate(`/non-social?type=${type}&countryId=${countryId}&categoryId=${categoryId}`);
    }
  }
    const nonSocialBUndlePage=()=>{
        navigate('/non-social')
    }
    useEffect(()=>{
      console.log(categorizeServices)
    },[dispatch])
    return (
      <div className="">

        {Object.keys(categorizedServices.nonsocial||{}).map((country)=>(

       
        <div key={country} className="mb-[20px]">
        <h6 className="text-lg font-bold mb-1">{country} Network</h6>

        <div className="overflow-x-auto whitespace-nowrap flex gap-3 pb-2">
          {categorizedServices.nonsocial[country].categories.map((category, index) => (
            <div key={index} className="flex-none">
              <div
                className="bg-white shadow-md rounded-lg cursor-pointer text-center"
                onClick={() =>
                  handleCategoryClick(
                    "nonsocial",
                    categorizedServices.nonsocial[country].country_id,
                    category.categoryId
                  )
                }
              >
                <div className="flex gap-2 text-center justify-center items-center p-5">
                  <img
                    src={categorizedServices.nonsocial[country].countryImage}
                    alt={country}
                    className="h-15 w-18 rounded-md"
                  />
                  <h4 className="text-black font-bold text-sm mt-2">{category.categoryName}</h4>
                </div>
               
              </div>
            </div>
          ))}
        </div>
        </div>

        ))}

        
      </div>
    );
  }
  
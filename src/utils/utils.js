export function categorizeServices(data) {
    const categorized = {
      nonsocial: {},
      social: {}
    };
  
    // Sets to track seen companies for social and nonsocial services
    const seenSocialCompanies = new Set();
    const seenNonSocialCompanies = new Set();
  
    data.forEach(category => {
      const type = category.type;
      const categoryId = category.id;
      const categoryName = category.category_name;
  
      category.services.forEach(service => {
        const country = service.company?.country?.country_name;
        const countryId = service.company?.country_id
        const countryImage = service.company?.country?.country_flag_image_url;
        const companyId = service.company?.id;
        let companyLogo;
  
        if (type === "social") {
          companyLogo = service.company.company_logo;
  
          // Check for duplicate social companies
          if (!seenSocialCompanies.has(companyId)) {
            seenSocialCompanies.add(companyId);
  
            // Initialize social category if it doesn't exist
            if (!categorized.social[categoryName]) {
              categorized.social[categoryName] = {
                companies: []
              };
            }
  
            const socialCompanyInfo = {
              companyId: companyId,
              companyName: service.company.company_name,
              companyLogo: companyLogo,
              categoryId: categoryId,
              categoryName: categoryName,
              countryId: countryId
            };
  
            categorized.social[categoryName].companies.push(socialCompanyInfo);
          }
        } else {
          // Check for duplicate non-social companies
          
            seenNonSocialCompanies.add(companyId);
  
            // Initialize non-social category for country if it doesn't exist
            if (!categorized.nonsocial[country]) {
              categorized.nonsocial[country] = {
                country_id: countryId,
                countryImage: countryImage,
                categories: {}, // Change to an object for categories keyed by categoryId
                //companies: []
              };
            }
  
            // Add unique category name and ID if not already in the list for the country
            if (!categorized.nonsocial[country].categories[categoryId]) {
              categorized.nonsocial[country].categories[categoryId] = {
                categoryName: categoryName,
                companies: [] // Hold unique companies for this category
              };
            }
  
            const nonSocialCompanyInfo = {
              companyId: companyId,
              companyName: service.company.company_name,
              companycodes:service.company.companycodes
            };
  
            // Add company info to the respective category
            categorized.nonsocial[country].categories[categoryId].companies.push(nonSocialCompanyInfo);
  
            // // Also push company info to the main country companies list if not already added
            //categorized.nonsocial[country].companies.push(nonSocialCompanyInfo);
          
        }
      });
    });
  
    for (const country in categorized.nonsocial) {
      const categoriesObject = categorized.nonsocial[country].categories;
      // Convert the categories object into an array
      categorized.nonsocial[country].categories = Object.keys(categoriesObject).map(categoryId => ({
        categoryId: categoryId,
        ...categoriesObject[categoryId]
      }));
    }
    //console.log(data)
  
    return categorized;
  }


export function getCompanyServiceFlatList(data) {
  const companyServiceList = [];

  data.forEach(category => {
    category.services.forEach(service => {
      const company = service.company;
      if (!company) return;

      companyServiceList.push({
        serviceId: service.id,
        serviceName: service.service_name, // optional
        companyId: company.id,
        companyName: company.company_name,
        companyLogo: company.company_logo,
        country: company.country?.country_name,
        countryId: company.country_id
      });
    });
  });

  return companyServiceList;
}


function getCountriesWithImagesByCategoryId(serviceCategories, categoryId) {
    // Find the specific category by ID
    const category = serviceCategories.find(cat => cat.id === categoryId);
    
    // Return empty array if category not found or not nonsocial
    if (!category || category.type !== 'nonsocial') {
        return [];
    }
    
    const countries = new Map();
    
    category.services.forEach(service => {
        if (service.company && service.company.country) {
            const country = service.company.country;
            if (!countries.has(country.id)) {
                countries.set(country.id, {
                    id: country.id,
                    name: country.country_name,
                    flag_image: country.country_flag_image_url
                });
            }
        }
    });
    
    return Array.from(countries.values());
}
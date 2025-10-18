import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getSubReseller, getSingleSubReseller, addSubReseller, clearMessages } from '../../redux/actions/subResellerAction';
import { CloseEye, CloseIcon, Edit } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useTranslation } from "react-i18next";
import { getCountries, getDistricts, getProvinces } from "../../redux/actions/locationAction";
import Select from "../../components/form/Select";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"







export default function AddSubReseller() {
const [isEditing,setIsEditing]=useState(true)
    const dispatch = useDispatch()
  const { countries, districts, provinces } = useSelector((state) => state.locationReducer)
  const {error,message,loading} =useSelector((state)=>state.subResellerListReducer)
  const { user_info } = useSelector((state) => state.auth)
  const [state, setState] = useState({ currency_preference_id: user_info?.currency_preference_id });
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState({
    reseller_name: "",
    contact_name: "",
    phone: "",
    email: "",
  });
  
  const handleSubmit = (event) => {
    event.preventDefault();


    let newErrors = {};

    if (!state.reseller_name) newErrors.reseller_name = "Reseller name is required.";
    if (!state.contact_name) newErrors.contact_name = "Contact name is required.";
    if (!state.phone) newErrors.phone = "Phone number is required.";
    if (!state.email) newErrors.email = "Email is required.";

    // If errors exist, update state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({ reseller_name: "", contact_name: "", phone: "", email: "" });

    const formData = new FormData();

    

    formData.append("reseller_name", state.reseller_name)
    formData.append("contact_name", state.contact_name)
    formData.append("email", state.email)
    formData.append("phone", state.phone)
    formData.append("country_id", state.country_id)
    formData.append("province_id", state.province_id)
    formData.append("districts_id", state.districts_id)
    formData.append("currency_preference_id", user_info?.currency_preference_id)

    if (imageFile) {
      formData.append("profile_image_url", imageFile);
    }
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    //return;

    dispatch(addSubReseller(formData))
  };

  useEffect(() => {
    if ( message|| error) {
      //console.log(message)
      //console.log(error)
      if(message){
        Swal.fire({
          title: "Good job!",
          text: message,
          icon: "success"
        });
        dispatch(clearMessages())
        setState({
              reseller_name: "",
              contact_name: "",
              email: "",
              phone: "",
              country_id: "",
              province_id: "",
              districts_id: "",
              currency_preference_id: user_info?.currency_preference_id,
            });
        
            setProfileImage(null);
            setImageFile(null);
            navigate("/sub-reseller")
      }
      if(error){
        toast.error(error)
        dispatch(clearMessages())
      }
    }
  }, [message, error, dispatch,navigate,user_info?.currency_preference_id]);

  const handleChangeState = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file)
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    dispatch(getCountries())
    dispatch(getDistricts())
    dispatch(getProvinces())
  }, [dispatch])


    const {
        reseller_name,
        contact_name,
        email,
        phone,
        country_id,
        province_id,
        districts_id,
        currency_preference_id
      } = state;
    

 

      const handleEditClick = () => {
        setIsEditing(!isEditing);
      };
    
      const breadcrumbPaths = [
        { label: t('SUB_RESELLER'), href: "/sub-reseller" },
        {label: t('ADD_SUB_RESELLER'),href:"/add-sub-reseller"}
      ];

  return (
    <div className="">
      <div className="col-span-12 space-y-6 xl:col-span-12 mb-2">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-3">
        {/* Image Box */}
        <div onClick={()=>fileInputRef.current.click()} className="cursor-pointer border rounded-md items-center flex flex-col justify-center h-[350px] gap-2">
        {profileImage ? (
        <img
          src={profileImage}
          alt="Uploaded"
          className="h-[120px] w-[120px] rounded-full border border-gray-700 shadow-md"
        />
      ) : (
        <div className="h-[120px] w-[120px] rounded-full border border-gray-700 shadow-md flex items-center justify-center text-gray-500">
          Upload Image
        </div>
      )}
          <h5 className="text-sm text-gray-500 p-2 text-center">
            Allowed *.jpeg, *.jpg, *.png, *.gif Max size of 3.1 MB
          </h5>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageChange}
        />
        </div>

        {/* Info Section 1 */}
        

        <div className="flex flex-col bg-white rounded-md p-3 h-[400px] gap-2 justify-between">
          <div>
              <Label htmlFor="">{t("RESELLER_NAME")}</Label>
              <Input
                value={reseller_name||""}
                type="text"
                id="reseller_name"
                name="reseller_name"
                placeholder={t("ENTER_RESELLER_NAME")}
                onChange={handleChangeState}
                error={Boolean(errors.reseller_name)}
                hint={errors.reseller_name}
                // disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("CONTACT_NAME")}</Label>
              <Input
                value={contact_name||""}
                type="text"
                id="contact_name"
                name="contact_name"
                placeholder={t("ENTRE_CONTACT_NAME")}
                onChange={handleChangeState}
                error={Boolean(errors.contact_name)}
                hint={errors.contact_name}                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("EMAIL")}</Label>
              <Input
                value={email||""}
                type="text"
                id="email"
                name="email"
                placeholder={t("ENTER_EMAIL")}
                onChange={handleChangeState}
                error={Boolean(errors.email)}
                hint={errors.email}                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            <div>
              <Label htmlFor="">{t("PHONE")}</Label>
              <Input
                value={phone||""}
                type="text"
                id="phone"
                name="phone"
                placeholder={t("ENTER_PHONE")}
                onChange={handleChangeState}
                error={Boolean(errors.phone)}
                hint={errors.phone}                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
           
        </div>

        

        <div className="flex flex-col bg-white rounded-md p-3 h-[400px] gap-2 justify-between">
            <div>
              <Label htmlFor="">{t("COUNTRY")}</Label>
              {/* <Input
                value={country_id||""}
                type="text"
                id="country_id"
                name="country_id"
                placeholder="Enter your name"
                onChange={handleChangeState}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              /> */}
              <select
                value={country_id || ""} 
                id="country_id"
                name="country_id"
                onChange={handleChangeState}
                className={`w-full rounded-md font-bold ${isEditing ? "border-gray-400" : "bg-gray-300"} mt-1`}

              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.country_name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <Label htmlFor="">{t("PROVINCE")}</Label>
              {/* <Input
                value={province_id||""}
                type="text"
                id="province_id"
                name="province_id"
                placeholder="Enter your name"
                onChange={handleChangeState}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              /> */}
              <select
                value={province_id || ""} 
                id="province_id"
                name="province_id"
                onChange={handleChangeState}
                className={`w-full rounded-md font-bold ${isEditing ? "border-gray-400" : "bg-gray-300"} mt-1`}
              >
                <option value="">Select Province</option>
                {provinces.map((province)=>(
                  <option value={province.id}>{province.province_name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="">{t("DISTRICT")}</Label>
              {/* <Input
                value={districts_id||""}
                type="text"
                id="districts_id"
                name="districts_id"
                placeholder="Enter your name"
                onChange={handleChangeState}
                //disabled={!isEditing}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              /> */}
              <select
                value={districts_id || ""} 
                id="districts_id"
                name="districts_id"
                onChange={handleChangeState}
                className={`w-full rounded-md font-bold ${isEditing ? "border-gray-400" : "bg-gray-300"} mt-1`}
               >
                <option value="">Select District</option>
                {districts.map((district)=>(
                  <option value={district.id}>{district.district_name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="">{t("CURRENCY_PREFERENCE")}</Label>
              <Input
                type="text"
                id="currency_preference_id"
                name="currency_preference_id"
                placeholder="Enter your name"
                onChange={handleChangeState}
                value={user_info?.currency.code}
                className={`font-bold ${isEditing ? "border-gray-400" : "bg-gray-100"} mt-1`}
              />
            </div>
            
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-end gap-2 mt-2">
        
        <button
          onClick={handleSubmit}
          className="bg-blue-700 text-white rounded-[50px] p-2 w-[150px]"
        >
          {t("SAVE")}
        </button>
      </div>

      <ToastContainer position="bottom-center" // Adjust the position as needed
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover/>
    
    </div>
  );
}
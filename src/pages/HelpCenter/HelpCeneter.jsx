import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"


export default function HelpCenter() {
  const {t}=useTranslation()
  


  const breadcrumbPaths = [
    { label: t('HELP_CENTER'), href: "/" },
  ];

  return (
    <div className="">
      
      {/* Profile Heading */}
        <Breadcrumb paths={breadcrumbPaths} />

        <div className="flex flex-col sm:flex-row border rounded-md bg-white p-2 mt-3 gap-3 items-center">
            <img className="h-[150px] w-[300px] object-contain m-3" src="/images/img/help-center.png" alt="" />
            <span className="text-gray-400 text-justify p-2 tracking-wider">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste non molestias voluptatem pariatur, aliquam reprehenderit at distinctio quaerat. Placeat provident ratione ad corporis nemo quam voluptatibus atque, minus cupiditate veniam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis assumenda dicta, sapiente optio similique iure vitae saepe, voluptas eligendi repellat non beatae dolorem. Facere quos dolor iure perferendis officiis quis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque sunt quia nobis officia possimus quaerat modi, perferendis assumenda, quidem et ipsam voluptatum placeat corrupti illum, magni quasi facilis nisi reiciendis! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis iure mollitia accusantium minus, illo animi excepturi, distinctio illum error nam dolorem, quasi sit minima est quisquam id quo facere tenetur. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid eos aliquam ipsam eum delectus! Doloribus facilis dolore modi non. Voluptatibus temporibus illo libero ex? Similique aut dicta dolore modi repellendus.</span>
        </div>
      
    </div>
  );
}

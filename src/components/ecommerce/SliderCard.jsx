import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import {dashboardData} from '../../redux/actions/dashboardAction'
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';





export default function SliderCard() {

  const {advertisement_sliders}=useSelector((state)=>state.dashboardReducer)
  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(dashboardData())
  },[dispatch])

  
    return (
      <div className="h-[270px] rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]">
      
        <Swiper
          dir="ltr"
          rtl={true}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {advertisement_sliders.map((slider, index) => (
                <SwiperSlide key={index}>
                  <img
                  className="p-2 rounded-md w-full h-[270px] object-fill"
                    src={slider.ad_slider_image_url}
                    alt={`ad_slider_image-${index}`}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      
  
      </div>
    );
  }
  
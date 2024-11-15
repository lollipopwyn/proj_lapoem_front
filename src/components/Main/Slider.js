import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Slider.css';

<<<<<<< HEAD
import Slide1 from "./SlideImage/main_banner_02.png";
import Slide2 from "./SlideImage/main_banner_03.png";
import Slide3 from "./SlideImage/Slide.jpg";
=======
import Slide1 from './SlideImage/Slide.jpg';
import Slide2 from './SlideImage/Slide2.jpg';
import Slide3 from './SlideImage/Slide3.jpg';
>>>>>>> d05edd807ba98ccd69fe6df0c6f2bf49ae1ee22d

const Slider = () => {
  const swiperRef = useRef(null);

  return (
    <div className="mt-[100px] mx-[180px]">
      <div className="swiper-container">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
          speed={300}
          loop={true}
          navigation={true}
          pagination={{
            dynamicBullets: true,
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={Slide1} alt="img1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Slide2} alt="img2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Slide3} alt="img3" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;

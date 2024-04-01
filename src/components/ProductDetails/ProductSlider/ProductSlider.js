import React from 'react'
import './productslider.css'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Keyboard, Mousewheel, Navigation } from 'swiper/modules';
import { Pagination } from 'reactstrap';
const ProductSlider = () => {
  return (
    <div className='productslider'>
        <Swiper
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            cssMode={true}
            slidesPerView={3}
            spaceBetween={10}
            navigation={true}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="mySwiper"
          >
            <SwiperSlide>dd</SwiperSlide>
            <SwiperSlide>dd</SwiperSlide>
            <SwiperSlide>dd</SwiperSlide>
        </Swiper>
    </div>
  )
}

export default ProductSlider

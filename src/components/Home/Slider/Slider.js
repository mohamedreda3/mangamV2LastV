import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/navigation";
// import 'swiper/swiper-bundle.min.css';
import "swiper/css/pagination";
import "./slider.css";
// import {
//   Navigation,
//   Pagination,
//   Mousewheel,
//   Keyboard,
//   slidesPerView,
// } from "swiper";
import {
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
const Slider = () => {
  const naivate = useNavigate();
  const language = useSelector((state) => state.language.lang);
  const [pageloading, setpageloading] = useState(true);
  const [slidercomponents, setslidercomponents] = useState([
    // {
    //   id:'1',
    //   title:'get unlimited free delivery with pro members',
    //   img:require("../../../assets/slid1.png"),
    // },
    // {
    //   id:'2',
    //   title:'get unlimited free delivery with pro members',
    //   img:require("../../../assets/slid2.png"),
    // },
    // {
    //   id:'3',
    //   title:'get unlimited free delivery with pro members',
    //   img:require("../../../assets/slid1.png"),
    // },
  ]);

  const HomeBanner = () => {
    axios
      .get("https://api.manjam.shop/v2/banner/getAll?type=user", {
        timeout: 500000,
      })
      .then((res) => {
        // console.log(res.data)
        if (Array.isArray(res.data.message)) {
          // console.log(res.data.message)
          setslidercomponents(res.data.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setpageloading(false);
      });
  };
  useEffect(() => {
    HomeBanner();
  }, []);

  return (
    <div className="sliderpage">
      {pageloading ? (
        <div>
          <Skeleton count={4} />
        </div>
      ) : (
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
              slidesPerView: 1,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            1280: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
          cssMode={true}
          slidesPerView={1}
          spaceBetween={10}
          navigation={true}
          pagination={true}
          mousewheel={true}
          keyboard={true}
          autoplay={{
            delay: 3000, // Set the delay in milliseconds (3 seconds in this example)
            disableOnInteraction: false, // Allow user interaction to not pause auto-play
          }}
          modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
          className="mySwiper"
        >
          {slidercomponents.map((item, index) => {
            return (
              <SwiperSlide
                key={index}
                onClick={() => {
                  window.open(item?.link, "_blank");
                }}
              >
                <img src={item.imageLink} alt="" />
                <div className="slidecomp">
                  <div className="slidecomp_det">
                    <h5>{language === "ar" ? item.title_ar : item.title}</h5>
                    <p>{language !== "ar" ? item.text : item.text_ar}</p>
                    <button>
                      <span>{language === "ar" ? "تفاصيل" : "details"}</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Slider;

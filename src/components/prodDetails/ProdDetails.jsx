import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Keyboard, Mousewheel, Pagination, Navigation } from "swiper/modules";
import "../ProductDetails/productdetails.css";
import PagesHeader from "../../PagesHeader/PagesHeader";
import { useSelector } from "react-redux";
import "./style.css";
import CountDown from "../countDownTimer/CountDown";

const ProdDetails = () => {
  const [offerDetails, setOfferDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [variants, setVariants] = useState(null);

  const [pageloading, setpageloading] = useState(true);
  const [images, setImages] = useState([]);

  const { id } = useParams();

  const getRoom = async () => {
    await axios
      .post("http://localhost:9999/v2/rooms/Select_Offer_Rooms", {
        offer_id: id,
        type: "user",
      })
      .then((res) => {
        console.log(res?.data?.message[0]);
        setOfferDetails(res?.data?.message[0]);
        setProductDetails(res?.data?.message[0]?.offer?.products[0]);
        setVariants(res?.data?.message[0]?.varients);
      })
      .catch((err) => err);
    setpageloading(false);
  };

  useEffect(() => {
    getRoom();
  }, []);

  const language = useSelector((state) => state.language.lang);

  return (
    <div>
      <div style={{ marginBottom: "80px" }} className="productdetails_page">
        {/* <Header/> */}
        <PagesHeader
          title={
            language == "ar"
              ? offerDetails?.offer.products[0].title_ar !== null
                ? offerDetails?.offer.products[0].title_ar
                : null
              : offerDetails?.offer.products[0].title !== null
              ? offerDetails?.offer.products[0].title
              : null
          }
        />

        <div style={{ marginTop: "30px" }} className="product_details">
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
            // mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Keyboard]}
            className="mySwiper"
          >
            {offerDetails
              ? offerDetails?.varients[0]?.data?.images?.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div style={{ height: "100%" }} className="product_img">
                        <img src={item.link} alt="" />
                      </div>
                      {/* <div>{ item.link}</div> */}
                    </SwiperSlide>
                  );
                })
              : ""}
          </Swiper>

          <div className="tabel_details">
            <div className="tabel-row">
              <div>{language == "ar" ? "الاسم" : "Title"}</div>
              <div>
                {language == "ar"
                  ? productDetails?.title_ar
                  : productDetails?.title}
              </div>
            </div>

            <div className="tabel-row">
              <div>{language == "ar" ? "الفئة" : "Category"}</div>
              <div>
                {language == "ar"
                  ? productDetails?.category_name_ar
                  : productDetails?.category_name}
              </div>
            </div>

            <div className="tabel-row">
              <div>{language == "ar" ? "الموديل" : "Model"}</div>
              <div>{productDetails?.model_number}</div>
            </div>
            <div className="tabel-row">
              <div>{language == "ar" ? "الشركة" : "Company"}</div>
              <div>{productDetails?.producing_company}</div>
            </div>

            <div className="tabel-row">
              <div>{language == "ar" ? "الحالة" : "Grade"}</div>
              <div>
                {productDetails?.grade == "used"
                  ? language == "ar"
                    ? "متسخدم"
                    : "Used"
                  : language == "ar"
                  ? "جديد"
                  : "New"}
              </div>
            </div>

            <div className="details">
              <h4>{language == "ar" ? "الوصف" : "Details"}</h4>
              <p>
                {language == "ar"
                  ? productDetails?.description_ar
                  : productDetails?.description}
              </p>
            </div>

            <div className="details">
              <h4>{language == "ar" ? "الشروط" : "Conditions"}</h4>
              <p>
                {language == "ar"
                  ? productDetails?.conditions_ar
                  : productDetails?.conditions}
              </p>
            </div>

            <div className="variants">
              {variants
                ? variants.map((varinat) => {
                    return (
                      <div className="var">
                        <div className="price">
                          <h4>{language == "ar" ? "السعر" : "price"}</h4>
                          {varinat?.old_price}
                        </div>
                        <div>
                          <CountDown seconds={varinat.rate_time} />
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdDetails;

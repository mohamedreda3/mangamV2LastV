import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import "../../HomeOpern/Offers/Offers";
import "../../HomeOpern/homeopen.css";
import "./hotoffers.css";
import { Loader } from "rsuite";
import HomeHeader from "../HomeHeader/HomeHeader";
import { default as Pusher, default as pusherJs } from "pusher-js";
import CountDown from "../../countDownTimer/CountDown";
import { Swiper } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";

const BiddingRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParam = useSearchParams();
  const [offers, setoffers] = useState([]);
  const [pageloading, setpageloading] = useState(true);
  const [offerDetails, setOfferDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [variants, setVariants] = useState(null);

  const [newPrice, setNewPrice] = useState([]);
  const language = useSelector((state) => state.language.lang);
  const [room, setRoom] = useState(false);
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );

  const getRoom = async () => {
    await axios
      .post("http://localhost:9999/v2/rooms/Select_Offer_Rooms", {
        offer_id: location?.state?.offer_id,
        type: "user",
      })
      .then((res) => {
        setoffers(res?.data?.message);
        setOfferDetails(res?.data?.message[0]);
        setProductDetails(res?.data?.message[0]?.offer?.products[0]);
        setVariants(res?.data?.message[0]?.varients);
        setNewPrice(res?.data?.message[0]?.varients?.new_price);
      })
      .catch((err) => err);
    setpageloading(false);
  };

  useEffect(() => {
    if (offers[0]?.stopped) {
      window.location.href = "/";
    }
  }, [offers]);
  const [joinLoading, setJoinLoading] = useState(false);
  const joinQueue = (coins, roomId, offer_id) => {
    console.log(offers[0]);
    setJoinLoading(true);
    axios
      .post("http://localhost:9999/v2/rooms/join_queue", {
        user_id: userData?.userId,
        user_image: userData?.userPicture,
        user_name: userData?.username,
        cost: coins,
        offer_id: offers[0]?.offer_id,
        rooms_id: offers[0]?.room_id,
        queue_id: offers[0]?.queue?.id,
        store: parseInt(userData?.storeId) == 2 ? "ksa" : "uae",
      })
      .then((res) => {
        if (res?.data?.status) {
          navigate("/Queue", {
            state: {
              offer_id: offers[0]?.offer_id,
              queue_id: offers[0]?.queue?.id,
              user_id: userData?.userId,
            },
          });
          toast.success(
            language == "ar" ? "تم الالتحاق بنجاح" : "Joined SuccessFully"
          );
          setJoinLoading(false);
        } else {
          toast.error(language == "ar" ? "فشل الالتحاق" : "Joined Failed");
          setJoinLoading(false);
        }
      })
      .catch((err) => err)
      .finally(() => {
        setJoinLoading(false);
      });
  };
  useEffect(() => {
    let requestInProgress = false;

    async function fetchData() {
      try {
        pusherJs.logToConsole = false;

        var pusher = new Pusher("d207d6ba54517230b8ab", {
          cluster: "ap2",
        });
        var channel = pusher.subscribe("my-channel");

        if (!requestInProgress) {
          requestInProgress = true;
          // Fetch room data initially
          // const roomData = await getRoom();
          setpageloading(false);
          requestInProgress = false;

          // Listen for price changes only after initial data fetching
          channel.bind("priceReduced", async function (data) {
            // console.log(data);
            await getRoom();
            // setNewPrice(data?.data[1]);
            setpageloading(false);
          });

          function handleDisconnection() {
            pusher.connect();
          }

          pusher.connection.bind("disconnected", handleDisconnection);
        }
      } catch (e) {
        console.log(e);
      }
    }

    // Fetch data when component mounts
    fetchData();
  }, [pusherJs]);

  useEffect(() => {
    getRoom();
  }, []);
  useEffect(() => {
    console.log("offers", offers);
  }, [offers]);
  const [showJoiners, setShowJoiners] = useState(false);
  return (
    <div className="offerPage">
      <div className="headerhome">
        {/* <Header/> */}
        <HomeHeader />
        {/* <button>Recharge balance</button> */}
      </div>

      {pageloading ? (
        <Loader />
      ) : (
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
          <div className="open_offers roomOffer">
            <ul>
              <ul className="varient">
                {offers[0]?.varients?.map((item, index) => {
                  if (index == 0)
                    return (
                      <li>
                        <div
                          style={{
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <del
                            style={{
                              color: "grey",
                              fontWeight: "bold",
                            }}
                          >
                            ${item?.old_price}
                          </del>
                          <span
                            style={{
                              color: "red",
                              margin: "10px",
                              fontWeight: "bold",
                              fontSize: "22px",
                            }}
                          >
                            ${item?.new_price}
                          </span>
                        </div>
                      </li>
                    );
                })}
              </ul>
            </ul>
            <ul>
              {/* <div className="rowDiv">
                {" "}
                <h3 onClick={() => setShowJoiners(!showJoiners)}>
                  {language == "ar" ? "الملتحقين بالغرفة" : "Joiners"}
                </h3>
              </div> */}
              {/* {showJoiners ? ( */}
              <ul>
                {offers[0]?.participants?.map((item) => {
                  return (
                    <li>
                      <div className="profileJoin">
                        <img src={item?.user_image} alt="" />
                        <div className="profileTexts">
                          <span>{item?.user_name}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* ) : null} */}
            </ul>

            <div className="rowDiv">
              {joinLoading ? (
                <Loader />
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    joinQueue();
                  }}
                >
                  Buy Now
                </button>
              )}
              {/* <button className="btn btn-danger">Leave</button> */}
            </div>
          </div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default BiddingRoom;

import React, { useEffect, useState } from 'react';
import './hotoffers.css';
import "../../HomeOpern/Offers/Offers";
import "../../HomeOpern/homeopen.css";
import Countdown from 'react-countdown';
import axios from 'axios';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { Loader } from 'rsuite';
const HotOffers = () => {
  const navigate = useNavigate();
  const [offers, setoffers] = useState([]);
  const [pageloading, setpageloading] = useState(true);
  const language = useSelector((state) => state.language.lang);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );
  const notifyMe = (id) => {
    setNotifyLoading(true);
    const data_send = {
      user_id: userData?.userId,
      offer_id: id,
    };
    axios
      .post("https://manjam.onrender.com/offers/notifyMe", data_send)
      .then((res) => {
        console.log(res);
        toast.success(
          language == "ar"
            ? "!.شكرا, سوف نخبرك"
            : "Thanks, We will notify you.!"
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setNotifyLoading(false);
      });
  };
  const getProducts = () => {
    const data_send = {
      type: 'user',
    };
    axios
      .post("https://manjam.onrender.com/offers/select_offers", data_send)
      .then((res) => {
        // console.log(res.data.message);
        if (Array.isArray(res.data.message)) {
          setoffers(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setpageloading(false);
      });
  };
  useEffect(() => {
    getProducts();
  }, []);

  const renderer = ({
    total,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    completed,
  }) => {
    if (completed) {
      // getProducts();
      return null;
    } else {
      // Render a countdown
      <span>
        {hours}:{minutes}:{seconds}
      </span>;
      return (
        <>
          <div>
            <h6 style={{ color: "#F48320" }}>
              {days < 10 ? '0' + days : days}
            </h6>
            {/* <h5>days</h5> */}
          </div>
          <span>:</span>
          <div>
            <h6 style={{ color: "#F48320" }}>
              {hours < 10 ? '0' + hours : hours}
            </h6>
            {/* <h5>Hours</h5> */}
          </div>
          <span>:</span>
          <div>
            <h6 style={{ color: "#F48320" }}>
              {minutes < 10 ? '0' + minutes : minutes}
            </h6>
            {/* <h5>Mins</h5> */}
          </div>
          <span>:</span>
          <div>
            <h6>{seconds < 10 ? '0' + seconds : seconds}</h6>
          </div>
        </>
      );
    }
  };
  return (
    <div className="offerPage">
      <div className="open_offers">
        <div className="offers_title">
          <h3>{language == 'ar' ? "عروض" : "Hot Offers"}</h3>
          <h6
            style={{ cursor: 'pointer' }}
            onClick={() => navigate("/otherof")}
          >
            {language == 'ar' ? "مشاهدة الكل" : "See All"}
          </h6>
        </div>
      </div>
      {pageloading ? (
        <div>
          <Skeleton count={10} />
        </div>
      ) : offers && offers.length > 0 ? (
        offers.map((item, index) => {
          if (
            item.time_av_after.days >= 0 &&
            item.time_av_after.hours >= 0 &&
            item.time_av_after.minutes >= 0 &&
            item.time_av_after.seconds >= 0
          ) {
            return (
              <div
                className={
                  item.time_av_after.days >= 0 &&
                  item.time_av_after.hours >= 0 &&
                  item.time_av_after.minutes >= 0 &&
                  item.time_av_after.seconds >= 0
                    ? "offer_card"
                    : "offer_card offer_card_without_counter"
                }
                onClick={() => {
                  // navigate("/productdetaisldes",{state:{productdata:item,id:item.products[0].id}})
                }}
              >
                <div className="notify" onClick={() => notifyMe(item?.id)}>
                  {!notifyLoading ? (
                    <>
                      {" "}
                      <img src={require("../../../assets/notpil.png")} alt="" />
                      <h6>{language == 'ar' ? "إضافة تنبيه" : "Notify Me"}</h6>
                    </>
                  ) : (
                    <Loader />
                  )}
                </div>
                <img
                  src={item?.products[0]?.colors[0]?.images[0]?.link}
                  alt=""
                />
                <div className="offer_details">
                  <div className="offer_time">
                    <Countdown
                      date={Date.now() + item?.time_av_after?.milliSeconds}
                      renderer={renderer}
                    />
                  </div>
                  <p
                    className="offertitle"
                    style={{
                      color: 'black',
                      marginBottom: "10px",
                      fontWeight: "600",
                      textAlign: "start",
                    }}
                  >
                    {language == 'ar'
                      ? item?.products[0]?.title_ar
                      : item?.products[0]?.title}
                  </p>
                  <h6 className="offertitle">
                    {language == 'ar'
                      ? item?.products[0]?.description_ar
                      : item?.products[0]?.description}
                  </h6>
                  <hr />
                  <div className="offer_price">
                    <div>
                      <h5>{language == 'ar' ? "سعر المنتج" : "item price"}</h5>
                      <h6 style={{ fontSize: '11px', marginTop: '8px' }}>
                        $
                        <del>
                          {
                            item?.products[0]?.colors[0]?.props[0]?.values[0]
                              ?.old_price
                          }
                        </del>
                      </h6>
                      <h6>
                        {
                          item?.products[0]?.colors[0]?.props[0]?.values[0]
                            ?.new_price
                        }
                        $
                        {/* ${(Math.floor(item?.price*1 - ((item?.price*1) * (item?.discount / 100))))} */}
                      </h6>
                    </div>
                    <button style={{ width: 'fit-content' }}>
                      {item?.products[0]?.colors[0]?.props[0]?.values[0].stock >
                      10
                        ? item?.products[0]?.colors[0]?.props[0]?.values[0]
                            .stock + (language == 'ar' ? "قطعه" : " pieces")
                        : (item?.products[0]?.colors[0]?.props[0]?.values[0]
                            .stock || 0) +
                          (language == 'ar' ? "قطعه" : " pieces")}
                    </button>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="open_offers">
                <div className="open_ofers_content offer_card_without_counter">
                  {item &&
                  item?.time_av_for?.days >= 0 &&
                  item?.time_av_for?.hours >= 0 &&
                  item?.time_av_for?.minutes >= 0 &&
                  item?.time_av_for?.seconds >= 0 ? (
                    <div
                      onClick={() => {
                        navigate("/productdetails", {
                          state: { id: item?.products[0].id, offer: item },
                        });
                      }}
                      className="open_offer"
                    >
                      <img
                        src={item?.products[0]?.colors[0]?.images[0]?.link}
                        alt=""
                      />
                      <div className="offer_details">
                        <div className="offer_time">
                          <Countdown
                            date={
                              Date.now() + item?.time_av_after?.milliSeconds
                            }
                            renderer={renderer}
                          />
                        </div>
                        <p
                          className="offertitle"
                          style={{
                            color: 'black',
                            marginBottom: "10px",
                            fontWeight: "600",
                            textAlign: "start",
                          }}
                        >
                          {language == 'ar'
                            ? item?.products[0]?.title_ar
                            : item?.products[0]?.title}
                        </p>
                        <h6 className="offertitle">
                          {language == 'ar'
                            ? item?.products[0]?.description_ar
                            : item?.products[0]?.description}
                        </h6>
                        <hr />
                        <div className="offer_price">
                          <div>
                            <h5>
                              {language == 'ar' ? "سعر المنتج" : "item price"}
                            </h5>
                            <h6 style={{ fontSize: '11px', marginTop: '8px' }}>
                              $
                              <del>
                                {
                                  item?.products[0].colors[0].props[0].values[0]
                                    .old_price
                                }
                              </del>
                            </h6>
                            <h6>
                              {
                                item?.products[0].colors[0].props[0].values[0]
                                  .new_price
                              }
                              $
                              {/* ${(Math.floor(item?.price*1 - ((item?.price*1) * (item?.discount / 100))))} */}
                            </h6>
                          </div>
                          <button>
                            {item?.products[0]?.colors[0]?.props[0].values[0]
                              .stock > 10
                              ? item?.products[0]?.colors[0]?.props[0].values[0]
                                  .stock +
                                (language == 'ar' ? "قطعه" : " pieces")
                              : (item?.products[0]?.colors[0]?.props[0]
                                  .values[0].stock || 0) +
                                (language == 'ar' ? "قطعه" : " pieces")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <h4>No Offers</h4>
                  )}
                </div>
              </div>
            );
          }
        })
      ) : (
        <h4>No Offers</h4>
      )}
    </div>
  );
};

export default HotOffers;

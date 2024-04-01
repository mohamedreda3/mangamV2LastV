import React, { useEffect, useState } from "react";
import "./hotoffers.css";
import "../../HomeOpern/Offers/Offers";
import "../../HomeOpern/homeopen.css";
import Countdown from "react-countdown";
import axios from "axios";
import { useNavigate } from "react-router";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { default as Pusher, default as pusherJs } from "pusher-js";
import Modal from "./modal";

const HotOffers = () => {
  const navigate = useNavigate();
  const [offers, setoffers] = useState([]);
  const [pageloading, setpageloading] = useState(true);
  const language = useSelector((state) => state.language.lang);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
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
  const getProducts = async () => {
    const data_send = {
      type: "user",
      user_id: userData?.userId,
    };
    await axios
      .post("https://api.manjam.shop/v2/offers/select_offers", data_send)

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
          // Make the request to get products
          await getProducts();
          // toast.warn(language == "ar" ? "بدأت المناقصة" : "Terndered Started");
          setJoinLoading(false);
          requestInProgress = false;
          channel.bind("NewJoiner", async function (data) {
            // console.log(data);
            await getProducts();
          });
          // Bind Pusher event handlers after the request has completed
          channel.bind("startTender", async function (data) {
            if (!requestInProgress) {
              requestInProgress = true;
              await getProducts();

              setJoinLoading(false);
              requestInProgress = false;
            }
          });
          channel.bind("priceReduced", async function (data) {
            if (!requestInProgress) {
              requestInProgress = true;
              await getProducts();
              setJoinLoading(false);
              requestInProgress = false;
            }
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

    // Call fetchData function only once after the component mounts
    fetchData();
  }, [pusherJs]);

  const joinRoom = (coins, roomId, offer_id) => {
    setJoinLoading(true);
    axios
      .post("https://api.manjam.shop/v2/rooms/join", {
        user_id: userData?.userId,
        user_image: userData?.userPicture,
        user_name: userData?.username,
        cost: coins,
        offer_id: offer_id,
        rooms_id: roomId,
        store: parseInt(userData?.storeId) == 2 ? "ksa" : "uae",
      })
      .then((res) => {
        if (res?.data?.status) {
          toast.success(
            language == "ar" ? "تم الالتحاق بنجاح" : "Joined SuccessFully"
          );
          setModal(false);
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
              {days < 10 ? "0" + days : days}
            </h6>
            {/* <h5>days</h5> */}
          </div>
          <span>:</span>
          <div>
            <h6 style={{ color: "#F48320" }}>
              {hours < 10 ? "0" + hours : hours}
            </h6>
            {/* <h5>Hours</h5> */}
          </div>
          <span>:</span>
          <div>
            <h6 style={{ color: "#F48320" }}>
              {minutes < 10 ? "0" + minutes : minutes}
            </h6>
            {/* <h5>Mins</h5> */}
          </div>
          <span>:</span>
          <div>
            <h6>{seconds < 10 ? "0" + seconds : seconds}</h6>
          </div>
        </>
      );
    }
  };
  return (
    <div className="offerPage">
      <div className="open_offers">
        <div className="offers_title">
          <h3>{language === "ar" ? "عروض" : "Hot Offers"}</h3>
          <h6
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/otherof")}
          >
            {language === "ar" ? "مشاهدة الكل" : "See All"}
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
                {/* <div className="notify" onClick={() => notifyMe(item?.id)}>
                  {!notifyLoading ? (
                    <>
                      {" "}
                      <img src={require("../../../assets/notpil.png")} alt="" />
                      <h6>{language == "ar" ? "إضافة تنبيه" : "Notify Me"}</h6>
                    </>
                  ) : (
                    <Loader />
                  )}
                </div> */}
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
                      color: "#152248",
                      marginBottom: "10px",
                      fontWeight: "bolder",
                      textAlign: "start",
                    }}
                  >
                    {language === "ar"
                      ? item?.products[0]?.title_ar
                      : item?.products[0]?.title}
                  </p>
                  <h6 className="offer_description blured">
                    {language === "ar"
                      ? item?.products[0]?.description_ar
                      : item?.products[0]?.description}
                  </h6>
                  <hr />
                  <div className="offer_price">
                    <div className="price">
                      <h5>{language === "ar" ? "سعر المنتج" : "item price"}</h5>
                      <h6 style={{ fontSize: "11px", marginTop: "8px" }}>
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

                    <div
                      style={{ color: "#FFF" }}
                      className="notify"
                      onClick={() => notifyMe(item?.id)}
                    >
                      {!notifyLoading ? (
                        <>
                          {" "}
                          <img
                            src={require("../../../assets/notpil.png")}
                            alt=""
                          />
                          <h6>
                            {language == "ar" ? "إضافة تنبيه" : "Notify Me"}
                          </h6>
                        </>
                      ) : (
                        <Loader />
                      )}
                    </div>
                    {/* <button style={{ width: "fit-content" }}>
                      {item?.products[0]?.colors[0]?.props[0]?.values[0].stock >
                      10
                        ? item?.products[0]?.colors[0]?.props[0]?.values[0]
                            .stock + (language == "ar" ? "قطعه" : " pieces")
                        : (item?.products[0]?.colors[0]?.props[0]?.values[0]
                            .stock || 0) +
                          (language == "ar" ? "قطعه" : " pieces")}
                    </button> */}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="open_offers">
                {
                  <div className="open_ofers_content offer_card_without_counter">
                    {item &&
                    item?.time_av_for?.days >= 0 &&
                    item?.time_av_for?.hours >= 0 &&
                    item?.time_av_for?.minutes >= 0 &&
                    item?.time_av_for?.seconds >= 0 ? (
                      <>
                        {" "}
                        {item?.isTendered ? (
                          <div className="open_offer">
                            <img
                              onClick={() => {
                                navigate(
                                  "/productdetails?offer_id=" + item?.id,
                                  {
                                    state: {
                                      id: item?.products[0].id,
                                      offer: item,
                                    },
                                  }
                                );
                              }}
                              src={
                                item?.products[0]?.colors[0]?.images[0]?.link
                              }
                              alt=""
                            />
                            <div className="offer_details">
                              <div className="offer_time">
                                <Countdown
                                  date={
                                    Date.now() +
                                    item?.time_av_after?.milliSeconds
                                  }
                                  renderer={renderer}
                                />
                              </div>
                              <p
                                className="offertitle"
                                style={{
                                  color: "#152248",
                                  marginBottom: "10px",
                                  fontWeight: "bolder",
                                  textAlign: "start",
                                }}
                              >
                                {language === "ar"
                                  ? item?.products[0]?.title_ar
                                  : item?.products[0]?.title}
                              </p>
                              <h6 className="offer_description">
                                {language === "ar"
                                  ? item?.products[0]?.description_ar
                                  : item?.products[0]?.description}
                              </h6>
                              <hr />
                              <div className="offer_price ">
                                <div className="price">
                                  <h5>
                                    {language === "ar"
                                      ? "سعر المنتج"
                                      : "item price"}
                                  </h5>
                                  <h6
                                    style={{
                                      fontSize: "11px",
                                      marginTop: "8px",
                                    }}
                                  >
                                    $
                                    <del>
                                      {
                                        item?.products[0].colors[0].props[0]
                                          .values[0].old_price
                                      }
                                    </del>
                                  </h6>
                                  <h6>
                                    {
                                      item?.products[0].colors[0].props[0]
                                        .values[0].new_price
                                    }
                                    $
                                    {/* ${(Math.floor(item?.price*1 - ((item?.price*1) * (item?.discount / 100))))} */}
                                  </h6>
                                </div>
                                {/* <button>
                            {item?.products[0]?.colors[0]?.props[0].values[0]
                              .stock > 10
                              ? item?.products[0]?.colors[0]?.props[0].values[0]
                                  .stock +
                                (language == "ar" ? "قطعه" : " pieces")
                              : (item?.products[0]?.colors[0]?.props[0]
                                  .values[0].stock || 0) +
                                (language == "ar" ? "قطعه" : " pieces")}
                          </button> */}
                              </div>
                              <div className="joiners">
                                <div className="spinner-title">
                                  <div
                                    className="spinner"
                                    style={{
                                      maxWidth: "48px",
                                      maxHeight: "48px",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <CircularProgressbarWithChildren
                                      value={
                                        item?.joiners?.length /
                                        item?.room?.max_members
                                      }
                                      maxValue={1}
                                      strokeWidth={10}
                                      styles={buildStyles({
                                        // Rotation of path and trail, in number of turns (0-1)
                                        // rotation: 0.25,

                                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        // strokeLinecap: 'butt',

                                        // Text size
                                        textSize: "16px",

                                        // How long animation takes to go from one percentage to another, in seconds
                                        pathTransitionDuration: 0.9,

                                        // Can specify path transition in more detail, or remove it entirely
                                        // pathTransition: 'none',
                                        // Colors
                                        pathColor: `#F48320`,
                                        textColor: "#222",
                                        trailColor: "#D0E2FF",
                                        backgroundColor: "#3e98c7",
                                      })}
                                    >
                                      <div className="spinner-text">
                                        <div className="title">
                                          {language == "ar"
                                            ? "المشتركين"
                                            : "JOINERS"}
                                        </div>
                                        <div className="count">
                                          {language == "ar" ? (
                                            <>
                                              <span>
                                                {item?.joiners?.length}
                                              </span>
                                              <span>من</span>
                                              <span>
                                                {item?.room?.max_members}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span>
                                                {item?.joiners?.length}
                                              </span>
                                              <span>of</span>
                                              <span>
                                                {item?.room?.max_members}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </CircularProgressbarWithChildren>
                                  </div>
                                  <div className="description">
                                    {" "}
                                    {language == "ar"
                                      ? item?.joiners?.length !=
                                          item?.room?.max_members &&
                                        item?.isTendered
                                        ? " ستبدأ المناقصة عند اكتمال عدد المنضمين"
                                        : "المناقصة بدأت"
                                      : item?.joiners?.length !=
                                          item?.room?.max_members &&
                                        item?.isTendered
                                      ? "Tender will begin when the number of joiners is complete"
                                      : "Bidding has started"}
                                  </div>
                                </div>

                                <>
                                  {!joinLoading ? (
                                    <button className="join-view">
                                      {item?.isTendered &&
                                      !item?.joiners?.filter((item) => {
                                        return (
                                          item?.user_id?.toString() ===
                                          userData?.userId?.toString()
                                        );
                                      })?.length ? (
                                        <>
                                          <div
                                            className=""
                                            onClick={() => {
                                              if (userData?.coins >= item?.cost)
                                                setModal([
                                                  item?.cost,
                                                  item?.room?.id
                                                    ? item?.room?.id
                                                    : "0",
                                                  item?.id,
                                                ]);
                                              else
                                                toast.error(
                                                  language == "ar"
                                                    ? "ليس لديك نقاط كافية للالتحاق بالمناقصة"
                                                    : "You are not have enough points to join"
                                                );
                                            }}
                                          >
                                            {language === "ar"
                                              ? "اشترك الآن"
                                              : "Join Now"}
                                          </div>
                                          <div className="join-price">
                                            {language === "ar"
                                              ? "مقابل $"
                                              : "for"}
                                            <img
                                              src={require("../../../assets/lc_coin.png")}
                                              alt=""
                                            />
                                            {item?.cost}
                                          </div>
                                        </>
                                      ) : (
                                        <button
                                          className="join-view"
                                          disabled={
                                            item?.joiners?.length !=
                                              item?.room?.max_members &&
                                            item?.isTendered
                                          }
                                          onClick={() =>
                                            item?.joiners?.length ==
                                              item?.room?.max_members &&
                                            item?.isTendered
                                              ? navigate(
                                                  "/productdetails?offer_id=" +
                                                    item?.id,
                                                  {
                                                    state: {
                                                      id: item?.products[0].id,
                                                      offer: item,
                                                    },
                                                  }
                                                )
                                              : null
                                          }
                                          style={{
                                            backgroundColor:
                                              item?.joiners?.length !=
                                                item?.room?.max_members &&
                                              item?.isTendered
                                                ? "#fe8d2a80"
                                                : "#FE8D2A",
                                          }}
                                        >
                                          {" "}
                                          {language === "ar" ? "عرض" : "View"}
                                        </button>
                                      )}
                                    </button>
                                  ) : (
                                    <Loader />
                                  )}
                                </>
                              </div>
                            </div>
                          </div>
                        ) : item.time_av_after.days >= 0 &&
                          item.time_av_after.hours >= 0 &&
                          item.time_av_after.minutes >= 0 &&
                          item.time_av_after.seconds >= 0 ? (
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
                            <div
                              className="notify"
                              onClick={() => notifyMe(item?.id)}
                            >
                              {!notifyLoading ? (
                                <>
                                  {" "}
                                  <img
                                    src={require("../../../assets/notpil.png")}
                                    alt=""
                                  />
                                  <h6>
                                    {language == "ar"
                                      ? "إضافة تنبيه"
                                      : "Notify Me"}
                                  </h6>
                                </>
                              ) : (
                                <Loader />
                              )}
                            </div>
                            <img
                              src={
                                item?.products[0]?.colors[0]?.images[0]?.link
                              }
                              alt=""
                            />
                            <div className="offer_details">
                              <div className="offer_time">
                                <Countdown
                                  date={
                                    Date.now() +
                                    item?.time_av_after?.milliSeconds
                                  }
                                  renderer={renderer}
                                />
                              </div>
                              <p
                                className="offertitle"
                                style={{
                                  color: "black",
                                  marginBottom: "10px",
                                  fontWeight: "600",
                                  textAlign: "start",
                                }}
                              >
                                {language == "ar"
                                  ? item?.products[0]?.title_ar
                                  : item?.products[0]?.title}
                              </p>
                              <h6 className="offertitle">
                                {language == "ar"
                                  ? item?.products[0]?.description_ar
                                  : item?.products[0]?.description}
                              </h6>
                              <hr />
                              <div className="offer_price">
                                <div>
                                  <h5>
                                    {language == "ar"
                                      ? "سعر المنتج"
                                      : "item price"}
                                  </h5>
                                  <h6
                                    style={{
                                      fontSize: "11px",
                                      marginTop: "8px",
                                    }}
                                  >
                                    $
                                    <del>
                                      {
                                        item?.products[0]?.colors[0]?.props[0]
                                          ?.values[0]?.old_price
                                      }
                                    </del>
                                  </h6>
                                  <h6>
                                    {
                                      item?.products[0]?.colors[0]?.props[0]
                                        ?.values[0]?.new_price
                                    }
                                    $
                                    {/* ${(Math.floor(item?.price*1 - ((item?.price*1) * (item?.discount / 100))))} */}
                                  </h6>
                                </div>
                                <button style={{ width: "fit-content" }}>
                                  {item?.products[0]?.colors[0]?.props[0]
                                    ?.values[0].stock > 10
                                    ? item?.products[0]?.colors[0]?.props[0]
                                        ?.values[0].stock +
                                      (language == "ar" ? "قطعه" : " pieces")
                                    : (item?.products[0]?.colors[0]?.props[0]
                                        ?.values[0].stock || 0) +
                                      (language == "ar" ? "قطعه" : " pieces")}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="open_offers">
                            <div className="open_ofers_content offer_card_without_counter">
                              {item &&
                              item?.time_av_for?.days >= 0 &&
                              item?.time_av_for?.hours >= 0 &&
                              item?.time_av_for?.minutes >= 0 &&
                              item?.time_av_for?.seconds >= 0 ? (
                                <div
                                  onClick={() => {
                                    navigate(
                                      "/productdetails?offer_id=" + item?.id,
                                      {
                                        state: {
                                          id: item?.products[0].id,
                                          offer: item,
                                        },
                                      }
                                    );
                                  }}
                                  className="open_offer"
                                >
                                  <img
                                    src={
                                      item?.products[0]?.colors[0]?.images[0]
                                        ?.link
                                    }
                                    alt=""
                                  />
                                  <div className="offer_details">
                                    <div className="offer_time">
                                      <Countdown
                                        date={
                                          Date.now() +
                                          item?.time_av_after?.milliSeconds
                                        }
                                        renderer={renderer}
                                      />
                                    </div>
                                    <p
                                      className="offertitle"
                                      style={{
                                        color: "black",
                                        marginBottom: "10px",
                                        fontWeight: "600",
                                        textAlign: "start",
                                      }}
                                    >
                                      {language == "ar"
                                        ? item?.products[0]?.title_ar
                                        : item?.products[0]?.title}
                                    </p>
                                    <h6 className="offertitle">
                                      {language == "ar"
                                        ? item?.products[0]?.description_ar
                                        : item?.products[0]?.description}
                                    </h6>
                                    <hr />
                                    <div className="offer_price joiners">
                                      <div>
                                        <h5>
                                          {language == "ar"
                                            ? "السعر "
                                            : " price"}
                                        </h5>

                                        <h6
                                          style={{
                                            color: "#FE8D2A",
                                          }}
                                        >
                                          {
                                            item?.products[0].colors[0].props[0]
                                              .values[0].new_price
                                          }
                                          $
                                          {/* ${(Math.floor(item?.price*1 - ((item?.price*1) * (item?.discount / 100))))} */}
                                        </h6>
                                      </div>
                                      <button
                                        className="join-view"
                                        disabled={
                                          item?.joiners?.length !=
                                            item?.room?.max_members &&
                                          item?.isTendered
                                        }
                                        onClick={() =>
                                          item?.joiners?.length ==
                                            item?.room?.max_members &&
                                          item?.isTendered
                                            ? navigate(
                                                "/productdetails?offer_id=" +
                                                  item?.id,
                                                {
                                                  state: {
                                                    id: item?.products[0].id,
                                                    offer: item,
                                                  },
                                                }
                                              )
                                            : null
                                        }
                                        style={{
                                          color: "white",
                                          backgroundColor:
                                            item?.joiners?.length !=
                                              item?.room?.max_members &&
                                            item?.isTendered
                                              ? "#fe8d2a80"
                                              : "#FE8D2A",
                                        }}
                                      >
                                        {" "}
                                        {language === "ar"
                                          ? "شراء الآن"
                                          : "Buy Now"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <h4>No Offers</h4>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <h4>No Offers</h4>
                    )}
                  </div>
                }
              </div>
            );
          }
        })
      ) : (
        <h4>No Offers</h4>
      )}
      <Modal
        visible={modal}
        onClose={setModal}
        title={language == "ar" ? "الالتحاق بالغرفة" : "Join Room"}
      >
        <>
          <p style={{ margin: "10px", padding: "10px" }}>
            {language == "ar"
              ? `

يجب على المتقدمين تقديم عروضهم بشكل كامل وفي الموعد المحدد دون أي تأخير.
يتعين على المتقدمين تقديم ضمان بنكي صالح للفترة المناسبة وبمبلغ محدد.
يجب أن تتوافق الشركات المتقدمة مع المعايير الفنية والمتطلبات القانونية المحددة في الإعلان.
يتوجب على المتقدمين تقديم وثائق تثبت خبرتهم وقدراتهم الفنية والمالية لتنفيذ المشروع بنجاح.`
              : `The solutions must be fully advanced using the authority tool without any delay.
Applicants must provide bank guarantees to suit the intended orientation and in a specified amount.
There must be specific requirements in the advertisement.
In particular, applicants must submit documents that indicate their effective financial and financial background and areas.`}
          </p>
          {joinLoading ? (
            <Loader />
          ) : (
            <button
              className="btn btn-success"
              onClick={() => {
                joinRoom(...modal);
              }}
            >
              {language === "ar" ? "اشترك الآن" : "Join Now"}
            </button>
          )}
        </>
      </Modal>
    </div>
  );
};

export default HotOffers;

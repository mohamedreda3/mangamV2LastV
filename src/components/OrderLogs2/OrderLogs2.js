import React, { useEffect } from "react";
import { useState } from "react";
import PagesHeader from "../../PagesHeader/PagesHeader";
import "./orderlogs.css";
import { useNavigate } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useSelector } from "react-redux";
import Returns from "../Returns/Returns";
import HomeHeader from "../Home/HomeHeader/HomeHeader";
import Skeleton from "react-loading-skeleton";
const OrderLogs2 = () => {
  const [loading, setloading] = useState(true);

  const language = useSelector((state) => state.language.lang);
  const navigate = useNavigate();
  const [showfilters, setshowfilters] = useState(false);
  const [productsItems, setproductsItems] = useState([]);
  const [ReturnsItems, setReturnsItems] = useState([]);
  const [orderstuatus, setorderstuatus] = useState("");
  const [ordertype, setordertype] = useState("orders");
  const [originalOrder, setOriginalOrder] = useState([]);
  const [originalReturns, setoriginalReturns] = useState([]);
  const [returnstatus, setreturnstatus] = useState("");
  const [ordersloading, setordersloading] = useState(true);
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );
  const getorderProducts = () => {
    axios
      .post(
        "http://localhost:9999/v2/order/getAll?user_id=" + userData?.userId,
        {
          timeout: 89999990999999,
        }
      )
      .then((res) => {
        // console.log(res.data.message)
        if (Array.isArray(res.data.message)) {
          setproductsItems(res.data.message);
          // console.log(res.data.message)
          setOriginalOrder(res.data.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setordersloading(false);
      });
  };
  useEffect(() => {
    getorderProducts();
    console.log(productsItems);
  }, []);

  useEffect(() => {
    let allOrderData = [...originalOrder];
    // console.log(allOrderData)
    if (orderstuatus == "all") {
      setproductsItems(originalOrder);
    } else {
      let newOrderDate = allOrderData.filter(
        (item) => item.status == orderstuatus
      );
      setproductsItems(newOrderDate);
    }
  }, [orderstuatus]);
  useEffect(() => {
    let allOrderData = [...originalReturns];

    if (returnstatus == "all") {
      setReturnsItems(originalReturns);
    } else {
      let newOrderDate = allOrderData.filter(
        (item) => item.status == returnstatus
      );
      setReturnsItems(newOrderDate);
    }
  }, [returnstatus]);

  const getReturns = () => {
    const data_send = {
      user_id: userData?.userId,
    };
    axios
      .post("http://localhost:9999/v2/return/getReturns", data_send, {
        timeout: 89999990999999,
      })
      .then((res) => {
        // console.log(res.data.message);
        setReturnsItems(res.data.message);
        setoriginalReturns(res.data.message);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setloading(false);
      });
  };
  useEffect(() => {
    getReturns();
  }, []);
  return (
    <>
      {/* <HomeHeader /> */}
      <div className="orderlogs3">
        <div className="headerhome">
          {/* <Header/> */}
          <HomeHeader />
          {/* <button>Recharge balance</button> */}
        </div>
        {/* <PagesHeader title={language == 'ar' ? "سجل الطلبات" : "Order Log"} /> */}
        {/* <h5>{language === 'ar' ? "الفئات" : "Categories"}</h5> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <p className="header">
            {ordertype == "orders"
              ? language == "ar"
                ? " الطلبات"
                : "Order Logs"
              : language == "ar"
              ? " المسترجعات"
              : "Return Logs"}
          </p>
          <img
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setshowfilters(true);
            }}
            src={require("../../assets/Component 1.png")}
            alt=""
          />
        </div>
        {ordertype == "orders" ? (
          ordersloading ? (
            <div>
              <Skeleton count={10} />
            </div>
          ) : (
            <div className="products_logs">
              {productsItems?.length > 0 ? (
                productsItems?.map((item, index) => {
                  return (
                    <div
                      className="product"
                      onClick={() =>
                        navigate("/orderlogs", { state: { orderdata: item } })
                      }
                    >
                      <div className="top">
                        <div className="img">
                          {item?.products && item?.products.length ? (
                            item?.products[0]?.colors &&
                            item?.products[0]?.colors?.length ? (
                              <img
                                src={
                                  item?.products[0]?.colors[0]?.images[0]?.link
                                }
                                alt=""
                              />
                            ) : null
                          ) : null}
                        </div>
                        {console.log(item)}
                        <div className="des">
                          <h5>
                            {item?.products && item?.products.length
                              ? language == "ar"
                                ? item?.product_label
                                : item?.product_label
                              : null}
                          </h5>
                          <h5 style={{ color: "#312783" }} className="price">
                            {item?.product_total_price}$
                          </h5>
                          <h4>
                            {language == "ar" ? "المنتج من" : "item from"}{" "}
                            <span>
                              {item?.products && item?.products.length
                                ? item?.products[0]?.producing_company
                                : null}
                            </span>
                          </h4>
                          <h5>
                            <span
                              style={{
                                fontSize: "13px",
                                fontStyle: "normal",
                                fontWeight: 400,
                              }}
                            >
                              {language == "ar" ? "رقم الطلب" : "Order No"}{" "}
                            </span>
                            <span
                              style={{
                                fontSize: "13px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                opacity: "0.5",
                              }}
                            >
                              {item.id}
                            </span>
                          </h5>
                          <h2>
                            <span>
                              {language == "ar" ? "الحالة" : "Status"}{" "}
                            </span>
                            <span style={{ whiteSpace: "pre-wrap" }}>
                              {language == "ar"
                                ? item?.status == "pending"
                                  ? "في انتظار رد الموظف"
                                  : item?.status == "in_progress"
                                  ? "في انتظار رد بوابةالدفع"
                                  : item?.status == "on_way"
                                  ? "في الطريق"
                                  : item?.status == "completed" ||
                                    item?.status == "confirmed"
                                  ? "تمت الموافقة على الطلب"
                                  : item?.status == "canceled" ||
                                    item?.status == "reject"
                                  ? "تم رفض الطلب"
                                  : item?.status == "under_shipping"
                                  ? "الطلب تحول لشركة الشحن"
                                  : item?.status == "out_for_delivery"
                                  ? "الطلب في الطريق"
                                  : item?.status == "delivered"
                                  ? "تم توصيل الطلب"
                                  : item?.status == "Payment Failed"
                                  ? "لم تنجح عملية الدفع"
                                  : "هناك مشكلة في الطلب"
                                : item?.status}
                            </span>
                          </h2>
                          <p>
                            {item.quantity}{" "}
                            {language == "ar" ? "قطع" : "pieces"}
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="bottom">
                        <div>
                          <p>{language == "ar" ? "الكلى" : "Total"}</p>
                          <p>
                            {item?.grand_price * 1 +
                              (item?.old_price * 1 - item?.new_price)}
                            $
                          </p>
                        </div>
                        <div>
                          <p>{language == "ar" ? "الخصم" : "Discount"}</p>
                          <p>{item.old_price * 1 - item.new_price * 1}$</p>
                        </div>
                        <div>
                          <p>
                            {language == "ar" ? "السعر النهائى" : "Final Total"}
                          </p>
                          <p className="final">
                            {(item.grand_price * 1).toFixed(0)}$
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className="no_order"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: "60vh",
                  }}
                >
                  <div className="image" style={{ position: "relative" }}>
                    <img
                      style={{ maxWidth: "100%" }}
                      src={require("../../assets/receipt1.png")}
                      alt=""
                    />
                    <img
                      style={{ left: "15px", position: "absolute" }}
                      src={require("../../assets/receipt.png")}
                      alt=""
                    />
                  </div>
                  <h4>
                    {language == "ar" ? "لا طلبات حتى الأن" : "No Orders yet"}
                  </h4>
                  <button
                    onClick={() => {
                      navigate("/shopcategories");
                    }}
                  >
                    {language == "ar" ? "تصفح الفئات" : "Explore Categories"}
                  </button>
                </div>
              )}
            </div>
          )
        ) : loading ? (
          <Skeleton count={10} />
        ) : ReturnsItems.length > 0 ? (
          <Returns ReturnsItems={ReturnsItems} />
        ) : (
          <div
            className="no_order"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              height: "60vh",
            }}
          >
            <div className="image" style={{ position: "relative" }}>
              <img
                style={{ maxWidth: "100%", zIndex: "99" }}
                src={require("../../assets/rotate-left (2).png")}
                alt=""
              />
              <img
                style={{
                  left: "8px",
                  position: "absolute",
                  zIndex: "-1",
                  opacity: "0.4",
                }}
                src={require("../../assets/rotate-left.png")}
                alt=""
              />
            </div>
            <h4>{language == "ar" ? "لا يوجد مسترجعات" : "No Returns Yet"}</h4>
          </div>
        )}
        {showfilters ? (
          <div className="filter_parent_div">
            <div className="filter_div">
              <AiOutlineClose
                onClick={() => {
                  setshowfilters(false);
                }}
              />
              <div></div>
              <h4>{language == "ar" ? "فلتره" : "Filters"}</h4>
              <div>
                <h6>{language == "ar" ? "نوع الطلب" : "orders Type"}</h6>
                <div className="order_type">
                  <p
                    className={ordertype == "orders" ? "active" : ""}
                    onClick={() => {
                      setordertype("orders");
                    }}
                  >
                    {language == "ar" ? "الطلبات" : "Orders"}
                  </p>
                  <p
                    className={ordertype == "returns" ? "active" : ""}
                    onClick={() => {
                      setordertype("returns");
                    }}
                  >
                    {language == "ar" ? "الراجعه" : "Returns"}
                  </p>
                </div>
              </div>
              <hr />
              <div>
                <h5>{language == "ar" ? "حالة الرجوع" : "Return Status"}</h5>
                {ordertype == "orders" ? (
                  <div className="order_stuatus">
                    <p
                      className={orderstuatus == "completed" ? "active" : ""}
                      onClick={() => {
                        setorderstuatus("completed");
                      }}
                    >
                      {language == "ar" ? "مكتمل" : "completed"}
                    </p>
                    <p
                      className={orderstuatus == "in_progress" ? "active" : ""}
                      onClick={() => {
                        setorderstuatus("in_progress");
                      }}
                    >
                      {language == "ar" ? "تحت المراجعه" : "in_progress"}
                    </p>
                    <p
                      className={orderstuatus == "canceled" ? "active" : ""}
                      onClick={() => {
                        setorderstuatus("canceled");
                      }}
                    >
                      {language == "ar" ? "ملغى" : "Canceled"}
                    </p>
                  </div>
                ) : (
                  <div className="order_stuatus">
                    <p
                      className={
                        returnstatus == "Return Confirmed" ? "active" : ""
                      }
                      onClick={() => {
                        setreturnstatus("Return Confirmed");
                      }}
                    >
                      {language == "ar" ? "مقبول" : "Approved"}
                    </p>
                    <p
                      className={
                        returnstatus == "return requested" ? "active" : ""
                      }
                      onClick={() => {
                        setreturnstatus("return requested");
                      }}
                    >
                      {language == "ar" ? "قيد الانتظار" : "Pending"}
                    </p>
                    <p
                      className={
                        returnstatus == "Return Rejected" ? "active" : ""
                      }
                      onClick={() => {
                        setreturnstatus("Return Rejected");
                      }}
                    >
                      {language == "ar" ? "مرفوض" : "Rejected"}
                    </p>
                  </div>
                )}
              </div>
              <div className="actions">
                <button
                  onClick={() => {
                    setorderstuatus("all");
                    setreturnstatus("all");
                  }}
                >
                  {language == "ar" ? "إعادة ضبط" : "reset"}
                </button>
                <button
                  onClick={() => {
                    setshowfilters(false);
                  }}
                >
                  {language == "ar" ? "تم" : "done"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default OrderLogs2;

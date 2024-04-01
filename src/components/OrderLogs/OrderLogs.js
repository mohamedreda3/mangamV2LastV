import React, { useState } from "react";
import "./orderlogs.css";
import Header from "../header";
import { AiFillStar } from "react-icons/ai";
import PagesHeader from "../../PagesHeader/PagesHeader";
import { FiRotateCcw } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/ar";
const OrderLogs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderdata } = location.state;
  // console.log(orderdata)
  const language = useSelector((state) => state.language.lang);
  // console.log(orderdata)\
  const [rateloading, setrateloading] = useState(false);
  const [starval, setstarval] = useState(0);
  const [textareaval, settextareaval] = useState(0);
  const [text, settext] = useState("");
  const [showretbox, setshowretbox] = useState(false);
  const [showsub, setshowsub] = useState(false);
  const [quantity, setquantity] = useState(orderdata.quantity);
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );
  const handleaddrate = () => {
    setrateloading(true);
    const data_send = {
      text,
      user_id: userData?.userId,
      product_id: orderdata?.products[0]?.id,
      rate: starval,
      userName: userData?.username,
      userImage: userData?.userPicture,
    };
    // console.log(data_send);
    axios
      .post("http://localhost:9999/v2/product/rate", data_send)
      .then((res) => {
        // console.log(res);
        if (res.data.status == 1) {
          setstarval(0);
          settext("");
          toast.success(
            language == "ar" ? "تمت العملية بنجاح" : res.data.message
          );
        } else if (res.data.status == 0) {
          toast.error(
            language == "ar" ? "لم تتم إضافة التقييم" : res.data.message
          );
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setrateloading(false);
      });
  };
  return (
    <div style={{ marginBottom: "80px" }}>
      <div className="orderslogspage">
        <PagesHeader title={language === "ar" ? "سجل الطلب" : "Order Log "} />
        <div className="product_log">
          <div
            className="list"
            onClick={() => {
              setshowsub(true);
            }}
          >
            <BsThreeDotsVertical />
          </div>
          <div className="left">
            <div style={{ height: "100%" }} className="img">
              <img
                style={{ borderRadius: "10px" }}
                src={orderdata?.products[0]?.colors[0]?.images[0]?.link}
                alt=""
              />
            </div>
            <div className="product_details">
              <h4
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "start",
                  margin: "5px",
                  height: "10px",
                }}
              >
                {language == "ar"
                  ? orderdata?.product_label
                  : orderdata?.product_label}
              </h4>
              <div>
                <p>
                  $<del>{orderdata?.old_price}</del>
                </p>
                <p style={{ margin: "0px" }}>${orderdata?.new_price}</p>
              </div>
              {/* <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <p>{language == 'ar' ? "حالة المنتج" : "Grade"}</p>
                <p style={{ margin: '0px' }}>{orderdata?.quantity} pieces</p>
              </div> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>{language == "ar" ? "الكميه" : "Quantity"}</p>
                <p style={{ margin: "0px" }}>
                  {orderdata?.quantity} {language == "ar" ? "قطع" : "pieces"}
                </p>
              </div>
            </div>
          </div>
          <div className="right">
            <p>{language == "ar" ? "الكلى" : "total"}</p>
            <p>${orderdata?.product_total_price}</p>
          </div>
        </div>
        <h4 className="ordertitle">
          {language == "ar" ? "طلب" : "Order"} #{orderdata?.id}
        </h4>
        <hr />
        {/* <p className='orderpara'>Saturday, 23 March 2022  09:22 KSA</p> */}
        <div>
          <p className="orderDate">
            {language == "ar"
              ? moment(orderdata?.createdAt).locale("ar-kw").format("LLLL")
              : moment(orderdata?.createdAt).locale("en").format("LLLL")}
          </p>
        </div>
        <div className="product_log_others">
          <div className="other_details_logs">
            {console.log(orderdata)}
            <div>
              <p>{language == "ar" ? "رقم الطلب" : "Order Number"}</p>
              <h6>{orderdata?.id}</h6>
            </div>

            <div>
              <p>{language == "ar" ? "الحاله" : "Status"}</p>
              <h6
                className={
                  orderdata?.status == "completed"
                    ? "orderstatus completed"
                    : "orderstatus pending"
                }
                style={{ color: "#FE8D2A", textTransform: "capitalize" }}
              >
                <span style={{ whiteSpace: "pre-wrap" }}>
                  {language == "ar"
                    ? orderdata.status == "pending"
                      ? "في انتظار رد الموظف"
                      : orderdata.status == "in_progress"
                      ? "في انتظار رد بوابةالدفع"
                      : orderdata.status == "on_way"
                      ? "في الطريق"
                      : orderdata.status == "completed" ||
                        orderdata.status == "confirmed"
                      ? "تمت الموافقة على الطلب"
                      : orderdata.status == "canceled" ||
                        orderdata.status == "reject"
                      ? "تم رفض الطلب"
                      : orderdata.status == "under_shipping"
                      ? "الطلب تحول لشركة الشحن"
                      : orderdata.status == "out_for_delivery"
                      ? "الطلب في الطريق"
                      : orderdata.status == "delivered"
                      ? "تم توصيل الطلب"
                      : orderdata.status == "Payment Failed"
                      ? "لم تنجح عملية الدفع"
                      : "هناك مشكلة في الطلب"
                    : orderdata.status}
                </span>
              </h6>
            </div>
          </div>

          <div className="other_details_logs">
            <div>
              <p>{language == "ar" ? "وسيلة الدفع" : "Payment Method"}</p>
              <h6>{orderdata.payment_method}</h6>
            </div>
            <div>
              <p>{language == "ar" ? "الكمية" : "Quantity"}</p>
              <h6>
                {orderdata?.quantity} {language == "ar" ? "قطع" : "pieces"}
              </h6>
            </div>
          </div>

          <div className="other_details_logs">
            <div>
              <p>{language == "ar" ? "الكلى" : "total"}</p>
              <h6>
                $
                {orderdata?.grand_price * 1 +
                  (orderdata?.old_price * 1 - orderdata?.new_price)}
              </h6>
            </div>
            <div>
              <p>{language == "ar" ? "التقيم" : "Rating"}</p>
              <h6>
                {[1, 2, 3, 4, 5].map((item, index) => {
                  return (
                    <AiFillStar
                      style={{
                        color:
                          item <=
                          orderdata?.products[0]?.comRates?.comulativeRate * 1
                            ? "rgba(254, 141, 42, 1)"
                            : "rgba(217, 217, 217, 1)",
                      }}
                    />
                  );
                })}
              </h6>
            </div>
          </div>

          <div className="other_details_logs">
            <div>
              <p>{language == "ar" ? "الخصم" : "Discount"}</p>
              <h6>$ {orderdata?.old_price * 1 - orderdata?.new_price}</h6>
            </div>
            <div>
              <p>{language == "ar" ? "وسيلة الشحن" : "Shipping Method"}</p>
              <h6>{orderdata?.shipping?.title}</h6>
            </div>
          </div>
          <div className="other_details_logs">
            <div>
              <p>{language == "ar" ? "السعر النهائى" : "Final Total"}</p>
              <h6>${(orderdata?.grand_price * 1).toFixed(0)}</h6>
            </div>
            <div>
              <p>{language == "ar" ? "العنوان" : "Address"}</p>
              {/* {console.log("orderdata", orderdata)} */}
              <h6>{orderdata?.address}</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="overall_rating">
        <h5>
          {language == "ar"
            ? "تقييمك العام لهذا المنتج"
            : "Your overall rating of this product"}
        </h5>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((item) => {
            return (
              <AiFillStar
                style={{
                  color: item <= starval ? "#FE8D2A" : "#B6B4B0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setstarval(item);
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="share">
        <h4>{language == "ar" ? "مشاركة تقيمك" : "Share Your Review"}</h4>
        <textarea
          value={text}
          maxLength={500}
          onChange={(e) => {
            settextareaval(e.target.value.length);
            settext(e.target.value);
          }}
          placeholder={
            language == "ar" ? "شاركنا بتجربتك" : "Describe your experiance"
          }
        ></textarea>
        <p>{textareaval}/500</p>
        {/* <button
          onClick={() => {
            handleaddrate();
          }}
        >
          {language == 'ar' ? "تقيم" : "Add Rate"}
        </button> */}
      </div>
      <button
        onClick={() => {
          handleaddrate();
        }}
        className="returnbtn"
      >
        {/* <FiRotateCcw /> */}
        <span>{language == "ar" ? "إضافة تقييم" : "Submit"}</span>
      </button>
      {showsub ? (
        <div className="sub_div">
          <div className="sub">
            <div className="bar"></div>
            <button
              onClick={() => {
                setshowretbox(true);
                setshowsub(false);
                // navigate("/returnitem",{state:{data:orderdata}})
              }}
            >
              {language == "ar" ? "ارجاع الطلب" : "Return This Order"}
            </button>
            <button>{language == "ar" ? "فاتوره" : "Invoice"}</button>
            <button
              onClick={() => {
                setshowsub(false);
              }}
            >
              {language == "ar" ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      ) : null}
      {showretbox ? (
        <div className="retunrbox">
          <div className="return_div">
            <div></div>
            <h4>
              {language == "ar"
                ? orderdata?.products[0].title_ar
                : orderdata?.products[0].title}
            </h4>
            <p>
              {language == "ar"
                ? "الرجاء تحديد عدد العناصر التي تريد إرجاعها"
                : "Please select number of items you want to return"}
            </p>
            <div>
              <button
                onClick={() => {
                  if (quantity > 1) {
                    setquantity(quantity - 1);
                  }
                }}
              >
                -
              </button>
              <p>{quantity}</p>
              <button
                onClick={() => {
                  if (quantity < orderdata.quantity) {
                    setquantity(quantity + 1);
                  }
                }}
              >
                +
              </button>
            </div>
            <div className="actions">
              <button
                onClick={() => {
                  setshowretbox(false);
                }}
              >
                {language == "ar" ? "إلغاء" : "cancel"}
              </button>
              <button
                onClick={() => {
                  navigate("/returnitem", {
                    state: { data: orderdata, quantity },
                  });
                }}
              >
                {language == "ar" ? "إتمام" : "submit"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderLogs;

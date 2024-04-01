import React, { useState } from "react";
import "../OrderLogs/orderlogs.css";
import Header from "../header";
import { AiFillStar } from "react-icons/ai";
import PagesHeader from "../../PagesHeader/PagesHeader";
import { FiRotateCcw } from "react-icons/fi";
import { CiMenuKebab } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "./returnlog.css";
const ReturnLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderdata } = location.state;
  // console.log(orderdata);
  const language = useSelector((state) => state.language.lang);
  // console.log(orderdata)
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
          toast.error(res.data.message);
        } else {
          toast.error("Something Went Error");
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
        <PagesHeader
          title={language == "ar" ? "تفاصيل المسترجع" : "Return Log"}
        />
        <div className="product_log">
          {/* <div
            className="list"
            onClick={() => {
              setshowsub(true);
            }}
          >
            <CiMenuKebab />
          </div> */}
          <div className="left">
            <div style={{ height: "100%" }} className="img">
              <img
                style={{ borderRadius: "10px" }}
                src={orderdata?.order?.products[0]?.colors[0]?.images[0]?.link}
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
                  ? orderdata?.order?.product_label
                  : orderdata?.order?.product_label}
              </h4>
              <div>
                <p>
                  $<del>{orderdata?.order?.old_price}</del>
                </p>
                <p style={{ margin: "0px" }}>${orderdata?.order?.new_price}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>{language == "ar" ? "الكميه" : "Quantity"}</p>
                <p style={{ margin: "0px" }}>{orderdata?.quantity} pieces</p>
              </div>
            </div>
          </div>
          <div className="right">
            <p>{language == "ar" ? "الكلى" : "total"}</p>
            <p>${orderdata?.price}</p>
          </div>
        </div>
        <h4 className="ordertitle">
          {language == "ar" ? "المنتج المسترجع" : "Return"} #{orderdata?.id}
        </h4>
        {/* <hr  style={{ display:'block',height:'1px',backgroundColor:'black',margin:'4px 0px 20px' }}/> */}
        {/* <p className='orderpara'>Saturday, 23 March 2022  09:22 KSA</p> */}
        <div className="product_log_others retu">
          <div className="other_details_logs">
            <div>
              {console.log()}
              <p>{language == "ar" ? "رقم الطلب" : "Return Number"}</p>
              {console.log(orderdata)}
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
                {/* {orderdata.status} */}
                {language == "ar"
                  ? orderdata.status == "pending"
                    ? "في انتظار رد الموظف"
                    : orderdata.status == "captain on the way"
                    ? "في الطريق"
                    : orderdata.status == "underchacking"
                    ? "يتم فحص العنصر"
                    : orderdata.status == "out for delivery"
                    ? "تم رفض الطلب"
                    : orderdata.status == "Return Confirmed"
                    ? "تم الاسترجاع بنجاح"
                    : "هناك مشكلة في الطلب"
                  : orderdata.status}
              </h6>
            </div>
          </div>

          <div className="other_details_logs">
            <div>
              {/* {console.log(orderdata)} */}
              <p>{language == "ar" ? "وسيلة الدفع" : "Payment Method"}</p>
              <h6>{orderdata?.order?.payment_method}</h6>
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
                {orderdata?.price * 1 +
                  (orderdata?.order?.old_price - orderdata?.order?.new_price)}
              </h6>
            </div>
            <div>
              <p>{language == "ar" ? "التقيم" : "Rating"}</p>
              <h6>
                <AiFillStar
                  style={{
                    color: "#FE8D2A",
                  }}
                />
                <AiFillStar
                  style={{
                    color: "#FE8D2A",
                  }}
                />
                <AiFillStar
                  style={{
                    color: "#FE8D2A",
                  }}
                />
                <AiFillStar
                  style={{
                    color: "#FE8D2A",
                  }}
                />
                <AiFillStar
                  style={{
                    color: "#FE8D2A",
                  }}
                />
              </h6>
            </div>
          </div>

          <div className="other_details_logs">
            <div>
              <p>{language == "ar" ? "الخصم" : "Discount"}</p>
              <h6>
                $ {orderdata?.order?.old_price - orderdata?.order?.new_price}
              </h6>
            </div>
            <div>
              <p>{language == "ar" ? "وسيلة الشحن" : "Shipping Method"}</p>
              <h6>{orderdata?.order?.shipping[0]?.shipping_title}</h6>
            </div>
          </div>
          <div className="other_details_logs">
            <div>
              <p>{language == "ar" ? "السعر النهائى" : "Final Total"}</p>
              <h6>${orderdata?.price * 1}</h6>
            </div>
            {/* {console.log(orderdata)} */}
            <div>
              <p>{language == "ar" ? "العنوان" : "Address"}</p>
              <h6>{orderdata?.order?.address}</h6>
            </div>
          </div>
        </div>

        <div className="return_bottom">
          {/* <hr /> */}
          <h5>{language == "ar" ? "سبب الإرجاع" : "Return Reason:"}</h5>
          <p className="img_ret">
            {orderdata.imageLink ? (
              <img src={orderdata.imageLink} alt="" />
            ) : null}{" "}
            <span>
              {language == "ar" ? orderdata.reason_ar : orderdata.reason}
            </span>
            <hr
              style={{
                display: "block",
                height: "1px",
                backgroundColor: "black",
                margin: "20px auto",
                width: "50%",
              }}
            />
          </p>
          <div className="return_status">
            <h5>{language == "ar" ? "سبب الإرجاع" : "Return Status"}:</h5>
            <p
              className={
                orderdata.status == "pending"
                  ? "pending"
                  : orderdata.status == "rejected"
                  ? "rejected"
                  : "approved"
              }
            >
              {orderdata.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnLog;

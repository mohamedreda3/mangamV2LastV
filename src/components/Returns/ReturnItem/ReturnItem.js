import React from 'react';
import './returnitem.css';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
const ReturnItem = ({ item }) => {
  const language = useSelector((state) => state.language.lang);
  const { id, name, from, price, img, pieces, status, resone } = item;
  const navigate = useNavigate();
  return (
    <div
      className="returnitem product"
      onClick={() => {
        navigate("/returnlog", {
          state: {
            orderdata: item
          }
        });
      }}
    >
      <div className="top">
        <div className="img">
          {item?.order?.products[0]?.colors &&
          item?.order?.products[0]?.colors?.length ? (
            <img
              style={{ borderRadius: '10px' }}
              src={item?.order?.products[0]?.colors[0]?.images[0]?.link}
              alt=""
            />
          ) : null}
        </div>

        <div className="des">
          <h5>
            {item?.order?.products && item?.order?.products.length
              ? language == 'ar'
                ? item?.order?.products[0]?.title_ar
                : item?.order?.products[0]?.title
              : null}
          </h5>
          <h5 style={{ color: '#312783' }} className="price">
            ${item?.price}
          </h5>
          <h4>
            <span>
              {language == 'ar' ? (
                <>
                  العنصر من{" "}
                  <span>{item?.order?.products[0]?.category_name_ar}</span>
                </>
              ) : (
                <>
                  item from{" "}
                  <span>{item?.order?.products[0]?.category_name}</span>
                </>
              )}
            </span>
          </h4>

          <h5>
            {language == 'ar' ? "رقم الرجوع" : "Return No"}{" "}
            <span style={{ color: '#666' }}>{item.id}</span>
          </h5>
          <h2>
            <span>{language == 'ar' ? "الحالة" : "Status"} </span>
            <span>
              {" "}
              {language == "ar"
                ? item?.status == "pending"
                  ? "في انتظار رد الموظف"
                  : item?.status == "captain on the way"
                  ? "في الطريق"
                  : item?.status == "underchacking"
                  ? "يتم فحص العنصر"
                  : item?.status == "out for delivery"
                  ? "تم رفض الطلب"
                  : item?.status == "Return Confirmed"
                  ? "تم الاسترجاع بنجاح"
                  : "هناك مشكلة في الطلب"
                : item?.status}
            </span>
          </h2>
          <p
            style={{
              background: "#312783 !important",
              color: "white !important"
            }}
          >
            {item.quantity} {language == 'ar' ? "قطعه" : "pieces"}
          </p>
        </div>
      </div>
      <hr style={{ margin: '0px 0px' }} />
      <div className="bottom">
        <h4>{language == 'ar' ? "سبب الرجوع" : "return reason"}</h4>
        <p>{language == "ar" ? item.reason_ar : item.reason}</p>
        <p className={item.status}>
          {language == "ar"
            ? item?.status == "pending"
              ? "في انتظار رد الموظف"
              : item?.status == "captain on the way"
              ? "في الطريق"
              : item?.status == "underchacking"
              ? "يتم فحص العنصر"
              : item?.status == "out for delivery"
              ? "تم رفض الطلب"
              : item?.status == "Return Confirmed"
              ? "تم الاسترجاع بنجاح"
              : "هناك مشكلة في الطلب"
            : item?.status}
        </p>
      </div>
    </div>
  );
};

export default ReturnItem;

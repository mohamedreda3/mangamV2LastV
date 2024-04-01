import axios from "axios";
import base64 from "base-64";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { getOrderDetails } from "../../store/orderReducer";
import BrudCrumbs from "../brudCrumbs/brudCrumbs";
import "./checkout.css";

function Checkout() {
  const location = useLocation();

  const {
    offerdata,
    selecedcolor,
    total_price,
    grand_price,
    grand_price_without_discount,
    grand_price_with_discount,
    props_price,
    props_value_ids,
    props_label,
    props_ids,
    product,
    productwithcolor,
    shipping,
    product_number,
    properties,
    grade,
  } = location.state
    ? location.state
    : JSON.parse(localStorage.getItem("manjamOrder"));
  // console.log(location);
  // console.log(offerdata)
  // console.log(properties)
  let [quen, setQuen] = useState(
    localStorage.getItem("manjamOrder")
      ? JSON.parse(localStorage.getItem("manjamOrder"))
      : null
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.lang);
  const state = useSelector((state) => state.order.data);
  const [choiceId, setChoiceId] = useState(1);
  const [productnum, setproductnum] = useState(1);
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );
  const [shippingTime, setShippingTime] = useState(false);
  const [shippingFees, setShippingFees] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(false);
  const [orderdata, setorderdata] = useState({
    offer_id: offerdata?.id,
    color_id: selecedcolor?.id,
    prop_id: properties[0]?.prop_id,
    prop_value_id: properties[0]?.id,
    quantity: product_number,
    user_id: userData?.userId,
    userLevel: userData?.userLevel,
    payment_method: "visa",
    shipping_id: 1,
    shipping_time: shippingTime ? shippingTime : 0,
    shipping_price: shippingPrice ? shippingPrice : 0,
    store: parseInt(userData?.storeId) == 2 ? "ksa" : "uae",
    // store: "uae",
    userName: userData?.username,
    userImage: userData?.userPicture,
    userHash: userData?.userHash,
    grade,
  });

  const [address, setAddress] = useState("");

  useEffect(() => {
    //
    // console.log(orderdata);
    if (quen) {
      quen.product_number = orderdata?.quantity;
    }
    localStorage.setItem("manjamOrder", JSON.stringify(quen));
  }, [orderdata]);
  const getAddress = (address) => {
    setAddress(JSON.parse(address));
    // console.log(address);
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const data = urlParams.get("data");
    const type = urlParams.get("type");
    const token = base64.decode(data);
    if (type == "addresses_callback") {
      getAddress(token);
    }
  }, []);
  useEffect(() => {
    if (address) {
      const options = {
        method: "GET",
        url: "https://api-mock.dhl.com/mydhlapi/rates",
        params: {
          accountNumber: "113959",
          originCountryCode: "UAE",
          originCityName: "Dubai",
          destinationCountryCode: address?.address?.country,
          destinationCityName: address?.address?.city,
          weight: 5,
          length: 10,
          width: 5,
          height: 15,
          plannedShippingDate: "2023-09-24",
          isCustomsDeclarable: false,
          unitOfMeasurement: "metric",
        },
        // ${address?.address?.country} - ${address?.address?.city} - ${address?.address?.area} - ${address?.address?.street}
        headers: {
          "Message-Reference": "123456",
          "Message-Reference-Date": "2023-09-24",
          "Plugin-Name": "MyShippingApp",
          "Plugin-Version": "1.0",
          "Shipping-System-Platform-Name": "Node.js",
          "Shipping-System-Platform-Version": "14.17.6",
          "Webstore-Platform-Name": "EcommercePlatform",
          "Webstore-Platform-Version": "2.0",
          Authorization: "Basic R2jVtHF3WP25dlBreSA3C83DcmYzlDAG",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [address]);

  const [useLoading, setUseLoading] = useState(false);
  const handlecheckout = async () => {
    if (!address || !address?.address) {
      return toast.error(
        language == "ar"
          ? "يجب عليك اختيار عنوان أولا"
          : "You Must Choose An Address"
      );
    }
    setorderdata({
      ...orderdata,
      address: `${address?.address?.country} - ${address?.address?.city} - ${address?.address?.area} - ${address?.address?.street}`,
    });
    const data_send = {
      ...orderdata,
      status: "Payment Failed",
      address: `${address?.address?.country} - ${address?.address?.city} - ${address?.address?.area} - ${address?.address?.street}`,
      // address: orderdata?.address
    };
    // console.log(data_send);
    setUseLoading(true);
    await axios
      .post("http://localhost:9999/v2/offers/buy", data_send)
      .then(async (res) => {
        // console.log(res.data)
        if (res.data.status) {
          if (res?.data?.orderId) {
            const orderData = await axios.get(
              `http://localhost:9999/v2/order/order_details?user_id=${userData?.userId}&order_id=${res?.data?.orderId}`,
              { timeout: 8989898989 }
            );
            const order_data = orderData?.data?.message[0];
            const dataSendOrder = {
              total_with_vat: order_data?.grand_price,
              vat:
                order_data?.grand_price - order_data?.grand_price_without_tax,
              total: order_data?.grand_price_without_tax,
              app_id: "16",
              order_id: order_data?.id,
              meta_data: "",
              callback_base_url:
                "http://localhost:3000/payment_callback?token=flaskdsakdpoaskdoaspdkop&app_order_ref=1232",
              iso_currency: userData?.currency,
              products: [
                {
                  id: order_data?.product_id,
                  title: order_data?.product_label,
                  total_with_vat:
                    order_data?.product_total_price +
                    (shippingPrice ? shippingPrice : 0) +
                    (parseInt(userData?.storeId) == 2
                      ? order_data?.product_total_price * (15 / 100)
                      : order_data?.product_total_price * (5 / 100)),
                  vat:
                    parseInt(userData?.storeId) == 2
                      ? order_data?.product_total_price * (15 / 100)
                      : order_data?.product_total_price * (5 / 100),
                  total:
                    order_data?.product_total_price +
                    (shippingPrice ? shippingPrice : 0),
                  price: order_data?.new_price,
                  meta_data: "",
                  quantity: product_number,
                },
              ],
            };

            const encoder = new TextEncoder();
            const data = encoder.encode(JSON?.stringify(dataSendOrder));
            const base64EncodedString = btoa(
              String.fromCharCode.apply(null, data)
            );
            const linkSendData = base64EncodedString;
            window.location.href =
              "https://like4card.page.link/payment?data=" + linkSendData;
          }
          // toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(language == "ar" ? res.data.message : res.data.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
    setUseLoading(false);
  };

  useEffect(() => {
    dispatch(getOrderDetails());
  }, []);

  if (!location.state && !quen) {
    navigate("/");
  }
  return (
    <div style={{ marginBottom: "80px" }} className="checkout">
      <BrudCrumbs
        title={language == "ar" ? "الدفع" : "Checkout"}
        type="title"
      />
      <div className="product_log product_log_checkout">
        <div className="left">
          <div className="img">
            <img
              style={{ maxWidth: "100%" }}
              src={product?.images[0].link}
              alt=""
            />
          </div>
          <div className="product_details">
            <h4
              style={{
                width: "100%",
                display: "flex",
                height: "10px",
                justifyContent: "start",
              }}
            >
              {language == "ar" ? product.title_ar : product.title}
            </h4>
            <div className="price">
              <p>
                $<del>{properties[0].old_price}</del>
              </p>
              <p>{properties[0].new_price}$</p>
            </div>

            <div className="prod_states">
              <div className="item_fro_check">
                <p>{language == "ar" ? "حالة المنتج" : "Grade"}</p>
                <p>{orderdata.grade}</p>
              </div>
              <div className="item_fro_check">
                <p>{language == "ar" ? "المنتج من" : "item from"}</p>
                <p>{product.producing_company}</p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="right prod_count">
          <div>
            {console.log("order", orderdata)}
            <button
              onClick={() => {
                if (orderdata.quantity > 1) {
                  setorderdata({
                    ...orderdata,
                    quantity: orderdata.quantity - 1
                  });
                }
              }}
            >
              -
            </button>
            <p>{orderdata.quantity}</p>
            <button
              onClick={() => {
                if (orderdata.quantity < 3)
                  setorderdata({
                    ...orderdata,
                    quantity: orderdata.quantity + 1
                  });
              }}
            >
              +
            </button>
          </div>
        </div> */}
      </div>
      <p>{language == "ar" ? product.description_ar : product.description}</p>
      <div className="product_features">
        <div
          style={{
            width: "40%",
          }}
        >
          <div className="right">
            <h5>
              <span></span>
              <span>{language == "ar" ? "شركة الشحن" : "Shipping"}</span>
            </h5>
            <p>
              {
                JSON.parse(localStorage.getItem("manjamOrder"))?.shipping
                  ?.shippingTitle
              }
            </p>
          </div>
        </div>
        <div
          style={{
            width: "40%",
          }}
        >
          <div className="right">
            <h5>
              <span></span>
              <span>
                {language == "ar" ? "خواص المنتج" : "Product Features"}
              </span>
            </h5>
            <p>
              {language == "ar"
                ? JSON.parse(localStorage.getItem("manjamOrder"))?.properties[0]
                    ?.label_ar
                : JSON.parse(localStorage.getItem("manjamOrder"))?.properties[0]
                    ?.label}
            </p>
          </div>
        </div>
      </div>
      <div className="product_features">
        <div
          style={{
            width: "40%",
          }}
        >
          <div className="right">
            <h5>
              <span></span>
              <span>{language == "ar" ? "الكمية" : "Quantity"}</span>
            </h5>
            <p>
              {JSON.parse(localStorage.getItem("manjamOrder"))?.product_number}{" "}
              {language == "ar" ? "قطع" : "pieces"}
            </p>
          </div>
        </div>

        <div
          style={{
            width: "40%",
          }}
        >
          <div className="right">
            <h5>
              <span></span>
              <span>
                {language == "ar" ? "تاريخ انتهاء العرض" : "End Date"}
              </span>
            </h5>
            <p>
              {
                JSON.parse(localStorage.getItem("manjamOrder"))?.offerdata
                  ?.will_av_for
              }
            </p>
          </div>
        </div>
      </div>

      <div className="product_features">
        <div
          style={{
            width: "40%",
          }}
        >
          <div className="right">
            <h5>
              <span></span>
              <span>{language == "ar" ? "اللون" : "Color"}</span>
            </h5>
            <p>
              {language == "ar"
                ? JSON.parse(localStorage.getItem("manjamOrder"))?.selecedcolor
                    ?.color_ar
                : JSON.parse(localStorage.getItem("manjamOrder"))?.selecedcolor
                    ?.color}
            </p>
          </div>
        </div>
        <div
          style={{
            width: "40%",
          }}
        >
          <div className="right">
            <h5>
              <span></span>
              <span>{language == "ar" ? "حالة المنتج" : "Grade"}</span>
            </h5>
            <p>{orderdata?.grade}</p>
          </div>
        </div>
      </div>
      {/* {
        offerdata.
      } */}
      <div className="select_address">
        <h4>
          <span>{language == "ar" ? "إختيار عنوان" : "Select  address"}</span>
          <span>*</span>
        </h4>
      </div>
      <div className="input_search">
        <input
          disabled
          value={
            address?.address
              ? `${address?.address?.country} - ${address?.address?.city} - ${address?.address?.area} - ${address?.address?.street}`
              : ""
          }
          onChange={(e) => {
            setorderdata({ ...orderdata, address: e.target.value });
          }}
          type="text"
        />
        <button
          onClick={() => {
            const sentToken = base64.encode(
              JSON.stringify({
                is_select: true,
                app_id: "16",
                meta_data: "",
                callback_base_url:
                  "http://localhost:3000/checkout?type=addresses_callback",
              })
            );
            window.location.href =
              "https://like4card.page.link/payment?data=" + sentToken;
          }}
        >
          {" "}
          {language == "ar" ? "إختيار" : "Select"}
        </button>
      </div>
      <div className="checkout_prices">
        <div>
          <h4>{language == "ar" ? "الكلى" : "Total"}</h4>
          <p>{properties[0].old_price * 1 * (orderdata?.quantity * 1)}$</p>
        </div>
        <div>
          <h4>{language == "ar" ? "الخصم" : "Discount"}</h4>
          <p>
            {properties[0].old_price * 1 * (orderdata?.quantity * 1) -
              properties[0].new_price * 1 * (orderdata?.quantity * 1)}
            $
          </p>
        </div>
        <div>
          <h4>
            {language == "ar"
              ? "السعر الكلي غير شامل الضريبة"
              : "Final  With out VAT"}
          </h4>
          <p>
            {properties[0].new_price * 1 * (orderdata?.quantity * 1) +
              (shippingPrice ? shippingPrice : 0)}
            $
          </p>
        </div>
        <div>
          <h4>
            {language == "ar" ? "السعر الكلي شامل الضريبة" : "Final  With VAT"}
          </h4>
          <p>
            {properties[0].new_price * 1 * (orderdata?.quantity * 1) +
              (shippingPrice ? shippingPrice : 0) +
              properties[0].new_price *
                1 *
                (orderdata?.quantity * 1) *
                (parseInt(userData?.storeId) == 2 ? 15 / 100 : 5 / 100)}
            $
          </p>
        </div>
      </div>
      <div className="checkout_actions">
        {/* <button
          onClick={() => {
            return !useLoading ? handlecheckout() : null;
          }}
        >
          {!useLoading ? (
            <>{language == "ar" ? "دفع" : "Checkout"}</>
          ) : (
            <Loader />
          )}{" "}
        </button> */}
        {useLoading ? (
          <Loader />
        ) : (
          <button
            onClick={() => {
              return !useLoading ? handlecheckout() : null;
            }}
          >
            {language === "ar" ? "دفع بواسطة" : "Pay with"}{" "}
            <img width={50} src={require("../../assets/Pay(1).png")} alt="" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Checkout;

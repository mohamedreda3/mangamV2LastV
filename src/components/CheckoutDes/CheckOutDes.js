import React, { useEffect, useState } from "react";
import "../checkout/checkout.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../../store/orderReducer";
import BrudCrumbs from "../brudCrumbs/brudCrumbs";
// import { paymentMethods } from "./payementmethods";
import { useLocation, useNavigate } from "react-router";
import { CiMenuKebab } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";

function CheckoutOutDes() {
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
  } = location.state;
  // console.log(location)

  let [oldquan, setoldquan] = useState(product_number);
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.lang);
  const state = useSelector((state) => state.order.data);
  const [choiceId, setChoiceId] = useState(1);
  const [productnum, setproductnum] = useState(1);
  const [orderdata, setorderdata] = useState({
    offer_id: offerdata.id,
    user_id: userData?.userId,
    quantity: product_number,
    payment_method: "visa",
    shipping_id: shipping.id,
    shipping_time: 4,
    shipping_price: 200,
    address: "",
    userName: userData?.username,
    userImage: userData?.userPicture,
    userHash: userData?.userHash,
  });

  const handlecheckout = () => {
    const data_send = {
      ...orderdata,
    };
    // console.log(data_send);
    axios
      .post("http://localhost:9999/v2/offers/buy", data_send)
      .then((res) => {
        // console.log(res.data)
        if (res.data.status == 1) {
          toast.success(
            language == "ar" ? "تمت العملية بنجاح" : res.data.message
          );
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    dispatch(getOrderDetails());
  }, []);
  useEffect(() => {
    // eqdata()
    // getactiveprops()
  }, []);
  // useEffect(()=>{
  //   let grand_price=orderdata.grand_price/oldquan;
  //   grand_price*=orderdata.quantity;
  //   setorderdata({...orderdata,grand_price});
  // },[orderdata.quantity])
  return (
    <div style={{ marginBottom: "80px" }} className="checkout">
      <BrudCrumbs title="Checkout" type="title" />
      <div className="product_log product_log_checkout">
        {/* <div className="list">
          <CiMenuKebab/>
        </div> */}
        <div className="left">
          <div className="img">
            <img
              style={{ maxWidth: "100%" }}
              src={product?.images[0].link}
              alt=""
            />
          </div>
          <div className="product_details">
            <h4>{language == "ar" ? product.title_ar : product.title}</h4>
            <div>
              <h5>{language == "ar" ? "الدرجه" : "Grade"}</h5>
              <h4>{product.grade}</h4>
            </div>
            <div>
              <p>
                $<del>{product.price}</del>
              </p>
              <p>{offerdata.new_price}$</p>
            </div>

            <div className="item_fro_check">
              <p>{language == "ar" ? "المنتج من" : "item from"}</p>
              <p>{product.producing_company}</p>
            </div>
          </div>
        </div>
        <div className="right prod_count">
          <div>
            <button
              onClick={() => {
                if (orderdata.quantity > 1) {
                  setorderdata({
                    ...orderdata,
                    quantity: orderdata.quantity - 1,
                  });
                }
              }}
            >
              -
            </button>
            <p>{orderdata.quantity}</p>
            <button
              onClick={() => {
                setorderdata({
                  ...orderdata,
                  quantity: orderdata.quantity + 1,
                });
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <p>{language == "ar" ? product.description_ar : product.description}</p>
      <div className="product_features">
        {properties.map((item, index) => {
          if (item.checked) {
            return (
              <div
                key={index}
                style={{
                  width: "40%",
                }}
              >
                <div className="right">
                  <h5>
                    <span></span>
                    <span>{item.label_parent}</span>
                  </h5>
                  <p>{item.label}</p>
                </div>
              </div>
            );
          } else return null;
        })}
      </div>
      <div className="select_address">
        <h4>
          <span>{language == "ar" ? "إختيار عنوان" : "Select  address"}</span>
          <span>*</span>
        </h4>
      </div>
      <div className="input_search">
        <input
          className={language == "ar" ? "rtl" : ""}
          onChange={(e) => {
            setorderdata({ ...orderdata, address: e.target.value });
          }}
          type="text"
        />
        <button className={language == "ar" ? "rtl" : ""}>
          {language == "ar" ? "إختيار" : "Select"}
        </button>
      </div>
      <div className="checkout_prices">
        <div>
          <h4>{language == "ar" ? "الكلى" : "Total"}</h4>
          <p>{product.price}$</p>
        </div>
        <div>
          <h4>{language == "ar" ? "الخصم" : "Discount"}</h4>
          <p>{product.discount}$</p>
        </div>
        <div>
          <h4>{language == "ar" ? "السعر النهائى" : "Final Total"}</h4>
          <p>
            {product.discount > 0
              ? product.price * 1 -
                product.price * 1 * ((product.discount * 1) / 100)
              : product.price}
            $
          </p>
        </div>
      </div>
      <div className="checkout_actions">
        <button
          onClick={() => {
            handlecheckout();
          }}
        >
          {language == "ar" ? "دفع" : "Checkout"}
        </button>
        <button
          onClick={() => {
            handlecheckout();
          }}
        >
          {language == "ar" ? "دفع بواسطة" : "Pay with"}{" "}
          <img src={require("../../assets/Pay(1).png")} alt="" />
        </button>
      </div>
    </div>
  );
}

export default CheckoutOutDes;

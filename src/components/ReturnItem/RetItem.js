import React, { useEffect, useState } from "react";
import "./returnitem.css";
import PagesHeader from "../../PagesHeader/PagesHeader";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { useSelector } from "react-redux";

const RetItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, quantity } = location.state;
  const [showbox, setshowbox] = useState(false);
  const [choose, setchoose] = useState("parlor");
  const [prodnum, setprodnum] = useState(1);
  const [image, setimage] = useState(null);
  const [Reasons, setReasons] = useState([]);
  const [reason_id, setreason_id] = useState("");
  const [imageLink, setimageLink] = useState("");
  const [returnloading, setreturnloading] = useState(false);
  const [uploadloading, setuploadloading] = useState(false);

  const getReasons = () => {
    axios
      .get("http://localhost:9999/v2/reason/getAll")
      .then((res) => {
        setReasons(res.data.message);
      })
      .catch((err) => console.log(err));
  };

  const handleuploadimage = () => {
    if (image == null) {
      toast.warn(language == "ar" ? "أختر صوره" : "Choose Image");
      return;
    }
    setuploadloading(true);
    const formData = new FormData();
    formData.append("image", image);
    axios
      .post(
        "https://roma-cosmetic.com/api/v1/admin/home/img_uploader.php",
        formData
      )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(
            language == "ar" ? "تم الرفع بنجاح" : "Uploaded Succesfully"
          );
          setimageLink(res.data.message);
          // setimages([...images, res.data.message]);
          setimage(null);
        }
      })
      .finally(() => {
        setuploadloading(false);
      })
      .catch((err) => console.log(err));
  };
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );
  const handlereturnitem = () => {
    // console.log(data);
    const data_send = {
      order_id: data?.id,
      quantity: quantity,
      price: data?.newPrice * quantity,
      imageLink,
      reason: choose,
      prop_id: data?.props_ids,
      prop_value_id: data?.props_value_ids,
      user_id: userData?.userId,
      return_reason_id: reason_id,
    };
    console.log(data_send);
    axios
      .post("http://localhost:9999/v2/return/orderReturn", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(
            language == "ar" ? "تمت العملية بنجاح" : res.data.message
          );
          // navigate("/orderlogs",{replace:true})
        } else if (res.data.status == 0) {
          toast.error(
            language == "ar"
              ? res.data.message.toLowerCase() == "order has returned"
                ? "فشلت العملية لقد تم استرجاع المنتج بالفعل "
                : res.data.message
              : res.data.message
          );
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getReasons();
  }, []);
  const language = useSelector((state) => state.language.lang);
  return (
    <div className="retitem">
      <PagesHeader title={language == "ar" ? "إرجاع العنصر" : "Return Item"} />
      {/* <div className="returnproduct">
        <div className="left">
          <div>
            <h4 style={{ height: '10px', margin: '0px 0px 15px' }}>
              {language == 'ar'
                ? data?.product
                : data?.products[0]?.title}
            </h4>
            <p>
              <span>{data?.old_price}$</span>
              <span>{data?.new_price}$</span>
            </p>
            <p>
              <span>{language == 'ar' ? "الكمية" : "quantity"}</span>
              <span>
                {data?.quantity} {language == 'ar' ? "قطع" : "pieces"}
              </span>
            </p>
          </div>
        </div>
        <div className="right">
          <p>{language == 'ar' ? "الكلى" : "Total"}</p>
          <p>${data?.grand_price}</p>
        </div>
      </div> */}

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
            {data?.products[0]?.colors && data?.products[0]?.colors?.length ? (
              <img
                style={{ height: "100%", display: "block" }}
                src={data?.products[0]?.colors[0]?.images[0]?.link}
                alt=""
              />
            ) : null}
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
              {language == "ar" ? data?.product_label : data?.product_label}
            </h4>
            <div>
              <p>
                $<del>{data?.old_price}</del>
              </p>
              <p style={{ margin: "0px" }}>${data?.new_price}</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <p>{language == "ar" ? "الكميه" : "Quantity"}</p>
              <p style={{ margin: "0px" }}>{quantity} pieces</p>
            </div>
          </div>
        </div>
        <div className="right">
          <p>{language == "ar" ? "الكلى" : "total"}</p>
          <p>${data?.new_price * quantity}</p>
        </div>
      </div>

      <div className="item_radios">
        <p>
          {language == "ar"
            ? "لماذا تريد إرجاع هذا العنصر؟"
            : "Why do you want to return this item ?"}
        </p>
        {/* {console.log(Reasons , Reasons.length)} */}
        {Reasons != "no reasons" && Reasons && Reasons.length
          ? Reasons?.map((item, index) => {
              return (
                <div>
                  <label
                    onClick={() => {
                      setchoose(item.text);
                      setreason_id(item.id);
                    }}
                    htmlFor={index}
                  >
                    {language == "ar" ? item.text_ar : item.text}
                  </label>
                  <input
                    onClick={() => {
                      setchoose(item.text);
                      setreason_id(item.id);
                    }}
                    checked={choose == item.text}
                    type="radio"
                    name={index}
                    id={index}
                  />
                </div>
              );
            })
          : null}
      </div>
      <div className="upload_img">
        <p>
          {language == "ar" ? "رفع صوره" : "Upload images "}
          <span>({language == "ar" ? "إختيارى" : "Optional"})</span>
        </p>
        <p>
          {language == "ar"
            ? "لماذا تريد إرجاع هذا العنصر؟"
            : "Please upload photos of your return’s packaging to show us the condition."}
        </p>
        <label htmlFor="upimg">
          <img src={require("../../assets/camimg.png")} alt="" />
        </label>
        <input
          onChange={(e) => {
            setimage(e.target.files[0]);
          }}
          type="file"
          name=""
          id="upimg"
        />
      </div>
      <button
        onClick={() => {
          handleuploadimage();
        }}
        className="uploadimage"
      >
        {uploadloading ? (
          <Loader />
        ) : language == "ar" ? (
          "رفع صورة"
        ) : (
          "Upload image"
        )}
      </button>
      {returnloading ? (
        <Loader />
      ) : (
        <button
          onClick={() => {
            handlereturnitem();
          }}
          className="createret"
        >
          {language == "ar" ? "أنشئ طلب الإرجاع" : "CREATE THE RETURN REQUEST"}
        </button>
      )}
      <div
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#312783",
          fontSize: "12px",
          fontWeight: "400",
        }}
      >
        <a href="">
          {language == "ar"
            ? "تحقق من سياسة خصوصية الإرجاع"
            : "Check Return Privacy Policy"}
        </a>
      </div>
      {showbox ? (
        <div className="showbox_parent">
          <div className="showbox_div">
            <h4>{language == "ar" ? "إختيار عنصر" : "Select Item"}</h4>
            <p>
              {language == "ar"
                ? "الرجاء تحديد عدد العناصر التي تريد إرجاعها"
                : "Please select number of items you want to return"}
            </p>
            <div>
              <button
                onClick={() => {
                  if (prodnum > 1) {
                    setprodnum(prodnum - 1);
                  }
                }}
              >
                -
              </button>
              <p>{prodnum}</p>
              <button
                onClick={() => {
                  setprodnum(prodnum + 1);
                }}
              >
                +
              </button>
            </div>
            <div className="actions">
              <button
                onClick={() => {
                  setshowbox(false);
                }}
              >
                {language == "ar" ? "إلغاء" : "cancel"}
              </button>
              <button
                onClick={() => {
                  setshowbox(false);
                }}
              >
                {language == "ar" ? "تأكيد" : "confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RetItem;

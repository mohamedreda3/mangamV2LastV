import React, { useEffect, useState } from "react";
import "../../ProductDetails/productdetails.css";
// import ProductSlider from './ProductSlider/ProductSlider'
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
import {
  AiFillStar,
  AiOutlineArrowDown,
  AiOutlineClose,
  AiOutlineStar,
} from "react-icons/ai";
import { FaArrowDown } from "react-icons/fa6";
// import Header from '../header';
import { BsChevronBarDown, BsChevronDown } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router";
import PagesHeader from "../../../PagesHeader/PagesHeader";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Keyboard, Mousewheel, Pagination, Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const ProductDetailsDes = () => {
  const [showallreviews, setshowallreviews] = useState(false);
  const [activeairpod, setactiveairpod] = useState(1);
  const [shippingdata, setshippingdata] = useState({});
  const [productsize, setproductsize] = useState([]);

  const [AllNumbers, setAllNumbers] = useState([]);

  const [data2, setdata2] = useState({
    labels: ["allorders", "alldatacharts", "pendingOrders", "canceledOrders"],
    datasets: [
      {
        label: "# of Votes",
        data: AllNumbers,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const [selectedProperities, setselectedProperities] = useState([]);

  const [shipselect, setshipselect] = useState();

  const navigate = useNavigate();
  const [selecedcolor, setselectedcolor] = useState("");
  const [shippingCompany, setshippingCompany] = useState([]);
  const [properties, setproperities] = useState([]);
  const [rates, setrates] = useState([
    {
      id: 1,
      star: 5,
      rate: 84,
    },
    {
      id: 2,
      star: 4,
      rate: 9,
    },
    {
      id: 3,
      star: 3,
      rate: 4,
    },
    {
      id: 4,
      star: 2,
      rate: 2,
    },
    {
      id: 5,
      star: 1,
      rate: 1,
    },
  ]);
  const language = useSelector((state) => state.language.lang);
  const location = useLocation();
  const { productdata } = location.state;
  // console.log(productdata)
  const [product, setgetProduct] = useState(false);
  const [targetColor, setTargetColor] = useState(false);
  const [activeproduct, setactiveproduct] = useState("");
  const [selectedproduct, setselectedproduct] = useState({});
  const getproduct = () => {
    setselectedcolor(productdata.products[0]?.colors[0]?.id);
    setproperities(productdata.products[0]?.colors[0]?.props);
    setgetProduct(productdata.products[0]);
    let allcolors = [...productdata.products[0]?.colors[0]?.props];
    setuserReviews(productdata.products[0].customerReviews);
    for (let i = 0; i < allcolors.length; i++) {
      let values = [...allcolors[i]?.values];
      for (let j = 0; j < values.length; j++) {
        values[j]["checked"] = false;
      }
      allcolors[i].values = values;
    }
    setselectedproduct(productdata.products[0]?.colors[0]);
    setTargetColor(productdata.products[0]);

    // axios.get(`http://localhost:9999/v2/product/getProduct?id=${location?.state?.id}`)
    // .then((res)=>{
    //   console.log(res.data.message[0])
    //   if(Array.isArray(res.data.message)){
    //     setselectedcolor(res?.data?.message[0]?.colors[0]?.id)
    //     setproperities(res.data.message[0]?.colors[0]?.props);
    //     setgetProduct(res.data.message[0]);
    //     let allcolors=[...res.data.message[0]?.colors[0]?.props];
    //     setuserReviews(res.data.message[0].customerReviews)
    //     for(let i=0;i<allcolors.length;i++){
    //       let values=[...allcolors[i]?.values]
    //       for(let j=0;j<values.length;j++){
    //         values[j]['checked']=false;
    //       }
    //       allcolors[i].values=values;
    //     }
    //     setselectedproduct(res.data.message[0]?.colors[0])
    //     setTargetColor(res.data.message[0]);
    //   }
    // })
  };
  const [product_number, setproductnumber] = useState(1);

  useEffect(() => {
    getproduct();
  }, []);

  const [userReviews, setuserReviews] = useState([]);

  const getshippingcompany = () => {
    axios
      .post("http://localhost:9999/v2/shipping/getAll", {
        timeout: 8989898989,
      })
      .then((res) => {
        if (Array.isArray(res.data.message)) {
          setshippingCompany(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handlechangevalchecked = (parentid, childid) => {
    // console.log(childid)
    // console.log(parentid)
    let alldata = [...properties];

    let useddata = alldata.filter((item) => item.id == parentid);

    let notused = alldata.filter((item) => item.id != parentid);

    let valuesdata = useddata[0].values;

    let valuesarr = valuesdata.map((item, index) => {
      if (item.id == childid) {
        // console.log("dsds")
        return { ...item, checked: !item.checked };
      } else return { ...item, checked: false };
    });

    // console.log(valuesarr)
    let pusheddata = [];
    useddata[0].values = valuesarr;
    for (let i = 0; i < alldata.length; i++) {
      let values = [...alldata[i]?.values];
      // console.log(values)
      for (let y = 0; y < values.length; y++) {
        if (values[y].id == childid && alldata[i].id == parentid) {
          // console.log("ewwe");
          alldata[i].values = valuesarr;
        }
      }
      pusheddata.push(alldata[i]);
    }
    // console.log(pusheddata)
    setproperities(pusheddata);

    // let valuesdata=alldata.filter(item=>item.id!=parentid);

    // console.log(valuesdata)
    // let valuesarr=valuesdata[0].values;

    for (let i = 0; i < alldata.length; i++) {
      let values = [...alldata[i]?.values];
      for (let k = 0; k < values.length; k++) {
        if (alldata[i].id == parentid && values[k].id == childid) {
          values[k].checked = true;
        }
        alldata[i].values = values;
      }
    }
    setproperities(alldata);
  };

  const GetProductStatistics = () => {
    const data_send = {};
  };

  useEffect(() => {
    getshippingcompany();
    // getDetails();
  }, []);

  if (!location?.state?.id) {
    navigate(-1);
  }

  return (
    <div style={{ marginBottom: "80px" }} className="productdetails_page">
      {/* <Header/> */}
      <PagesHeader
        title={language == "ar" ? "وصف المنتج" : "Product Description"}
      />
      <div>
        <div style={{ marginTop: "30px" }} className="product_details">
          {/* <ProductSlider/> */}
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
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="mySwiper"
          >
            {product?.images?.length > 0
              ? product?.images.map((item, index) => {
                  return (
                    <SwiperSlide>
                      <div style={{ height: "100%" }} className="product_img">
                        <img src={item.link} alt="" />
                      </div>
                    </SwiperSlide>
                  );
                })
              : null}
          </Swiper>
          {/* <div className="product_colors">
              {
                product?.colors?.map((item,index)=>{
                  return(
                    <div onClick={()=>{
                      setselectedcolor(item.id)
                      setproperities(item.props);
                    }} style={{
                      width:'40px',
                      height:'40px',
                      borderRadius:'50%',
                      backgroundColor:item.id==selecedcolor?'transparent':`${item.color_code}`,
                      border:selecedcolor==item.id?`2px solid blue`:''
                     }}>

                    </div>
                  )
                })
              }
            </div> */}
          <div className="product_details_text">
            <div>
              <h5>
                {language == "ar"
                  ? product?.title_ar !== null
                    ? product?.title_ar
                    : null
                  : product?.title !== null
                  ? product?.title
                  : null}
              </h5>
              <div>
                <button
                  onClick={() => {
                    if (product_number > 1) {
                      setproductnumber(product_number - 1);
                    }
                  }}
                >
                  -
                </button>
                <p>{product_number}</p>
                <button
                  onClick={() => {
                    setproductnumber(product_number + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <h4>
              <p>
                <del>${product?.price}</del>
              </p>
              <p>${productdata.new_price}</p>
            </h4>
            {product.producing_company !== null ? (
              <div>
                <p>{language == "ar" ? "المنتج من" : "item fromm"}</p>
                <p>{product?.producing_company}</p>
              </div>
            ) : null}
            {/* {
                  product?.grade!==null?(
                    <div>
                    <p>{language=='ar'?"الدرجه":"Grade"}</p>
                    <p>{product?.grade||"new"}</p>
                  </div>
                  ):(null)
                } */}
            {/* <div className="product_details_text_imgs">
              {product?.images && product?.images.length ?
                product?.images.map((item, index) => {
                  return <div key={index}>
                    <img src={item?.link} alt="alt" />
                  </div>
                })
                : null}


            </div> */}
            {language == "ar" ? (
              product.description_ar !== null ? (
                <div className="product_description2">
                  <h4>{language == "ar" ? "الوصف" : "Description"}</h4>
                  <p>
                    {language == "ar"
                      ? product.description_ar
                      : product.description}
                  </p>
                </div>
              ) : null
            ) : product.description !== null ? (
              <div className="product_description2">
                <h4>{language == "ar" ? "الوصف" : "Description"}</h4>
                <p>
                  {language == "ar" ? product.description : product.description}
                </p>
              </div>
            ) : null}
            {/* <div className='product_description2'>
              <h4>{language=='ar'?"الوصف":"Description"}</h4>
              <p>{language=='ar'?product.description_ar:product.description}</p>
            </div> */}
          </div>
        </div>
        <h6 className="limitation">
          {language == "ar" ? "القيد" : "Limitation"}
        </h6>
      </div>
      <div className="buy_div">
        <div className="buy">
          <p>${product.price}</p>
          <button
            onClick={() => {
              let allProperitiesData = [...properties];
              // console.log(allProperitiesData)
              let pushedarr = [];
              for (let i = 0; i < allProperitiesData.length; i++) {
                let allvalues = [...allProperitiesData[i]?.values];
                for (let k = 0; k < allvalues.length; k++) {
                  let obj = {};
                  if (allvalues[k].checked == true) {
                    obj = {
                      ...allvalues[k],
                    };
                    obj["label_parent"] = allProperitiesData[i]?.label;
                    obj["color_id"] = allProperitiesData[i]?.color_id;
                    obj["parent_id"] = allProperitiesData[i]?.id;
                    pushedarr.push(obj);
                  }
                }
              }
              let props_ids = "";
              let props_label = "";
              let props_value_ids = "";
              let props_price = "";
              for (let i = 0; i < pushedarr.length; i++) {
                if (i == 0) {
                  props_ids += pushedarr[i].prop_id;
                  props_label += pushedarr[i].label_parent;
                  props_value_ids += pushedarr[i].id;
                  props_price += pushedarr[i].plus_price;
                } else {
                  props_ids += "/" + pushedarr[i].prop_id;
                  props_label += "*mangaam*" + pushedarr[i].label_parent;
                  props_value_ids += "/" + pushedarr[i].id;
                  props_price += "/" + pushedarr[i].plus_price;
                }
              }
              let product_total_price = 0;
              // console.log(properties);
              for (let i = 0; i < pushedarr.length; i++) {
                product_total_price += pushedarr[i].plus_price;
              }
              product_total_price +=
                product.discount * 1 > 0
                  ? product.price * 1 -
                    product.price * 1 * ((product.discount * 1) / 100)
                  : product.price * 1;
              product_total_price *= product_number * 1;
              let grand_price = selectedproduct.price * 1;
              // console.log(grand_price)
              // console.log(grand_price)
              // console.log(productwithcolor.price)
              for (let i = 0; i < pushedarr.length; i++) {
                grand_price += pushedarr[i].plus_price * 1;
                // console.log(pushedarr[i])
                // console.log(pushedarr[i].plus_price)
              }
              // console.log(grand_price)
              grand_price *= product_number * 1;
              let grand_price_without_discount =
                grand_price +
                product.price * 1 * ((product.discount * 1) / 100);
              let grand_price_with_discount =
                grand_price -
                product.price * 1 * ((product.discount * 1) / 100);
              if (Object.keys(shippingdata) == 0) {
                toast.warn(
                  language == "ar"
                    ? "من فضلك إختر طريقة الشحن أولا"
                    : "Please Select Shipping Compay"
                );
                return;
              }
              navigate("/checkoutdes", {
                state: {
                  selecedcolor,
                  total_price: product_total_price,
                  grand_price_with_discount,
                  grand_price_without_discount,
                  grand_price,
                  props_price,
                  props_value_ids,
                  props_label,
                  product: product,
                  productwithcolor: selectedproduct,
                  shipping: shippingdata,
                  product_number,
                  properties: pushedarr,
                  props_ids,
                  offerdata: productdata,
                },
              });
            }}
          >
            {language == "ar" ? "شراء الأن" : "Buy Now"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: "4px",
          }}
        >
          {product?.colors && product?.colors.length
            ? product?.colors.map((item, index) => {
                // console.log(item)
                return (
                  <div className="airpods">
                    <div
                      onClick={() => {
                        setselectedproduct(item);
                      }}
                      className={
                        selectedproduct.id == item.id
                          ? "airpod active"
                          : "airpod"
                      }
                    >
                      {/* {console.log(item)} */}
                      <img
                        src={item?.images[6]?.link || item?.images[0]?.link}
                        alt=""
                      />
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        {properties.map((item, index) => {
          if (item?.values?.length > 0) {
            return (
              <div className="productsize">
                <div className="sizes">
                  <h4>{language == "ar" ? item.label_ar : item.label}</h4>
                  {item.values.map((it, ind) => {
                    return (
                      <div
                        // onClick={()=>{
                        //   setallfeatures[`${item.label}`]=it.label;
                        // }}
                        onClick={() => {
                          handlechangevalchecked(item.id, it.id);
                        }}
                        className="size"
                      >
                        <input
                          checked={it.checked}
                          id={it.label}
                          onClick={() => {
                            setproductsize(it.label);
                          }}
                          type="radio"
                          name=""
                        />
                        <label htmlFor={it.label}>
                          {language == "ar" ? it.label_ar : it.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          } else return null;
        })}

        <div className="productshipping">
          <div className="productshipping_title">
            <h5 style={{ alignItems: "center" }}>
              <span>{language == "ar" ? "شحن" : "shipping"}</span>
            </h5>
            <button>Delivery Time for 2 days</button>
          </div>
          <div className="productshipping_content">
            {shippingCompany?.map((item, index) => {
              // console.log(item)
              return (
                <div className="shiping_select">
                  <input
                    id={item.title}
                    onClick={() => {
                      setshipselect(item.title);
                    }}
                    checked={shipselect == item.title ? true : false}
                    type="radio"
                    name=""
                  />
                  <label
                    onClick={() => {
                      setshipselect(item.title);
                      setshippingdata(item);
                    }}
                    htmlFor={item.title}
                  >
                    {language == "ar" ? item.title_ar : item.title}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="product_overview">
          <h5>{language == "ar" ? "نظره عامه" : "Over View"}</h5>
          <p>
            {language == "ar" ? product.description_ar : product.description}
          </p>
        </div>
        {product.model_number !== null ? (
          <div className="product_model">
            {/* {console.log(product)} */}
            <h5>{language == "ar" ? "اسم النموزج" : "Model Number"}</h5>
            <p>{product.model_number}</p>
          </div>
        ) : null}
        <div className="customer_revs">
          <div className="customer_revs_title">
            <h5>{language == "ar" ? "تقييم العملاء" : "Customer Reviews"}</h5>
            <BsChevronDown />
          </div>
          <div className="rate_div_stars">
            <div className="left">
              <h4>
                <span>4.6</span>
                <span>/</span>
                <span>5</span>
              </h4>
              <p>Based on {userReviews?.length} Review</p>
              <div className="">
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
              </div>
            </div>
            <div className="right">
              <div>
                {rates.map((item, index) => {
                  return (
                    <div className="customer_rate">
                      {/* {console.log(`${(item.rate * 1)}%`)} */}
                      <h5>{item.star} star</h5>
                      <div className="rate_parent">
                        <span
                          style={{
                            width: `${item.rate * 1}%`,
                            height: "100%",
                            // width:'item.rate %',
                            display: "block",
                            borderRadius: "10px",
                            backgroundColor: "#FE8D2A",
                          }}
                          className="rate_child"
                        ></span>
                      </div>
                      {/* <h5>
                          <span>{item.rate}</span>
                          <span>%</span>
                        </h5> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="users_reviews_div">
            <div style={{ marginBottom: "10px" }} className="title">
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                {language == "ar" ? "تقييم العملاء" : "User Reviews"}
              </h4>
              <h5
                style={{
                  cursor: "pointer",
                  color: "#FE8D2A",
                  fontSize: "14px",
                }}
                onClick={() => {
                  setshowallreviews(true);
                }}
              >
                {language == "ar" ? "مشاهدة الكل" : "See All"}
              </h5>
            </div>
            <div className="user_reviews">
              {userReviews.map((item, index) => {
                if (index < 2) {
                  return (
                    <div className="user_review">
                      <div>
                        <div className="person_data">
                          <img src={item.img} alt="" />
                          <h4>{item.name}</h4>
                          <p>{item.time}</p>
                        </div>
                        <div className="stars_div">
                          {[1, 2, 3, 4, 5].map((star) => {
                            return (
                              <AiFillStar
                                style={{
                                  color:
                                    star <= item.rate ? "#FE8D2A" : "#dedede",
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <p>{item.review}</p>
                    </div>
                  );
                } else return null;
              })}
            </div>
          </div>
          <h4 className="statics_title">
            <span>{language == "ar" ? "حالات البيع" : "Sales Stats"}</span>
            <BsChevronDown />
          </h4>
          <div className="statics_one">
            <p>{language == "ar" ? "تجربة المشتري" : "Purchaser Experience"}</p>
            <div className="statics_one_content">
              <img src={require("../../../assets/statics.png")} alt="" />
              <div className="statics">
                <div className="static">
                  <div>
                    <span></span>
                    <p>first mangam</p>
                  </div>
                  <p>30%</p>
                </div>
                <div className="static">
                  <div>
                    <span></span>
                    <p>first mangam</p>
                  </div>
                  <p>25%</p>
                </div>
                <div className="static">
                  <div>
                    <span></span>
                    <p>first mangam</p>
                  </div>
                  <p>20%</p>
                </div>
                <div className="static">
                  <div>
                    <span></span>
                    <p>first mangam</p>
                  </div>
                  <p>15%</p>
                </div>
                <div className="static">
                  <div>
                    <span></span>
                    <p>first mangam</p>
                  </div>
                  <p>10%</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="statics_two">
            <h4 className="statics_two_title">
              Quantity Breakdown
            </h4>
            <div className="statics_two_content">
              <div style={{ marginTop: '70px' }} className="left">
                <img src={require("../../../assets/leftpng.png")} alt="" />
              </div>
              <div className="right">
                <img src={require("../../../assets/Histogram.png")} alt="" />
              </div>
            </div>
            <div className='bought'>
              <h4>bought 3</h4>
              <h4>bought 2</h4>
              <h4>bought 3</h4>
            </div>
          </div> */}
          <div className="terms">
            <h4>
              {language == "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
            </h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud{" "}
            </p>
            <div>
              <input type="checkbox" name="" id="" />
              <p>
                {language == "ar" ? " أنا موافق على" : "I Agree on the "}
                <span>
                  {language == "ar" ? "البنود و الظروف " : "Terms & Conditions"}
                </span>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      {showallreviews ? (
        <div className="review_div">
          <div></div>
          <div className="reviews">
            <AiOutlineClose
              onClick={() => {
                setshowallreviews(false);
              }}
            />

            <h4>User reviews</h4>
            {userReviews?.map((item, index) => {
              return (
                <div key={index} className="user_review">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="person_data">
                      <img src={item.img} alt="" />
                      <h4>{item.name}</h4>
                      <p>{item.time}</p>
                    </div>
                    <div className="stars_div">
                      {[1, 2, 3, 4, 5].map((star) => {
                        return (
                          <AiFillStar
                            style={{
                              color: star <= item.rate ? "#FE8D2A" : "#dedede",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <p>{item.review}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsDes;

import React, { useEffect, useState } from "react";
import { RiLockLine } from "react-icons/ri";
import "./productdetails.css";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
import { FacebookShareButton } from "react-share";
// import "swiper/css/pagination";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { AiFillStar, AiOutlineClose } from "react-icons/ai";
import { default as Pusher, default as pusherJs } from "pusher-js";

// import 'chartjs-adapter-date-fns';
import axios from "axios";
import moment from "moment";
import { Pie } from "react-chartjs-2";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PagesHeader from "../../PagesHeader/PagesHeader";
import { Loader } from "rsuite";
import Modal from "../Home/HotOffers/modal";

const ProductDetails = () => {
  const [offer_id] = useSearchParams();
  const joined = false;
  const [modal, setModal] = useState(false);
  const value = 10;
  const [offerLoading, setOfferLoading] = useState(false);
  const [showallreviews, setshowallreviews] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [shippingdata, setshippingdata] = useState({
    shippingTitle: null,
    shippingTime: null,
  });
  const [colors, setcolors] = useState([]);
  const [productsize, setproductsize] = useState([]);
  // const [colorimages,setcolor]

  const [shipselect, setshipselect] = useState();

  const navigate = useNavigate();
  const [selecedcolor, setselectedcolor] = useState("");
  const [shippingCompany, setshippingCompany] = useState([]);
  const [properties, setproperities] = useState([]);

  const language = useSelector((state) => state.language.lang);
  const [product, setgetProduct] = useState(false);
  const [targetColor, setTargetColor] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [selectedproduct, setselectedproduct] = useState({});
  const [product_number, setproductnumber] = useState(1);
  const [allprice, setallprice] = useState(0);
  const [allpriceoriginal, setallpriceoriginal] = useState(0);
  const [newval, setnewval] = useState(0);
  const [userReviews, setuserReviews] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );
  const [offerData, setofferData] = useState();

  const joinRoom = async (coins, roomId) => {
    setJoinLoading(true);
    await axios
      .post("https://api.manjam.shop/v2/rooms/join", {
        user_id: userData?.userId,
        user_image: userData?.userPicture,
        user_name: userData?.username,
        cost: coins,
        offer_id: offerData?.id,
        rooms_id: roomId,
        store: parseInt(userData?.storeId) == 2 ? "ksa" : "uae",
      })
      .then((res) => {
        console.log(res);
        if (res?.data?.status) {
          toast.success(
            language == "ar" ? "تم الالتحاق بنجاح" : "Joined SuccessFully"
          );
          setOfferLoading(true);
          axios
            .post("https://api.manjam.shop/v2/rooms/Select_Offer_Rooms", {
              offer_id: offer_id?.get("offer_id"),
              type: "user",
            })
            .then((res) => {
              setofferData(res?.data?.message[0]?.offer);
              setRoomData(res?.data?.message[0]);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              setOfferLoading(false);
            });
        } else {
          toast.error(
            language == "ar" ? "أنت ملتحق بالفعل" : "You are already joined "
          );
        }
      })
      .catch((err) => err)
      .finally(() => {});
  };

  const getshippingcompany = () => {
    axios
      .post("https://api.manjam.shop/v2/shipping/getAll", {
        timeout: 8989898989,
      })
      .then((res) => {
        setshippingCompany(res.data.message);
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
        return { ...item, checked: !item.checked };
      } else return { ...item, checked: false };
    });
    let pusheddata = [];
    useddata[0].values = valuesarr;
    for (let i = 0; i < alldata.length; i++) {
      let values = [...alldata[i]?.values];
      for (let y = 0; y < values.length; y++) {
        if (values[y].id == childid && alldata[i].id == parentid) {
          alldata[i].values = valuesarr;
        }
      }
      pusheddata.push(alldata[i]);
    }
    // console.log(pusheddata)
    setproperities(pusheddata);

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
  useEffect(() => {
    getshippingcompany();
  }, []);
  useEffect(() => {
    if (offerData) {
      // getDetails();

      const isjonined = offerData?.joiners?.map(
        (joiner) => +joiner?.user_id == +userData?.userId
      );
    }
  }, [offerData]);

  const [getFromFacebook, setFromFacebook] = useState(false);

  useEffect(() => {
    if (offerData) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const productId = urlParams.get("productId");
      if (productId) {
        const decodedData = atob(productId);
        const decoder = new TextDecoder("utf-8");
        const locationState = decoder.decode(
          new Uint8Array(
            decodedData.split("").map((char) => char.charCodeAt(0))
          )
        );
        setFromFacebook(locationState || locationState.length);
      }
    }
  }, [offerData]);
  useEffect(() => {
    if (offerData)
      if (properties && properties?.length && newval == 0) {
        setnewval(parseFloat(properties[0]?.values[0]?.new_price));
      }
  }, [properties, offerData]);

  useEffect(() => {
    setOfferLoading(true);
    axios
      .post("https://api.manjam.shop/v2/rooms/Select_Offer_Rooms", {
        offer_id: offer_id?.get("offer_id"),
        type: "user",
      })
      .then((res) => {
        setofferData(res?.data?.message[0]?.offer);
        setRoomData(res?.data?.message[0]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setOfferLoading(false);
      });
  }, [offer_id?.get("offer_id")]);

  const holdOffer = () => {
    if (shippingdata?.shippingTitle) {
      setBuyLoading(true);
      axios
        .post("https://api.manjam.shop/v2/offers/updateOfferHold", {
          offer_id: offerData?.id,
          hold: 1,
        })
        .then((res) => {
          if (res?.data?.status) {
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
            // console.log(productwithcolor.price)
            for (let i = 0; i < pushedarr.length; i++) {
              grand_price += pushedarr[i].plus_price * 1;
              // console.log(pushedarr[i])
              // console.log(pushedarr[i].plus_price)
            }
            grand_price *= product_number * 1;
            let grand_price_without_discount =
              grand_price + product.price * 1 * ((product.discount * 1) / 100);
            let grand_price_with_discount =
              grand_price - product.price * 1 * ((product.discount * 1) / 100);
            navigate("/checkout", {
              state: {
                offerdata: offerData,
                selecedcolor: selectedproduct,
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
                gd: "sad",
                grade: product?.grade,
              },
            });
            localStorage.setItem(
              "manjamOrder",
              JSON.stringify({
                offerdata: offerData,
                selecedcolor: selectedproduct,
                total_price: product_total_price,
                grand_price_with_discount,
                grand_price_without_discount,
                grand_price,
                props_price,
                props_value_ids,
                props_label,
                product: product,
                productwithcolor: selectedproduct,
                gd: "sad",
                shipping: shippingdata,
                product_number,
                grade: product?.grade,
                properties: pushedarr,
                props_ids,
              })
            );
          } else {
            toast.error(
              language == "ar" ? "شخص ما يحاول الشراء" : "Someone Try to buy"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setBuyLoading(false);
        });
    } else {
      toast.error(
        language == "ar"
          ? "الرجاء تحديد طريقة شحن أولا"
          : "Choose Shipping Method First"
      );
    }
  };
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
          // Fetch room data initially
          // const roomData = await getRoom();
          requestInProgress = false;
          channel.bind("NewJoiner", async function (data) {
            // console.log(data);
            axios
              .post("https://api.manjam.shop/v2/rooms/Select_Offer_Rooms", {
                offer_id: offer_id?.get("offer_id"),
                type: "user",
              })
              .then((res) => {
                setofferData(res?.data?.message[0]?.offer);
                setRoomData(res?.data?.message[0]);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setOfferLoading(false);
              });
          });
          // Listen for price changes only after initial data fetching
          channel.bind("priceReduced", async function (data) {
            // console.log(data);
            axios
              .post("https://api.manjam.shop/v2/rooms/Select_Offer_Rooms", {
                offer_id: offer_id?.get("offer_id"),
                type: "user",
              })
              .then((res) => {
                setofferData(res?.data?.message[0]?.offer);
                setRoomData(res?.data?.message[0]);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setOfferLoading(false);
              });
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

    // Fetch data when component mounts
    fetchData();
  }, [pusherJs]);
  const getoffers = () => {
    if (Array.isArray(offerData?.products[0]?.colors)) {
      setcolors(offerData?.products[0]?.colors);
      setselectedcolor(offerData?.products[0]?.colors[0]?.id);
    }
    if (Array.isArray(offerData?.products[0]?.colors[0]?.props)) {
      let allvalues = [...offerData?.products[0]?.colors[0]?.props];
      for (let i = 0; i < allvalues.length; i++) {
        if (i == 0) {
          allvalues[i].checked = true;
        } else {
          allvalues[i].checked = false;
        }
      }
      setproperities(allvalues);
    }
    setgetProduct(offerData?.products[0]);
    let allcolors = [...offerData?.products[0]?.colors[0]?.props];
    if (Array.isArray(offerData?.products[0].customerReviews)) {
      setuserReviews(offerData?.products[0].customerReviews);
    }
    for (let i = 0; i < allcolors.length; i++) {
      let values = [...allcolors[i]?.values];
      for (let j = 0; j < values.length; j++) {
        values[j]["checked"] = false;
      }
      allcolors[i].values = values;
    }
    let color = { ...offerData?.products[0]?.colors[0] };
    for (let i = 0; i < color.props[0].values.length; i++) {
      if (i == 0) {
        color.props[0].values[i].checked = true;
      } else {
        color.props[0].values[i].checked = false;
      }
    }
    setselectedproduct(color);
    setallprice(color.props[0].values[0].new_price * 1);
    setallpriceoriginal(color.props[0].values[0].new_price * 1);
    setTargetColor(offerData?.products[0]);
  };

  useEffect(() => {
    if (offerData) getoffers();
  }, [offerData]);

  useEffect(() => {
    let allcolors = [...colors];
    if (Array.isArray(allcolors)) {
      let selcolor = allcolors.filter((item) => item.id == selectedproduct.id);
      // console.log(selcolor)
      if (Array.isArray(selcolor) && selcolor.length > 0) {
        setproperities(selcolor[0]?.props);
        if (Array.isArray(selcolor[0]?.props)) {
          let allvalues = [...selectedproduct?.props];
          for (let i = 0; i < allvalues[0].values.length; i++) {
            if (i == 0) {
              allvalues[0].values[i].checked = true;
            } else {
              allvalues[0].values[i].checked = false;
            }
          }
          setproperities(allvalues);
          setallprice(
            selcolor[0]?.props[0].values[0].new_price * product_number
          );
          setallpriceoriginal(
            selcolor[0]?.props[0].values[0].new_price * product_number
          );
        }
      }
    }
  }, [selectedproduct, offerData]);
  useEffect(() => {
    setproductnumber(1);
  }, [newval, offerData]);
  useEffect(() => {
    setallprice(allpriceoriginal * product_number);
    // setallprice(((allprice*1)/((product_number*1)-1))*(product_number*1));
  }, [product_number, offerData]);

  useEffect(() => {
    setallprice(newval * 1 * product_number);
    setallpriceoriginal(newval * 1 * product_number);
  }, [product_number, newval]);
  const data = {
    labels: ["First Mangam", "Second Mangam", "< 10 Mangam", "> 10 mangam"],
    datasets: [
      {
        label: "Example Dataset",
        data: [
          offerData?.levelOne?.rate,
          offerData?.levelSecond?.rate,
          offerData?.LevelLtTen?.rate,
          offerData?.LevelGtTen?.rate,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      x: {
        display: false, // Remove x-axis labels
      },
      y: {
        display: false, // Remove y-axis labels
      },
    },
    plugins: {
      legend: {
        display: false, // Remove legend labels
      },
    },
  };
  Chart.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
  );

  return (
    <div style={{ marginBottom: "80px" }} className="productdetails_page">
      {/* <Header/> */}
      <PagesHeader
        title={
          language == "ar"
            ? product?.title_ar !== null
              ? product?.title_ar
              : null
            : product?.title !== null
            ? product?.title
            : null
        }
      />
      {offerLoading ? (
        <Loader />
      ) : offerData && offerData?.id ? (
        <>
          <div className="shareOnFacebook">
            <FacebookShareButton
              url={
                window.location.origin +
                "/productdetails?offer_id=" +
                offerData?.id
              }
              hashtag={"#manjam-shop"}
              description={
                language == "ar"
                  ? product?.description_ar
                  : product?.description
              }
              className="Demo__some-network__share-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M14.4998 11.0007C13.9328 11.0011 13.3743 11.1396 12.8727 11.404C12.3711 11.6685 11.9413 12.0511 11.6206 12.5187L6.73882 10.3144C7.08556 9.47715 7.0869 8.5367 6.74257 7.69843L11.6176 5.48293C12.093 6.1705 12.7991 6.6649 13.6078 6.87646C14.4165 7.08803 15.2742 7.00273 16.0254 6.63606C16.7766 6.26938 17.3715 5.6456 17.7022 4.87788C18.0329 4.11016 18.0775 3.24933 17.8278 2.45156C17.5782 1.65379 17.0509 0.971902 16.3416 0.529596C15.6323 0.0872902 14.788 -0.0861409 13.9617 0.0407618C13.1355 0.167664 12.3821 0.586495 11.8382 1.22128C11.2944 1.85607 10.996 2.66476 10.9973 3.50068C11.0005 3.69853 11.0206 3.89575 11.0573 4.09018L5.87482 6.44518C5.37708 5.97884 4.75395 5.66806 4.082 5.551C3.41005 5.43395 2.71854 5.51572 2.09243 5.78627C1.46631 6.05683 0.932866 6.50438 0.557619 7.07395C0.182372 7.64352 -0.0183294 8.3103 -0.019828 8.99237C-0.0213266 9.67443 0.176443 10.3421 0.549183 10.9133C0.921923 11.4845 1.4534 11.9344 2.07832 12.2077C2.70324 12.481 3.39438 12.5658 4.06684 12.4517C4.7393 12.3376 5.36378 12.0296 5.86357 11.5654L11.0596 13.9114C11.0235 14.1057 11.0037 14.3026 11.0003 14.5002C11.0002 15.1925 11.2054 15.8694 11.5899 16.4451C11.9745 17.0208 12.5211 17.4696 13.1607 17.7346C13.8004 17.9996 14.5042 18.069 15.1833 17.934C15.8623 17.7989 16.4861 17.4655 16.9756 16.976C17.4652 16.4864 17.7986 15.8627 17.9336 15.1836C18.0686 14.5046 17.9993 13.8007 17.7342 13.1611C17.4692 12.5215 17.0205 11.9748 16.4447 11.5903C15.869 11.2057 15.1922 11.0005 14.4998 11.0007ZM14.4998 1.50043C14.8955 1.50028 15.2823 1.61747 15.6113 1.83717C15.9403 2.05687 16.1968 2.36921 16.3483 2.7347C16.4999 3.10018 16.5396 3.50239 16.4625 3.89045C16.3854 4.27851 16.1949 4.63499 15.9152 4.9148C15.6355 5.19462 15.2791 5.3852 14.8911 5.46244C14.503 5.53968 14.1008 5.50011 13.7353 5.34874C13.3697 5.19737 13.0573 4.94099 12.8375 4.61204C12.6177 4.28308 12.5003 3.89632 12.5003 3.50068C12.5007 2.97043 12.7115 2.46201 13.0864 2.08699C13.4612 1.71198 13.9696 1.50103 14.4998 1.50043ZM3.50032 11.0007C3.10468 11.0008 2.71788 10.8836 2.38884 10.6639C2.0598 10.4442 1.80331 10.1319 1.6518 9.76641C1.50029 9.40093 1.46057 8.99872 1.53766 8.61066C1.61476 8.2226 1.80521 7.86612 2.08492 7.58631C2.36463 7.30649 2.72104 7.11591 3.10907 7.03867C3.4971 6.96143 3.89932 7.001 4.26486 7.15237C4.6304 7.30374 4.94284 7.56012 5.16267 7.88907C5.38249 8.21803 5.49982 8.60479 5.49982 9.00043C5.49923 9.53062 5.2884 10.0389 4.91357 10.4139C4.53874 10.7889 4.03051 10.9999 3.50032 11.0007ZM14.4998 16.5004C14.1042 16.5004 13.7175 16.3831 13.3885 16.1633C13.0596 15.9435 12.8032 15.6311 12.6518 15.2656C12.5004 14.9001 12.4608 14.498 12.538 14.11C12.6152 13.7219 12.8057 13.3655 13.0854 13.0858C13.3652 12.8061 13.7216 12.6155 14.1096 12.5384C14.4976 12.4612 14.8998 12.5008 15.2653 12.6522C15.6308 12.8036 15.9432 13.06 16.163 13.3889C16.3828 13.7178 16.5001 14.1046 16.5001 14.5002C16.4997 15.0306 16.2888 15.5391 15.9138 15.9141C15.5387 16.2892 15.0302 16.5 14.4998 16.5004Z"
                  fill="black"
                />
              </svg>
            </FacebookShareButton>
          </div>
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
                // mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Keyboard]}
                className="mySwiper"
              >
                {selectedproduct?.images?.length > 0
                  ? selectedproduct?.images.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div
                            style={{ height: "100%" }}
                            className="product_img"
                          >
                            <img src={item.link} alt="" />
                          </div>
                        </SwiperSlide>
                      );
                    })
                  : null}
              </Swiper>

              <div className="product_details_text ">
                <div>
                  <h5>
                    {language === "ar"
                      ? product?.title_ar !== null
                        ? product?.title_ar
                        : null
                      : product?.title !== null
                      ? product?.title
                      : null}
                  </h5>
                  {/* <div>
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
                    if (product_number < 3) {
                      setproductnumber(product_number + 1);
                    }
                  }}
                >
                  +
                </button>
              </div> */}
                </div>
                <h4>
                  {offerData?.isTendered ? (
                    <span>
                      {language == "ar" ? "السعر حتى الآن" : "Price until now"}
                    </span>
                  ) : (
                    <span>{language == "ar" ? "السعر" : "Price"}</span>
                  )}
                  <p>
                    <del>
                      $
                      {Array.isArray(product?.colors)
                        ? selectedproduct?.props[0].values.map((item) => {
                            if (item.checked === true) {
                              return item.old_price;
                            } else {
                              return null;
                            }
                          })
                        : null}
                    </del>
                  </p>
                  <p>
                    $
                    {Array.isArray(product?.colors)
                      ? selectedproduct?.props[0].values.map((item) => {
                          if (item.checked === true) {
                            return item.new_price;
                          } else {
                            return null;
                          }
                        })
                      : null}
                  </p>
                </h4>
                <div>
                  {product.product_comapny !== null ? (
                    <div>
                      <p>{language == "ar" ? "المنتج من" : "Item From"}</p>
                      <p>{product?.producing_company}</p>
                    </div>
                  ) : null}

                  {product.grade !== null ? (
                    <div>
                      <p>{language == "ar" ? "حالة المنتج" : "Grade"}</p>
                      <p>{product?.grade}</p>
                    </div>
                  ) : null}
                </div>
                (
                <>
                  {offerData?.isTendered == 0 ? null : (
                    <div className="joiners border-0 mt-0 pt-0">
                      <div className="spinner-title">
                        <div
                          className="spinner"
                          style={{
                            maxWidth: "48px",
                            maxHeight: "48px",
                          }}
                        >
                          <CircularProgressbarWithChildren
                            value={
                              roomData?.participants?.length /
                              offerData?.maximunJoiners
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
                                {language == "ar" ? "المشتركين" : "JOINERS"}
                              </div>
                              <div className="count">
                                {language == "ar" ? (
                                  <>
                                    <span>
                                      {roomData?.participants?.length}
                                    </span>
                                    <span>من</span>
                                    <span>{offerData?.maximunJoiners}</span>
                                  </>
                                ) : (
                                  <>
                                    <span>
                                      {roomData?.participants?.length}
                                    </span>
                                    <span>of</span>
                                    <span>{offerData?.maximunJoiners}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </CircularProgressbarWithChildren>
                        </div>
                        <div className="description big">
                          {" "}
                          {language === "ar"
                            ? " ستبدأ المزايدة عند اكتمال عدد المنضمين"
                            : "Bidding will begin when the number of joiners is complete"}
                        </div>
                      </div>

                      {roomData?.participants?.filter(
                        (joiner) => joiner.user_id == userData.userId
                      )?.length ? (
                        <button
                          className={
                            offerData?.hold ? "join-view disable" : "join-view"
                          }
                          onClick={() => {
                            if (!offerData?.hold) holdOffer();
                            else
                              toast.error(
                                language == "ar"
                                  ? "شخص ما يحاول الشراء"
                                  : "Someone try to buy now!"
                              );
                            // navigate(`/details/${offerData?.id}`);
                          }}
                          // disabled={offerData?.hold}
                        >
                          <>
                            <div>{language === "ar" ? "شراء" : "Buy Now"}</div>
                          </>
                        </button>
                      ) : (
                        <button
                          disable={
                            offerData?.joiners?.length ==
                            offerData?.maximunJoiners
                          }
                          style={{
                            opacity:
                              offerData?.joiners?.length ==
                              offerData?.maximunJoiners
                                ? "0.5"
                                : "1",
                          }}
                          className="join-view"
                          onClick={() => {
                            if (userData?.coins >= offerData?.cost)
                              setModal([
                                offerData?.cost,
                                roomData?.room_id ? roomData?.room_id : "0",
                                offerData?.id,
                              ]);
                            else
                              toast.error(
                                language == "ar"
                                  ? "ليس لديك نقاط كافية للالتحاق بالمناقصة"
                                  : "You are not have enough points to join"
                              );
                          }}
                        >
                          <>
                            <div>
                              {language === "ar" ? "اشترك الآن" : "Join Now"}
                            </div>
                            <div className="join-price">
                              {language === "ar" ? "مقابل $" : "for"}
                              <img
                                src={require("../../assets/lc_coin.png")}
                                alt=""
                              />
                              {offerData?.cost}
                            </div>
                          </>
                        </button>
                      )}
                    </div>
                  )}

                  {offerData?.isTender ? (
                    <div className="joiners border-0 mt-0 pt-0">
                      <div className="spinner-title">
                        <div
                          className="spinner"
                          style={{
                            maxWidth: "48px",
                            maxHeight: "48px",
                          }}
                        >
                          <CircularProgressbarWithChildren
                            value={value}
                            maxValue={10}
                            strokeWidth={10}
                            styles={buildStyles({
                              textSize: "16px",
                              pathTransitionDuration: 0.5,
                              // Colors
                              pathColor: `#F48320`,
                              textColor: "#222",
                              trailColor: "#D0E2FF",
                              backgroundColor: "#3e98c7",
                            })}
                          >
                            <div className="spinner-text">
                              {language === "ar" ? (
                                <>
                                  <div className="title">المشتركين</div>
                                  <div className="count"> {value} من 10</div>
                                </>
                              ) : (
                                <>
                                  <div className="title">JOINERS</div>
                                  <div className="count"> {value} of 10 </div>
                                </>
                              )}
                            </div>
                          </CircularProgressbarWithChildren>
                        </div>
                        <div className="description big">
                          {" "}
                          {language === "ar"
                            ? " ستبدأ المزايدة عند اكتمال عدد المنضمين"
                            : "Bidding will begin when the number of joiners is complete"}
                        </div>
                      </div>

                      {/* <button className="join-view">
              {true % 2 == 0 ? (
                <>
                  <div>اشترك الآن</div>
                  <div className="join-price">مقابل 3$</div>
                </>
              ) : (
                "عرض"
              )}
            </button> */}
                    </div>
                  ) : null}
                </>
                {language === "ar" ? (
                  product.description_ar !== null ? (
                    <div className="product_description2">
                      <h4>{language === "ar" ? "الوصف" : "Description"}</h4>
                      <p>
                        {language === "ar"
                          ? product.description_ar
                          : product.description}
                      </p>
                    </div>
                  ) : null
                ) : product.description !== null ? (
                  <div className="product_description2 ">
                    <h4>{language === "ar" ? "الوصف" : "Description"}</h4>

                    <p>
                      {language === "ar"
                        ? product.description
                        : product.description}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            {!offerData?.isTendered ? (
              <>
                <h6 className="limitation mb-0">
                  {language == "ar" ? "المتبقي" : "Limitation"}
                </h6>
                <div className="limit">
                  {/* {console.log("selectedproduct", selectedproduct)} */}
                  {Array.isArray(product?.colors)
                    ? selectedproduct?.props[0].values.map((item) => {
                        if (item.checked == true) {
                          return offerData?.time_av_for?.days > 0
                            ? item?.r_stock +
                                (language == "ar"
                                  ? " قطعة متاحة لغاية  "
                                  : "  Piece Available For ") +
                                offerData?.time_av_for?.days +
                                (language == "ar" ? " أيام " : " days")
                            : item?.r_stock +
                                (language == "ar"
                                  ? " قطعة متاحة لغاية  "
                                  : "  Piece Available For ") +
                                offerData?.time_av_for?.hours +
                                (language == "ar" ? " ساعات " : " Hours");
                        } else {
                          return null;
                        }
                      })
                    : null}
                </div>
              </>
            ) : null}
          </div>

          <div className="buy_div">
            <h6 className="limitation">
              {language == "ar" ? "الألوان" : "Colors"}
            </h6>
            {offerData?.isTendered == 0 ? (
              <div className="buy">
                <p>${allprice}</p>

                {joined == true ? (
                  <button className="join-view">
                    <div>اشترك الآن</div>
                    <div className="join-price">مقابل 3$</div>
                  </button>
                ) : (
                  <button
                    disabled={value != 10 ? "true" : ""}
                    onClick={() => {
                      if (shippingdata?.shippingTitle) {
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
                              obj["label_parent"] =
                                allProperitiesData[i]?.label;
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
                            props_label +=
                              "*mangaam*" + pushedarr[i].label_parent;
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
                        // console.log(productwithcolor.price)
                        for (let i = 0; i < pushedarr.length; i++) {
                          grand_price += pushedarr[i].plus_price * 1;
                          // console.log(pushedarr[i])
                          // console.log(pushedarr[i].plus_price)
                        }
                        grand_price *= product_number * 1;
                        let grand_price_without_discount =
                          grand_price +
                          product.price * 1 * ((product.discount * 1) / 100);
                        let grand_price_with_discount =
                          grand_price -
                          product.price * 1 * ((product.discount * 1) / 100);
                        navigate("/checkout", {
                          state: {
                            offerdata: offerData,
                            selecedcolor: selectedproduct,
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
                            gd: "sad",
                            grade: product?.grade,
                          },
                        });
                        localStorage.setItem(
                          "manjamOrder",
                          JSON.stringify({
                            offerdata: offerData,
                            selecedcolor: selectedproduct,
                            total_price: product_total_price,
                            grand_price_with_discount,
                            grand_price_without_discount,
                            grand_price,
                            props_price,
                            props_value_ids,
                            props_label,
                            product: product,
                            productwithcolor: selectedproduct,
                            gd: "sad",
                            shipping: shippingdata,
                            product_number,
                            grade: product?.grade,
                            properties: pushedarr,
                            props_ids,
                          })
                        );
                      } else {
                        toast.error(
                          language == "ar"
                            ? "الرجاء تحديد طريقة شحن أولا"
                            : "Choose Shipping Method First"
                        );
                      }
                    }}
                    className={`bg-opacity-50`}
                    style={{
                      opacity: value != 10 ? ".5" : "1",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center text-nowrap">
                      <div className="">
                        {language == "ar" ? "شراء الأن" : "Buy Now"}
                      </div>

                      {value != 10 ? (
                        <div className="me-2">
                          <RiLockLine color="#FFF" />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </button>
                )}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // justifyContent: 'space-between',
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "36px",
              }}
            >
              {/* {console.log("offerData", offerData)} */}
              {product?.colors && product?.colors.length
                ? colors.map((item, index) => {
                    return (
                      <div key={index} className="airpods">
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
                  <div key={item?.id} className="productsize">
                    <div className="sizes">
                      <h4>{language == "ar" ? item.label_ar : item.label}</h4>
                      {item.values.map((it, ind) => {
                        return (
                          <div
                            key={ind}
                            onClick={() => {
                              handlechangevalchecked(item.id, it.id);
                              setnewval(it.new_price);
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

            <div className="productsize">
              <div className="sizes">
                <h4>{language == "ar" ? " شركة الشحن " : "Shipping"}</h4>
                <div className="size">
                  <input
                    // checked={it.checked}
                    id={"shipp"}
                    onClick={() => {
                      setshippingdata({
                        ...shippingdata,
                        shippingTitle: "DHL",
                      });
                    }}
                    type="radio"
                    name=""
                  />
                  <label htmlFor={"shipp"}>DHL</label>
                </div>
              </div>
            </div>
            <div className="product_overview">
              <h5>{language == "ar" ? "نظره عامه" : "Over View"}</h5>
              <p>
                {language == "ar"
                  ? product.description_ar
                  : product.description}
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
                <h5>
                  {language == "ar" ? "تقييم العملاء" : "Customer Reviews"}
                </h5>
                <BsChevronDown />
              </div>
              <div className="rate_div_stars">
                <div className="left">
                  <h4>
                    <span>
                      {!isNaN(product?.comRates?.comulativeRate)
                        ? product?.comRates?.comulativeRate
                        : 0}
                    </span>
                    <span>/</span>
                    <span>5</span>
                  </h4>
                  <p>
                    {language == "ar" ? (
                      <>بناءا على {product?.customerReviews?.length} مراجعة</>
                    ) : (
                      <>Based on {product?.customerReviews?.length} Review</>
                    )}
                  </p>
                  <div className="">
                    {[1, 2, 3, 4, 5].map((item, index) => {
                      return (
                        <AiFillStar
                          style={{
                            color:
                              item <= product?.comRates?.comulativeRate * 1
                                ? "rgba(254, 141, 42, 1)"
                                : "rgba(217, 217, 217, 1)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="right">
                  <div>
                    {product?.posRates
                      ? Object.keys(product?.posRates)
                          ?.reverse()
                          ?.map((item, index) => {
                            return (
                              <div key={index} className="customer_rate">
                                <h5>{index + 1} star</h5>
                                <div className="rate_parent">
                                  <span
                                    style={{
                                      width: `${product?.posRates[item]}%`,
                                      height: "100%",
                                      display: "block",
                                      borderRadius: "10px",
                                      backgroundColor: "#FE8D2A",
                                    }}
                                    className="rate_child"
                                  ></span>
                                </div>
                              </div>
                            );
                          })
                      : null}
                  </div>
                </div>
              </div>
              {userReviews?.length > 0 ? (
                <div className="users_reviews_div">
                  <div style={{ marginBottom: "10px" }} className="title">
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: "400",
                      }}
                    >
                      {language == "ar" ? "تقييم العملاء" : "User reviews"}
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
                          <div key={index} className="user_review">
                            <div>
                              <div className="person_data">
                                <img src={item.userImage} alt="" />
                                <h4>{item.userName}</h4>
                                <p>
                                  {moment(item.createdAt)
                                    .startOf("hour")
                                    .locale("ar")
                                    .fromNow()}
                                </p>
                              </div>
                              <div className="stars_div">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  return (
                                    <AiFillStar
                                      key={index}
                                      style={{
                                        color:
                                          star <= item.rate
                                            ? "#FE8D2A"
                                            : "#dedede",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                            <p>"{item.review}"</p>
                          </div>
                        );
                      } else return null;
                    })}
                  </div>
                </div>
              ) : null}
              <h4 className="statics_title">
                <span>{language == "ar" ? "حالات البيع" : "Sales Stats"}</span>
                <BsChevronDown />
              </h4>
              <div className="statics_one">
                <p>
                  {language == "ar" ? "تجربة المشتري" : "Purchaser Experience"}
                </p>
                <div className="statics_one_content">
                  {/* <img src={require("../../assets/statics.png")} alt="" /> */}
                  <Pie
                    data={data}
                    style={{
                      width: "133px !important",
                      height: "133px !important",
                    }}
                    options={options}
                  />

                  <div className="statics">
                    <div className="static">
                      <div>
                        <span></span>
                        <p>first mangam</p>
                      </div>
                      <p>{offerData?.levelOne?.rate}%</p>
                    </div>
                    <div className="static">
                      <div>
                        <span></span>
                        <p>second mangam</p>
                      </div>
                      <p>{offerData?.levelSecond?.rate}%</p>
                    </div>
                    <div className="static">
                      <div>
                        <span></span>
                        <p> &lt; 10 mangam</p>
                      </div>
                      <p>{offerData?.LevelLtTen?.rate}%</p>
                    </div>
                    <div className="static">
                      <div>
                        <span></span>
                        <p>&gt; 10 mangam</p>
                      </div>
                      <p>{offerData?.LevelGtTen?.rate}%</p>
                    </div>

                    {/* <div className="static">
                  <div>
                    <span></span>
                    <p>first mangam</p>
                  </div>
                  <p>10%</p>
                </div> */}
                  </div>
                </div>
              </div>

              {/* <div className="statics_two">
            <h4 className="statics_two_title">Quantity Breakdown</h4>
            <div className="statics_two_content">
              <div style={{ marginTop: '70px' }} className="left">
                <img src={require("../../assets/leftpng.png")} alt="" />
              </div>
              <div className="right">
                <img src={require("../../assets/Histogram.png")} alt="" />
              </div>
            </div>
            <div className="bought">
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
                  {language == "ar"
                    ? product.conditions_ar
                    : product.conditions}
                </p>
                {/* <div>
              <input type="checkbox" name="" id="" />
              <p>
                {language == 'ar' ? " أنا موافق على" : "I Agree on the "}
                <span>
                  {language == 'ar' ? "البنود و الظروف " : "Terms & Conditions"}
                </span>{" "}
              </p>
            </div> */}
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

                <h4>{language == "ar" ? "تقييم العملاء" : "User reviews"}</h4>
                {product?.customerReviews?.map((item, index) => {
                  // console.log("sadfkhakjsd");
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
                          <img src={item.userImage} alt="" />
                          <h4>{item.userName}</h4>
                          <p>
                            {moment(item.createdAt)
                              .locale("arabic")
                              .startOf("hour")
                              .fromNow()}
                          </p>
                        </div>
                        <div className="stars_div">
                          {[1, 2, 3, 4, 5].map((star) => {
                            return (
                              <AiFillStar
                                key={star}
                                style={{
                                  color:
                                    star <= item.rate ? "#FE8D2A" : "#dedede",
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <p>"{item.review}"</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        "No Offer"
      )}{" "}
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

export default ProductDetails;

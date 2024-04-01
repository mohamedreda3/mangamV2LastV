import "bootstrap/dist/css/bootstrap.min.css";
import "react-circular-progressbar/dist/styles.css";
import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./components/Home/Home";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import ShopCategories from "./components/ShopCategories/ShopCategories";
// import OrderDetails from './components/OrderDetails/OrderDetails';
import Notifications from "./components/Notifications/Notifications";
import OrderDetails2 from "./components/OrderDetails2/OrderDetails2";
import OrderLogs from "./components/OrderLogs/OrderLogs";
import Profile from "./components/Profile/Profile";

import { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.min.css";
import CategoryProducts from "./components/CategoryProducts/CategoryProducts";
import CheckoutOutDes from "./components/CheckoutDes/CheckOutDes";
import ProductDetailsDes from "./components/Home/HotOffers/ProductDetailsDes";
import HomeOpen from "./components/HomeOpern/HomeOpen";
import Navbar from "./components/Navbar/Navbar";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import OrderLogs2 from "./components/OrderLogs2/OrderLogs2";
import OtherOffers from "./components/OtherOffers/OtherOffers";
import RetItem from "./components/ReturnItem/RetItem";
import ReturnLog from "./components/ReturnLog/ReturnLog";
import Returns from "./components/Returns/Returns";
import Checkout from "./components/checkout/checkout";
import Successfullcheckout from "./components/successfullcheckout/successfullcheckout";
import { updateLanguage } from "./store/languageReducer";

import { default as Pusher, default as pusherJs } from "pusher-js";
import { useSearchParams } from "react-router-dom";
import { getNotifications } from "./store/getNotifications";
import BiddingRoom from "./components/Home/HotOffers/biddingRoom";
import ProdDetails from "./components/prodDetails/ProdDetails";
import Queue from "./components/Home/HotOffers/queue";
function App() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(localStorage.getItem("manjamUser"));

  const language = useSelector((state) => state.language.lang);
  const updateLaguageData = (matlang) => {
    dispatch(updateLanguage(matlang));
  };

  useEffect(() => {
    pusherJs.logToConsole = false;

    var pusher = new Pusher("dedc8a3114e1b6170f36", {
      cluster: "eu",
    });
    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function (data) {
      dispatch(getNotifications());

      // console.log(data);
    });
    function handleDisconnection() {
      // Handle disconnection here, if needed
      // console.log('Pusher connection disconnected');

      // Attempt to reconnect
      pusher.connect();
    }

    // Bind the 'disconnected' event to the handler function
    pusher.connection.bind("disconnected", handleDisconnection);
  }, []);
  useEffect(() => {
    dispatch(getNotifications());
  }, []);
  useEffect(() => {}, [dispatch]);
  const { decodedToken, isExpired, reEvaluateToken } = useJwt("");
  const [searchParams] = useSearchParams();
  useEffect(() => {
    // console.log("receivedMessage?.Effect");
    reEvaluateToken(searchParams?.get("token"));
    dispatch(updateLanguage(searchParams?.get("lang")));
  }, []);
  // dispatch(updateLanguage("ar"));
  useEffect(() => {
    if (
      !userData ||
      userData === "undefined" ||
      userData === "null" ||
      userData === "Null"
    ) {
      localStorage.setItem("manjamUser", JSON.stringify(decodedToken));
      console.log(decodedToken);
    }
  }, [decodedToken]);

  useEffect(() => {
    setUserData(
      localStorage.getItem("manjamUser")
        ? JSON.parse(localStorage.getItem("manjamUser"))
        : null
    );
  }, [decodedToken]);
  if (language == "ar") {
    document.body.classList.add("ar");
  } else {
    document.body.classList.remove("ar");
  }

  // if (notify_now) {
  //   document.body.style.overflow = "hidden";
  // } else {
  //   document.body.style.overflow = "visible";
  // }
  return (
    <div className={language === "ar" ? "app rtl" : "app ltr"}>
      <div id="id_hash" data-id={""} data-hash={""}></div>
      {/* <Header/> */}
      {/* <NewHeader/> */}
      {userData &&
      userData !== "undefined" &&
      userData !== "null" &&
      userData !== "Null" ? (
        <>
          {" "}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HomeOpen />} />
            <Route path="/shopcategories" element={<ShopCategories />} />
            <Route path="/productdetails" element={<ProductDetails />} />
            <Route path="/orderlogs" element={<OrderLogs />} />
            <Route path="/orderdetails2" element={<OrderDetails2 />} />
            <Route path="/notification" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/orderdetails" element={<OrderDetails />} /> */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/roomId" element={<BiddingRoom />} />
            {/* roomId */}
            <Route path="/checkoutdes" element={<CheckoutOutDes />} />
            <Route path="/Queue" element={<Queue />} />
            {/* Queue */}
            <Route
              path="/successfullcheckout"
              element={<Successfullcheckout />}
            />
            {/* <Route path='/orderdetails' element={<OrderDetails/>}/> */}
            <Route path="/orderdetails" element={<OrderDetails />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/returnitem" element={<RetItem />} />
            <Route path="/otherof" element={<OtherOffers />} />
            <Route path="/orderlogs2" element={<OrderLogs2 />} />
            <Route path="/categoryproduct" element={<CategoryProducts />} />
            <Route path="/productdetaisldes" element={<ProductDetailsDes />} />
            <Route path="/returnlog" element={<ReturnLog />} />
            <Route path="/details/:id" element={<ProdDetails />} />
          </Routes>
          <Navbar />
          <ToastContainer />
        </>
      ) : (
        <h1>You Should Login Firstly In website</h1>
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import Slider from "./Slider/Slider";
import HomeCategories from "./HomeCategories/HomeCategories";
import HotOffers from "./HotOffers/HotOffers";
import Header from "../header";
import "./home.css";
import HomeHeader from "./HomeHeader/HomeHeader";
import axios from "axios";
const Home = () => {
  const [sitedata, setsitedata] = useState({});
  const getsitedata = () => {
    axios
      .get("http://localhost:9999/v2/site/info/getAll")
      .then((res) => {
        // console.log(res.data?.message);
        setsitedata(res?.data?.message[0]);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getsitedata();
  }, []);

  return (
    <div style={{ marginBottom: "80px" }}>
      <div className="headerhome">
        {/* <Header/> */}
        <HomeHeader />
        {/* <button>Recharge balance</button> */}
      </div>
      <Slider />
      <HomeCategories />
      <HotOffers />
      <div className="messimg">
        <img src={require("../../assets/chat 1.png")} alt="" />
      </div>
    </div>
  );
};

export default Home;

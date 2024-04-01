import React, { useEffect, useState } from "react";
import "./homeheader.css";
import { BsChevronLeft } from "react-icons/bs";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import menu from "../../../assets/menu.png";

const HomeHeader = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );

  const [userBalance, setUserBalance] = useState(false);
  const language = useSelector((state) => state.language.lang);

  useEffect(() => {
    // alert("Balance");
    const FormData = require("form-data");
    let data = new FormData();
    data.append("userId", userData?.userId);
    data.append("userHash", userData?.userHash);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://taxes.like4app.com/s2s/users/userInfo",
      headers: {
        apiKey:
          "llfPTSlGKSFkS3e61XBH3SZaPOaQoDIhsq1xH9CAEEHG3MOU2D8B57umjk6xgfIA",
        Cookie: "like4card=c9bd286f87c57cd3d76dc8739f6595cd73a55673",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setUserBalance({
          b: response?.data?.data?.balance,
          c: response?.data?.data?.currency,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userData]);
  const [sitedata, setsitedata] = useState({});
  const getsitedata = () => {
    axios
      .get("https://api.manjam.shop/v2/site/info/getAll", {
        timeout: 8989898989,
      })
      .then((res) => {
        setsitedata(res?.data?.message[0]);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getsitedata();
  }, []);
  return (
    <div className="home_header">
      <nav className="header">
        {/* <BsChevronLeft onClick={() => navigate(-1)} /> */}
        <div
          onClick={() => {
            navigate("/profile");
          }}
          className="person_details"
        >
          {/* <img src={userData?.userPicture} alt="" /> */}

          <span></span>

          <div className="person_details_text">
            <h5>{userData?.username}</h5>
            <h4>
              {userData && userData?.coins ? (
                <span className="user_balance">
                  <img src={require("../../../assets/lc_coin.png")} alt="" />
                  <span className="coin_cont">{userData.coins}</span>
                </span>
              ) : null}
              <p className="rb">
                {language == "ar" ? "إعادة شحن الرصيد" : "Recharge"}
              </p>
            </h4>
          </div>
        </div>
      </nav>
      <img className="logoimg" src={sitedata.logo} alt="" />
    </div>
  );
};

export default HomeHeader;

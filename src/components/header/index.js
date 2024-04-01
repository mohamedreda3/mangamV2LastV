import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { HomeIcon, NotificationIcon, ReceiptIcons } from "./svgIcons";
import { BsChevronLeft } from "react-icons/bs";
import { useState } from "react";
import { useEffect } from "react";
function Header() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );

  const [userBalance, setUserBalance] = useState(false);

  useEffect(() => {
    alert("Balance");
    const axios = require("axios");
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
        // console.log/(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userData]);

  return (
    <nav className="header">
      <BsChevronLeft onClick={() => navigate(-1)} />
      {userData ? (
        <div
          onClick={() => {
            navigate("/profile");
          }}
          className="person_details"
        >
          <img src={userData?.userPicture} alt="" />
          <div className="person_details_text">
            <h5>{userData?.lastName}</h5>
            <h4>Balance $245.00</h4>
            <span className="rb">Recharge Balance</span>
          </div>
        </div>
      ) : (
        <span>Sign In First</span>
      )}
    </nav>
  );
}

export default Header;

import React, { useEffect, useState } from "react";
import CurrentPage from "../CurrentPage/CurrentPage";
import { BsChevronRight } from "react-icons/bs";
import "./profile.css";
import base64 from "base-64";

import PagesHeader from "../../PagesHeader/PagesHeader";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
const Profile = () => {
  const navigate = useNavigate();
  const [socials, setSocials] = useState([]);
  const [sitedata, setsitedata] = useState({});
  const [about, setshowabout] = useState(false);
  const [showterms, setshowterms] = useState(false);
  const [showreturns, setshowreturns] = useState(false);
  const [showprivacy, setshowprivacy] = useState(false);
  const getScoails = () => {
    axios
      .post("https://api.manjam.shop/v2/site/social_media/getAll?type=user", {
        timeout: 8989898989,
      })
      .then((res) => {
        // console.log(res.data.message);
        setSocials(res.data.message);
      })
      .catch((err) => console.log(err));
  };

  const getsitedata = () => {
    axios
      .get("https://api.manjam.shop/v2/site/info/getAll", {
        timeout: 8989898989,
      })
      .then((res) => {
        // console.log(res.data?.message);
        setsitedata(res?.data?.message[0]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getScoails();
    getsitedata();
  }, []);

  useEffect(() => {
    if (about || showterms || showreturns || showprivacy) {
      document.body.style.overflow = "hidden";
      console.log("hello there");
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showterms, about, showreturns, showprivacy]);

  const [userData, setUserData] = useState(
    localStorage.getItem("manjamUser")
      ? JSON.parse(localStorage.getItem("manjamUser"))
      : null
  );

  const [userBalance, setUserBalance] = useState(false);

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
  const language = useSelector((state) => state.language.lang);
  return (
    <div style={{ marginBottom: "80px" }} className="profilepage">
      <PagesHeader title={language == "ar" ? "الشخصيه" : "Profile"} />
      {/* <CurrentPage page={"Profile"}/> */}
      <div className="profile_myinfo">
        <div className="image">
          <img src={userData?.userPicture} alt="" />
        </div>
        <h5>{userData?.username}</h5>

        {userData && userData.coins ? (
          <h4>
            <img src={require("../../assets/lc_coin.png")} alt="" />
            {userData.coins} LC Coins
          </h4>
        ) : null}
        <button
          onClick={() => {
            const sentToken = base64.encode(
              JSON.stringify({
                app_id: "16",
                meta_data: "",
                callback_base_url: "https://manjam.shop",
              })
            );
            window.location.href =
              "likecard://like4card.page.link/ChargeBalance/Charge?data=" +
              sentToken;
          }}
        >
          {language == "ar" ? "إعادة الشحن" : "Recharge"}
        </button>
      </div>
      <div
        className="policy"
        onClick={() => {
          // navigate("/returns")
          setshowabout(true);
        }}
      >
        <h5
          onClick={() => {
            // navigate("/returns")
            setshowabout(true);
          }}
        >
          {language == "ar" ? "من نحن" : "About Us"}
        </h5>
        <BsChevronRight />
      </div>
      <div
        className="policy"
        onClick={() => {
          setshowprivacy(true);
        }}
      >
        <h5>{language == "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</h5>
        <BsChevronRight />
      </div>
      <div
        onClick={() => {
          // navigate("/returns")
          setshowreturns(true);
        }}
        className="policy"
      >
        <h5>{language == "ar" ? "سياسة الارجاع" : "Return Privacy Policy"}</h5>
        <BsChevronRight />
      </div>
      <div
        className="policy"
        onClick={() => {
          setshowterms(true);
        }}
      >
        <h5>{language == "ar" ? "الشروط والأحكام" : "Terms & Condition"}</h5>
        <BsChevronRight />
      </div>

      <h5 className="socials_title">
        <span></span>
        <span>
          {language == "ar"
            ? "تابعنا على مواقع التواصل"
            : "Follow Us Socil Media"}
        </span>
        <span></span>
      </h5>
      <div className="socials_div">
        {socials.map((item, index) => {
          return (
            <a target="_blank" href={item.link} className="social_div">
              <img src={item.image} alt="" />
            </a>
          );
        })}
      </div>
      {showterms ? (
        <div className="terms_big_div">
          <div className="terms_small_div">
            <p>{language == "ar" ? sitedata.terms_ar : sitedata.terms}</p>
            <AiOutlineClose
              onClick={() => {
                setshowterms(false);
              }}
            />
            {/* <span></span> */}
          </div>
        </div>
      ) : null}
      {showreturns ? (
        <div className="terms_big_div">
          <div className="terms_small_div">
            <p>
              {language == "ar"
                ? sitedata.return_policy_ar
                : sitedata.return_policy}
            </p>

            <AiOutlineClose
              onClick={() => {
                setshowreturns(false);
              }}
            />
            {/* <span></span> */}
          </div>
        </div>
      ) : null}
      {showprivacy ? (
        <div className="terms_big_div">
          <div className="terms_small_div">
            <p>{language == "ar" ? sitedata.policy_ar : sitedata.policy}</p>
            <AiOutlineClose
              onClick={() => {
                setshowprivacy(false);
              }}
            />
            {/* <span></span> */}
          </div>
        </div>
      ) : null}
      {about ? (
        <div className="terms_big_div">
          <div className="terms_small_div">
            <p>{language == "ar" ? sitedata.about_ar : sitedata.about}</p>
            <AiOutlineClose
              onClick={() => {
                setshowabout(false);
              }}
            />
            {/* <span></span> */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;

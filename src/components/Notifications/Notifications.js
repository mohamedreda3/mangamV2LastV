import React, { useEffect, useState } from 'react';
import './notification.css';
import Header from '../header';
import HomeHeader from '../Home/HomeHeader/HomeHeader';
import { useSelector } from 'react-redux';
import Pusher from 'pusher-js';
import axios from 'axios';
import { useNavigate } from 'react-router';
import moment from 'moment';
const Notifications = () => {
  const language = useSelector((state) => state.language.lang);
  const notifies = useSelector((state) => state?.notifies?.data);
  // console.log(notifies);
  const navigate = useNavigate();
  return (
    <>
      {/* <HomeHeader /> */}



      <div style={{ marginBottom: '80px' }}>

      <div className="headerhome">
        {/* <Header/> */}
        <HomeHeader />
        {/* <button>Recharge balance</button> */}
      </div>
      <div  className="notificationpage">

        {/* <Header/> */}
        <h5>{language === 'ar' ? "الإشعارات" : "Notifications"}</h5>
        <div className="notifications_content">
          {notifies && notifies.length > 0 ? (
            notifies.map((item, index) => {
              return (
                <div
                  className="notification"
                  key={index}
                  onClick={() => navigate(item?.link)}
                >
                  {language === "ar" ? null : (
                    <img src={require("../../assets/Frame 67.png")} alt="" />
                  )}
                  <div className="info_notifications">
                    <p
                      style={{
                        textAlign: language === "ar" ? "right" : "left",
                        direction: language === "ar" ? "rtl" : "ltr"
                      }}
                    >
                      {language === "ar" ? item?.text_ar : item?.text}
                    </p>
                    {/* <p className="nDate">
                      {language === "ar"
                        ? moment(item?.created_at, "YYYYMMDD")
                            .locale("ar-kw")
                            .fromNow()
                        : moment(item?.created_at, "YYYYMMDD")
                            .locale("en")
                            .fromNow()}
                    </p> */}
                  </div>
                  {language == "ar" ? (
                    <img src={require("../../assets/Frame 67.png")} alt="" />
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="empty_notification">
              <img
                src={require("../../assets/Notification Illustration.png")}
                alt=""
              />
              <h5>
                {language == "ar" ? "لا توجد إشعارات" : "No Notification yet"}
              </h5>
              {/* <button>Explore Categories</button> */}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Notifications;

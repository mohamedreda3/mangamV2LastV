import React, { useEffect, useState } from "react";
import "./pagesheader.css";
import { BsChevronLeft } from "react-icons/bs";
import { useNavigate } from "react-router";
import axios from "axios";
const PagesHeader = ({ title }) => {
  const navigate = useNavigate();
  const [sitedata, setsitedata] = useState({});
  const getsitedata = () => {
    axios
      .get("https://api.manjam.shop/v2/site/info/getAll", {
        timeout: 8989898989,
      })
      .then((res) => {
        // console.log(res.data?.message[0]);
        setsitedata(res?.data?.message[0]);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getsitedata();
  }, []);
  return (
    <div className="pagesheader">
      <h3>
        <BsChevronLeft onClick={() => navigate(-1)} />
        <span>{title}</span>
      </h3>
      <img className="logoimg" src={sitedata?.logo} alt="logo" />
    </div>
  );
};

export default PagesHeader;

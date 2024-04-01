import React, { useEffect, useState } from 'react';
import PagesHeader from '../../PagesHeader/PagesHeader';
import ReturnItem from './ReturnItem/ReturnItem';
import './returns.css';
import axios from 'axios';
import HomeHeader from '../Home/HomeHeader/HomeHeader';
import { useSelector } from 'react-redux';
const Returns = ({ ReturnsItems }) => {
  // const [returnstatus, setreturnstatus] = useState("");
  const language = useSelector((state) => state.language.lang);
  return (
    <>
      <div className="return_page">
        {/* <PagesHeader title={"Returns"}/> */}
        <div className="returns">
          {ReturnsItems && ReturnsItems?.length ? (
            ReturnsItems?.map((item, index) => {
              return <ReturnItem key={index} item={item} />;
            })
          ) : (
            <h4>
              {language != 'ar' ? "No Returns" || '' : "لا يوجد منتجات مسترجعة"}
            </h4>
          )}
        </div>
      </div>
    </>
  );
};

export default Returns;

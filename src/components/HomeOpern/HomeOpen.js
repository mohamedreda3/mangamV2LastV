import React from 'react'
import Slider from '../Home/Slider/Slider'
import HomeCategories from '../Home/HomeCategories/HomeCategories'
import Offers from './Offers/Offers'
import Header from '../header'
import './homeopen.css'
import PagesHeader from '../../PagesHeader/PagesHeader'
import HomeHeader from '../Home/HomeHeader/HomeHeader'
const HomeOpen = () => {
  return (
    <div style={{marginBottom:'80px'}}>
        <HomeHeader/>

      {/* <PagesHeader title={"Headset"}/> */}
        <div className='headerhome' style={{marginBottom:'20px',marginTop:'20px'}}>
        <Header/>

        <button style={{fontSize:'10px'}}>Recharge balance</button>
      </div>
      <Slider/>
      <HomeCategories/>
      <Offers/>
    </div>
  )
}

export default HomeOpen

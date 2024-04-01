import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import './currentpage.css'
import { useNavigate } from 'react-router'
const CurrentPage = ({page}) => {
  const navigate=useNavigate();
  return (
    <div className='currntpage' onClick={()=>{
      navigate(-1)
    }}>
      <BsChevronLeft/>
      <h5>{page||""}</h5>
    </div>
  )
}

export default CurrentPage

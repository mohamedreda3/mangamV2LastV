import React from 'react'
import './newheader.css'
import { BsChevronLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router'
const NewHeader = () => {
  const navigate = useNavigate()
  return (
    <div className='new_header'>
      <div>
        <BsChevronLeft onClick={() => navigate(-1)} />
        <h4>Headest Details</h4>
      </div>
      <img src={require("../../assets/logo.png")} alt="" />
    </div>
  )
}

export default NewHeader

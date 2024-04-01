import React from 'react'
import { AiOutlineStar } from 'react-icons/ai'
import './orderdetails.css'
import Header from '../header'
const OrderDetails2 = () => {
  return (
    <div style={{marginBottom:'80px'}} className='orderdetailspage'>
      {/* <Header/> */}
      <div className="orderdetails_title">
        <h5>Order Details</h5>
        <div className="customer_stars">
            <AiOutlineStar/>
            <AiOutlineStar/>
            <AiOutlineStar/>
            <AiOutlineStar/>
            <AiOutlineStar/>
          </div>
      </div>
      <hr />
      <div className='orderdet'>
      <div>
        <h5>Order Number</h5>
        <p>52376264837283</p>
      </div>
      <div>
        <h5>Order Date & Time</h5>
        <p>2022-10-05   09:22 KSA</p>
      </div>
      <div>
        <h5>Order Status</h5>
        <p>Completed</p>
      </div>
      <div>
        <h5>Quantity</h5>
        <p>20 piece </p>
      </div>
      <div>
        <h5>Total</h5>
        <p>$22.00</p>
      </div>
      <div>
        <h5>Discount</h5>
        <p>$10.00</p>
      </div>
      <div>
        <h5>Final Total</h5>
        <p>$12.00</p>
      </div>
      <div>
        <h5>Payment Method</h5>
        <p>Bank Transfer</p>
      </div>
      <div>
        <h5>Shipping Method</h5>
        <p>Home</p>
      </div>
      </div>
    </div>
  )
}

export default OrderDetails2

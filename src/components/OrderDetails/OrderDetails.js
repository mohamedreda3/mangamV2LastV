import React, { useEffect, useState } from "react";
import "./orderdetails.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, updateOrder } from "../../store/orderReducer";
import { ClipLoader } from "react-spinners";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import BrudCrumbs from "../brudCrumbs/brudCrumbs";
import PagesHeader from "../../PagesHeader/PagesHeader";
const OrderDetails = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrderDetails());
  }, []);
  const orderDetails = useSelector((state) => state.order);

  const [order, setOrder] = useState(null); // Change initial state to null
  useEffect(() => {
    if (Array.isArray(orderDetails.data)) {
      setOrder(orderDetails.data);
    }
  }, [orderDetails]);
  // console.log(order);

  const [productdes,setproductdes]=useState([
    {
      title:"Shipping",
      des:"Parturient Lorem"
    },
    {
      title:"Storage",
      des:"Lorem ipsum dolor"
    },
    {
      title:"Quantity",
      des:"2 Pieces"
    },
    {
      title:"End Date",
      des:"Lorem ipsum dolor sit"
    },
    {
      title:"Color",
      des:"White"
    },
    {
      title:"Grade",
      des:"New"
    },
  ])

  return (
    <div style={{marginBottom:'80px'}} className="shop_categories shop_categories2">
      <div className="shop_categories_content">
        {/* <BrudCrumbs title={"Order Details"} type={"title"} /> */}
        {orderDetails.loading ? (
          <ClipLoader color="#36d7b7" />
        ) : order && order.length ? (
          order.map((item, index) => {
            return (
              <div key={index} className="order-c">
                <div
                  className="orderDetails"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <PagesHeader title={"Order Details"}/>
                  {/* <h3> Order Items</h3> */}
                  <div  style={{textAlign:'center',marginTop:'20px'}}>
                    <img style={{maxWidth:'100%'}} src={require("../../assets/airpods.png")} alt="" />
                  </div>
                  <div className="order-dp">
                    {item.orderItems && item.orderItems.length ? (
                      item.orderItems.map((p_item, index) => {
                      if(index==0){
                        return (
                          <div className="order-d">
                            <div className="p_item">
                              <div className="item_image">
                                <img
                                  src={
                                    "https://s3-alpha-sig.figma.com/img/1450/8404/96e812c5acc8946da38e940851fbc500?Expires=1691366400&Signature=D-FPlA9SI8rboIsty9MrxJ30~LjVs2BXsCftUnEGlALtDG7QfTPow1RtbxPzcmkgs95lYv2al7S56F3va5aTMKU~Btbi~7StEU8dt4IxQZC1W7akweUS4ANAKc3tXLjPlDuB0xZ-O90kuHnHqG9RgFOBdJFWbWPqm3qtUlBAEl~WKosEmvIbm18~whzBUAA9GqDpMwUyZ8pVjMn1SQ9u0SUOm~CM4D3kfCEcv1kAqvWFSrZDb6E7WAGVHWwJWCFElvRPtZIQT8Mj1KrT~qtHrO7uKPWCnWxnJhHFxgZ~n8ZJaHRUlvF~cnifr947dgsvdCa6Y9pUtfRHZbmul9xjKw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
                                  }
                                  alt=""
                                />
                                <div className="item_i_details">

                                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>

                                  <div>
                                  <span className="name">Product Name</span>
                                  <span
                                    className="price"
                                    style={{
                                      color: "#312783",
                                      fontFamily: 900,
                                      fontSize: "22px",
                                      display:'flex',
                                      alignItems:'center',
                                      gap:'10px'
                                    }}
                                  >
                                    <del
                                      style={{
                                        color: "grey",
                                        fontWeight: 600,
                                        fontSize: "16px",
                                      }}
                                    >
                                      ${p_item.single_price}
                                    </del>{" "}
                                    <span style={{color:'#FE8D2A'}}>${p_item.item_count * p_item.single_price}</span>
                                  </span>
                                  </div>
                                  <span className="amount">
                                    {/* <span> Quantitiy </span> */}
                                    <div
                                      id="number"
                                      style={{
                                        display: "flex",
                                        gap: "10px",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span className="sympols_p"   onClick={() =>
                                          dispatch(
                                            updateOrder({
                                              item_id: p_item.item_id,
                                              quantity: 1,
                                              type:"decrease"
                                            })
                                          )
                                        }> - </span>
                                      <span>{p_item.item_count}</span>
                                      <span
                                        className="sympols_p"
                                        onClick={() =>{
                                          dispatch(
                                            updateOrder({
                                              item_id: p_item.item_id,
                                              quantity: 1,
                                              type:"increase"
                                            })
                                          )
                                        }
                                      }
                                      >
                                        {" "}
                                        +{" "}
                                      </span>
                                    </div>
                                  </span>
                                  </div>
                                  <span
                                    className="decription"
                                    style={{
                                      color: "grey",
                                      margin: "12px",
                                      padding: "6px",
                                      fontSize: "12px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip
                                    ex ea commodo consequat.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      })
                    ) : (
                      <p>No Items In Order</p>
                    )}
                  </div>

                  <div className="product_descriptions">
                      <div>
                        <h4>
                          <span></span>
                          <span>Shipping</span>
                        </h4>
                        <p>Parturient Lorem</p>
                      </div>
                      <div>
                        <h4>
                          <span></span>
                          <span>Storage</span>
                        </h4>
                        <p>Lorem ipsum dolor</p>
                      </div>
                  </div>

                  <div className="product_descriptions">
                      <div>
                        <h4>
                          <span></span>
                          <span>Quantity</span>
                        </h4>
                        <p>2 Pieces</p>
                      </div>
                      <div>
                        <h4>
                          <span></span>
                          <span>End Date</span>
                        </h4>
                        <p>Lorem ipsum dolor sit</p>
                      </div>
                  </div>

                  <div className="product_descriptions">
                      <div>
                        <h4>
                          <span></span>
                          <span>Color</span>
                        </h4>
                        <p>White</p>
                      </div>
                      <div>
                        <h4>
                          <span></span>
                          <span>Grade</span>
                        </h4>
                        <p>New</p>
                      </div>
                  </div>




                  <div className="details_order">
                    <div className="spans">
                      <span> Total :</span>{" "}
                      <span style={{backgroundColor:'transparent',textAlign:'end'}} className="span" id={item.status}>
                        {/* {item.status} */}100$
                      </span>
                    </div>
                    <div className="spans">
                      <span> Discount : </span>
                      <span className="span">10${/* {item.amount}$ */}</span>
                    </div>
                    <div className="spans">
                      <span> Final Total: </span>
                      <span className="span">90$</span>
                    </div>
                  </div>
                  <div className="btns_o">
                    <button
                      onClick={() => navigate("/checkout", { state: item })}
                    >
                      Checkout
                    </button>
                    <button>Pay with Apply <img src={require("../../assets/apppay.png")} alt="" /></button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No Orders</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;

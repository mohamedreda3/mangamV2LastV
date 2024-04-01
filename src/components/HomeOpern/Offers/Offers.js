import React, { useEffect, useState } from "react";
import "./offer.css";
import { useNavigate } from "react-router";
import axios from "axios";
const Offers = () => {
  const navigate = useNavigate();
  const [offers, setoffers] = useState(false);
  const getCategories = async () => {
    const cats = await axios.get(
      "http://localhost:9999/v2/product/getAll?type=user"
    );
    setoffers(cats.data);
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
      {offers && offers.length ? (
        <div className="open_offers">
          {/* <div className="offers_title">
          <h3>Hot Offers</h3>
          <h6>See All</h6>
        </div> */}
          <div className="open_ofers_content">
            {offers && offers.length ? (
              offers.map((item, index) => {
                if (
                  item?.time_av?.days < 0 &&
                  item?.time_av?.hours < 0 &&
                  item?.time_av?.minutes < 0 &&
                  item?.time_av?.seconds < 0
                ) {
                  return (
                    <div
                      onClick={() => {
                        navigate("/productdetails", {
                          state: { id: item?.id },
                        });
                      }}
                      className="open_offer"
                    >
                      <img
                        src={
                          item?.images && item?.images.length
                            ? item?.images[0]?.link
                            : null
                        }
                        alt=""
                      />
                      <div className="open_offer_details">
                        <p>{item?.description}</p>
                        <hr />
                        <div>
                          <p>
                            <span>Item Price</span>
                            <del
                              style={{
                                fontSize: "12px",
                                marginTop: "8px",
                                color: "red",
                              }}
                            >
                              {item.price}
                            </del>
                            <span>
                              {Math.floor(
                                item?.price -
                                  item?.price * (item?.discount / 100)
                              )}
                            </span>
                          </p>
                          {/* <button>Sold Out</button> */}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            ) : (
              <h4>No Offers</h4>
            )}
          </div>
        </div>
      ) : null}{" "}
    </>
  );
};

export default Offers;

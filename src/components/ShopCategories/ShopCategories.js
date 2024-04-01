import React, { useEffect, useState } from "react";
import "./shopcategoris.css";
import Header from "../header";
import PagesHeader from "../../PagesHeader/PagesHeader";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import HomeHeader from "../Home/HomeHeader/HomeHeader";
const ShopCategories = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language.lang);
  const [pagloading, setpageloading] = useState(true);
  const [categories, setcategories] = useState();
  const getCategories = async () => {
    const cats = await axios
      .get("http://localhost:9999/v2/category/getAll?type=user", {
        timeout: 8989898989,
      })
      .finally(() => {
        setpageloading(false);
      });
    if (Array.isArray(cats.data.message)) {
      setcategories(cats.data.message);
      // console.log(cats.data.message)
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
      <div style={{ marginBottom: "80px" }}>
        <div className="headerhome">
          {/* <Header/> */}
          <HomeHeader />
          {/* <button>Recharge balance</button> */}
        </div>
        <div className="shop_categories">
          {/* <Header/> */}
          <h5>{language === "ar" ? "الفئات" : "Categories"}</h5>
          {/* <PagesHeader title={language=='ar'?"الفئات":"Categories"} /> */}

          {/* <h5>Shop by Categories</h5> */}
          {pagloading ? (
            <Skeleton count={10} />
          ) : (
            <div>
              {categories && categories?.length ? (
                <div className="shop_categories_content">
                  {categories && categories.length
                    ? categories.map((item, index) => {
                        // console.log(item)
                        return (
                          <div
                            onClick={() => {
                              navigate("/categoryproduct", {
                                state: {
                                  categoryproduct: item.id,
                                  name: item.title,
                                  name_ar: item.title_ar,
                                },
                              });
                            }}
                            style={{ cursor: "pointer" }}
                            className="shop_category"
                            key={index}
                          >
                            <div className="image">
                              <img src={item.image} alt="" />
                            </div>
                            <h6>
                              {language === "ar"
                                ? item.title_ar || item.title
                                : item.title}
                            </h6>
                          </div>
                        );
                      })
                    : null}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70vh",
                  }}
                >
                  <img
                    style={{ maxWidth: "100%" }}
                    src={require("../../assets/nodata.png")}
                    alt=""
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopCategories;

import React, { useEffect, useState } from "react";
import "./homecategories.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
const HomeCategories = () => {
  const language = useSelector((state) => state.language.lang);
  const navigate = useNavigate();
  const [pageloading, setpageloading] = useState(true);
  const [categories, setcategories] = useState();
  const getCategories = async () => {
    const cats = await axios
      .get("http://localhost:9999/v2/category/getAll?type=user", {
        timeout: 8989898989,
      })
      .catch((err) => console.log(err));
    // console.log(cats)
    if (Array.isArray(cats?.data?.message)) setcategories(cats?.data?.message);
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className="home_categories">
      {categories && categories?.length ? (
        <>
          <div className="home_categories_title">
            <h6>
              {language === "ar" ? "التسوق عبر الفئات" : "Shop by Categories"}
            </h6>
            <h5
              onClick={() => {
                navigate("/shopcategories");
              }}
            >
              {language === "ar" ? "مشاهدة الكل" : "See All"}
            </h5>
          </div>
          <div className="home_categories_content">
            {categories && categories.length
              ? categories.map((item, index) => {
                  if (index < 4) {
                    return (
                      <div
                        style={{ cursor: "pointer" }}
                        className="home_category"
                        onClick={() =>
                          navigate("/categoryproduct", {
                            state: {
                              categoryproduct: item.id,
                              name: item.title,
                              name_ar: item.title_ar,
                            },
                          })
                        }
                      >
                        <div className="home_category_img">
                          <img src={item.image} alt="" />
                        </div>
                        <h6>
                          {language == "ar" ? item.title_ar || "" : item.title}
                        </h6>
                      </div>
                    );
                  } else return null;
                })
              : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default HomeCategories;

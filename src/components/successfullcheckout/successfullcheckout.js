import React, { useEffect, useState } from "react";
import "./successPurchase.css";
import HomeHeader from "../Home/HomeHeader/HomeHeader";
import base64 from "base-64";
import axios from "axios";
import { Loader } from "rsuite";
import { useSelector } from "react-redux";
function Successfullcheckout() {
  const [data, getData] = useState(false);
  const [useLoading, setUseLoading] = useState(false);
  useEffect(() => {
    setUseLoading(true);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dataType = urlParams.get("data");
    const type = urlParams.get("type");
    const token = JSON.parse(base64.decode(dataType));

    let data = new FormData();
    data.append(
      "userId",
      JSON.parse(localStorage.getItem("manjamUser"))?.userId
    );
    data.append(
      "userHash",
      JSON.parse(localStorage.getItem("manjamUser"))?.userHash
    );
    data.append("appOrderRef", token?.order_id);
    data.append("appId", "16");
    data.append(
      "apikey",
      "llfPTSlGKSFkS3e61XBH3SZaPOaQoDIhsq1xH9CAEEHG3MOU2D8B57umjk6xgfIA"
    );

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:9999/v2/product/getAll?type=admin",
      headers: {
        apiKey:
          "llfPTSlGKSFkS3e61XBH3SZaPOaQoDIhsq1xH9CAEEHG3MOU2D8B57umjk6xgfIA",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const checkResponse = response?.data?.data?.statusId;
        // const checkResponse = 2;
        getData(checkResponse);
        if (parseInt(checkResponse) == 3 || parseInt(checkResponse) == 4) {
          let data = JSON.stringify({
            id: token?.order_id,
            status: "Payment Failed",
            payementId: 1525267181,
          });

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:9999/v2/order/changeStatus",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
          axios
            .post("http://localhost:9999/v2/order/orderPayUpdating", {
              id: token?.order_id,
              payementId: 1525267181,
            })
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (
          parseInt(checkResponse) == 1 ||
          parseInt(checkResponse) == 2
        ) {
          let data = {
            id: token?.order_id,
            status: "pending",
          };

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:9999/v2/order/changeStatus",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
          axios
            .post("http://localhost:9999/v2/order/orderPayUpdating", {
              id: token?.order_id,
              payementId: 1525267181,
            })
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          let data = {
            id: token?.order_id,
            status: "in_progress",
          };

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:9999/v2/order/changeStatus",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
          axios
            .post("http://localhost:9999/v2/order/orderPayUpdating", {
              id: token?.order_id,
              payementId: 1525267181,
            })
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setUseLoading(false);
      });
  }, []);
  const language = useSelector((state) => state.language.lang);
  return (
    <>
      <HomeHeader />
      {!useLoading ? (
        <div
          style={{ marginBottom: "80px" }}
          className="checkout shop_categories_content"
        >
          <div className="successPurchase_i payement_method_i">
            <p>
              {language == "ar" ? "عملية الدفع" : "Your Purchase has"}{" "}
              {data == 2 || data == 1 ? (
                <>{language == "ar" ? "تمت بنجاح" : "successfully Done"}</>
              ) : data == 4 || data == 3 ? (
                <>{language == "ar" ? "فشلت" : "Failed"}</>
              ) : data == 8 ? (
                <>
                  {language == "ar"
                    ? "ننتظر الرد من بوابة الدفع"
                    : "Waiting For Feadback"}
                </>
              ) : language == "ar" ? (
                "بها خطأ ولم تتم بالشكل المطلوب"
              ) : (
                "Has an error"
              )}{" "}
            </p>
            {data == 2 || data == 1 ? (
              <img
                src="https://res.cloudinary.com/dsqlywnj5/image/upload/v1690291917/animation_lkic4h8v_small_g3g1bm.gif"
                alt=""
              />
            ) : data == 4 || data == 3 ? (
              <img
                src="https://i0.wp.com/nrifuture.com/wp-content/uploads/2022/05/comp_3.gif?fit=800%2C600&ssl=1"
                alt=""
              />
            ) : data == 8 ? (
              <img
                src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/55995f77392207.5c869a30b1c8d.gif"
                alt=""
              />
            ) : (
              <img
                src="https://i0.wp.com/nrifuture.com/wp-content/uploads/2022/05/comp_3.gif?fit=800%2C600&ssl=1"
                alt=""
              />
            )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Successfullcheckout;

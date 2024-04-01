import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import "./brudCrumbs.css"
function BrudCrumbs({ title, type }) {
  return (
    <div className="pageTitle">
      <Link>
        {" "}
        <Icon icon="fa6-solid:angle-left" />
      </Link>
      <h3>{!title ? "Details" : title}</h3>
    </div>
  );
}

export default BrudCrumbs;

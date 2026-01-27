import React from "react";
import { BsBookmarkPlus } from "react-icons/bs";
import "./Addnewbtn.css";
import { Button } from "react-bootstrap";

function Addpropertybtn({ buttonText }) {
  return (
    <>
      <Button variant="primary" className="addProperty-btn">
        <BsBookmarkPlus />
        {buttonText}
      </Button>
    </>
  );
}

export default Addpropertybtn;

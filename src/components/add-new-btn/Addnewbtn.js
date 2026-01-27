import React, { useContext } from "react";
import { BsBookmarkPlus } from "react-icons/bs";
import "./Addnewbtn.css";
import { Modal, Button } from "react-bootstrap";
import { GpState } from "../../context/context";

function Addnewbtn() {
  // const [showModal, setShow] = useState(false);

  // // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const { handleShow } = GpState();

  return (
    <>
      <div style={{ float: "right" }}>
        <Button variant="primary" className="addnew-btn" onClick={handleShow}>
          <BsBookmarkPlus />
          ADD NEW
        </Button>
      </div>
    </>
  );
}

export default Addnewbtn;

import React, { useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Addpropertyform from "../add-property/Addpropertyform";

function AddListingSpace() {
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <Addpropertyform />
    </div>
  );
}

export default AddListingSpace;

import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import BASE_URL from "../../apiConfig";

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const toast = useToast();
  const setVal = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast({
        title: "email is required!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else if (!email.includes("@")) {
      toast({
        title: "includes @ in your email!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      const res = await fetch(`${BASE_URL}/api/admin/sendpasswordlink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status == 201) {
        setEmail("");
        setMessage(true);
      } else {
        toast({
          title: "Error Occured!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  return (
    <>
      <section className="forgot_section">
        <div className="form_data">
          <div className="form_heading">
            <h1>Enter Your Email</h1>
          </div>

          {message ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              Pasword reset link send succsfully in your email
            </p>
          ) : (
            ""
          )}
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={setVal}
                name="email"
                id="email"
                placeholder="Enter Your Email Address"
              />
            </div>

            <button className="btn" onClick={sendLink}>
              Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default PasswordReset;

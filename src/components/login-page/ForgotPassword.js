import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import BASE_URL from "../../apiConfig";

const ForgotPassword = () => {
  const { id, token } = useParams();

  const navigate = useNavigate();
  const toast = useToast();
  const [data2, setData] = useState(false);

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const userValid = async () => {
    const res = await fetch(
      `${BASE_URL}/api/admin/forgot-password/${id}/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.status == 201) {
      // User validated successfully
    } else {
      navigate("/");
    }
  };

  const setval = (e) => {
    setPassword(e.target.value);
  };

  const sendpassword = async (e) => {
    e.preventDefault();

    if (password === "") {
      toast({
        title: "password is required!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else if (password.length < 6) {
      toast({
        title: "password must be 6 char!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      const res = await fetch(`${BASE_URL}/api/admin/${id}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.status == 201) {
        setPassword("");
        setMessage(true);
      } else {
        toast({
          title: "!Token Expired generate new Link",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    userValid();
    setTimeout(() => {
      setData(true);
    }, 3000);
  }, []);

  return (
    <>
      {data2 ? (
        <>
          <section className="forgot_section">
            <div className="form_data">
              <div className="form_heading">
                <h1>Enter Your New Password</h1>
              </div>

              <form>
                {message ? (
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    Password Successfully Update{" "}
                  </p>
                ) : (
                  ""
                )}
                <div className="form_input">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="text"
                    value={password}
                    onChange={setval}
                    name="password"
                    id="password"
                    placeholder="Enter Your new password"
                  />
                </div>

                <button className="btn" onClick={sendpassword}>
                  Send
                </button>
              </form>
              <p>
                <NavLink to="/">Home</NavLink>
              </p>
              {/* <ToastContainer /> */}
            </div>
          </section>
        </>
      ) : (
        <div>
          Loading... &nbsp;
          {/* <CircularProgress /> */}
        </div>
      )}
    </>
  );
};

export default ForgotPassword;

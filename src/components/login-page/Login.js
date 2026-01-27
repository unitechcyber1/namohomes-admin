import React, { useState, useEffect, useContext } from "react";
import loginbg from "./login-bg.jpg";
import "./Login.css";
import logo from "./spacite-logo.png";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate, NavLink } from "react-router-dom";
import { GpState } from "../../context/context";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import BASE_URL from "../../apiConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { userInfo, login, token } = GpState();

  const handleClick = () => {
    setShow(!show);
  };

  const postConfig = {
    headers: {
      "Content-type": "application/json",

      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  };
  const submitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all The Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/admin/login`,
        { email, password },
        postConfig
      );
      toast({
        title: "Login Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      login(data, data.token);
      navigate("/builder-projects", { replace: true });
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mainBox">
        <div className="container my-5">
          <div className="row">
            <div className="col-md-12 m-5 d-flex align-items-center justify-content-center">
              <div>
                <h3 className="login-heading">NAMOHOMES</h3>
                <VStack spacing="-10px">
                  <FormControl id="emaillogin" isRequired>
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type={"text"}
                    />
                  </FormControl>
                  <InputGroup>
                    <FormControl id="passwordlogin" isRequired>
                      <Input
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                      />
                    </FormControl>
                    <InputRightElement top="15px" width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <p className="forgot_password">
                    <NavLink to="/password-reset">Forgot Password?</NavLink>{" "}
                  </p>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitHandle}
                    isLoading={loading}
                  >
                    Login
                  </Button>
                </VStack>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

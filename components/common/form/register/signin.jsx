"use client";
import Register from "../register/Register";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import LoginWithSocial from "./LoginWithSocial";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Header from "@/components/pages-menu/register/Header";
import MobileMenu from "@/components/header/MobileMenu";

const SignIn = () => {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const url = process.env.NEXT_PUBLIC_PRO_BASEURL;
  const port = process.env.NEXT_PUBLIC_PRO_PORT;

  const [key] = useState(CryptoJS.enc.Utf8.parse(secretKey));
  const [iv] = useState(CryptoJS.lib.WordArray.create());
  const [encryptData, setEncryptData] = useState("");
  const [eye, setEye] = useState(true);
  const router = useRouter();

  const [userData, setUserData] = useState({
    customerId: "",
    userName: "",
    password: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const onEyeClick = () => {
    setEye(!eye);
  };

  useEffect(() => {
    if (!localStorage.getItem("reloaded")) {
      localStorage.setItem("reloaded", true);
      window.location.reload();
    }
  }, []);

  const jsonData = {
    UType: parseInt(2),
    CustomerID: userData.customerId,
    UName: userData.userName,
    PWD: userData.password,
  };

  // Encrypt function defined here
  const encryptCBC = (plaintext, key, iv) => {
    return CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    }).toString();
  };

  const encryptAndSetCiphertext = () => {
    const encrypted = encryptCBC(JSON.stringify(jsonData), key, iv);
    setEncryptData(encrypted);
  };

  useEffect(() => {
    encryptAndSetCiphertext();
  }, [jsonData]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyEnc = { RequestBodyEncrypted: encryptData };

      const response = await fetch(`${url}:${port}/api/UserAuthentication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyEnc),
      });

      const result = await response.json();
      if (result.msg === "Valid" && result.status === 1) {
        const userData = JSON.stringify(result.responseBodyEncrypted);
        sessionStorage.setItem("encryptedData", userData);
        router.push("/dashboard");
        toast.success("Welcome To Excellent KYC");
      } else {
        toast.error("Invalid userId or password");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUserData({
        customerId: "",
        userName: "",
        password: "",
      });
    }
  };

  return (
    <>
      <Header />
      {/* <!--End Main Header -->  */}

      <MobileMenu />
      {/* End MobileMenu */}

      <div className="login-section">
        <div
          className="image-layer"
          style={{ backgroundImage: "url(/images/background/12.jpg)" }}
        ></div>
        <div className="outer-box">
          {/* <!-- Login Form --> */}
          <div className="login-form default-form">
            <div className="form-inner">
              <h3>Create a Free Job Portal Account</h3>
              <Tabs>
                <div className="form-group register-dual"></div>

                <form method="post" action="add-parcel.html">
                  <div className="form-group">
                    <label>Customer ID</label>
                    <input
                      required
                      type="text"
                      name="customerId"
                      placeholder="Enter your ID"
                      autoComplete="off"
                      value={userData.customerId}
                      onChange={inputHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>User ID</label>
                    <input
                      type="text"
                      name="userName"
                      placeholder="Enter your user name"
                      autoComplete="off"
                      value={userData.userName}
                      onChange={inputHandler}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>User ID</label>
                    <input
                      type={eye ? "password" : "text"}
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="off"
                      value={userData.password}
                      onChange={inputHandler}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <button
                      className="theme-btn btn-style-one"
                      type="submit"
                      onClick={onSubmit}
                    >
                      Register
                    </button>
                  </div>
                </form>
              </Tabs>

              <div className="bottom-box">
                <div className="text">
                  Dont have an Account?{" "}
                  <Link
                    href="/authentication/signup"
                    className="call-modal login"
                  >
                    SignUp
                  </Link>
                </div>
                <div className="divider">
                  <span>or</span>
                </div>
              </div>
            </div>
          </div>
          {/* <!--End Login Form --> */}
        </div>
      </div>
    </>
  );
};

export default SignIn;

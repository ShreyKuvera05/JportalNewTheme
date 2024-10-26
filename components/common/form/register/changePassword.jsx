"use client"; // Add this line at the top

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import * as FiIcons from "react-icons/fi";
import * as TiIcons from "react-icons/ti";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const url = process.env.NEXT_PUBLIC_PRO_BASEURL;
  const port = process.env.NEXT_PUBLIC_PRO_PORT;
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [confPswdVisibility, setConfPswdVisibility] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [userStatus, setUserStatus] = useState([]);
  const [touchedField, setTouchedField] = useState(false);
  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [changeInput, setChangeInput] = useState({
    password: "",
    confirmPassword: "",
  });

  const { password, confirmPassword } = changeInput;
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;
    return passwordRegex.test(password);
  };

  const router = useRouter();

  // Get user id from query parameters
  //   const uid = router.query.uid;
  let path = window.location.href.split("=");
  let uid = path[path.length - 1];

  const touchedFieldsHandlerSignup = (event) => {
    setTouchedField((touchedField) => ({
      ...touchedField,
      [event.target.name]: true,
    }));
  };

  /** password input element ref */
  const passInputRef = useRef();
  const confPassInputRef = useRef();

  /** Password visibility toggle*/
  const togglePasswordVisibility = () => {
    setVisibility(!visibility);
    visibility
      ? (passInputRef.current.type = "password")
      : (passInputRef.current.type = "text");
  };

  // For confirm password visibility
  const toggleCnfmPsVisibility = () => {
    setConfPswdVisibility(!confPswdVisibility);
    confPswdVisibility
      ? (confPassInputRef.current.type = "password")
      : (confPassInputRef.current.type = "text");
  };

  useEffect(() => {
    if (uid) {
      isValidateUser(uid);
    }
  }, [uid]);

  const isValidateUser = async (uid) => {
    try {
      const response = await fetch(
        `${url}:${port}/api/ValidatePwdChangeRequset?RequestNo=${uid}`
      );
      const result = await response.json();
      setUserStatus(result);
      setUserInfo(result.data);
    } catch (e) {
      console.warn("error" + e);
    }
  };

  const inputHandlerChnage = (event) => {
    const { name, value } = event.target;
    let errorMessage = "";

    if (name === "password" || name === "confirmPassword") {
      if (!validatePassword(value)) {
        errorMessage =
          "Password must contain at least one special character, one uppercase letter, one lowercase letter, one number, and be at least 6 characters long.";
      } else if (name === "confirmPassword" && value !== changeInput.password) {
        errorMessage = "Passwords do not match";
      }
    }

    setChangeInput({ ...changeInput, [name]: value });
    setError(errorMessage);
  };

  const isFormValid = () => {
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = password === confirmPassword;
    return isPasswordValid && doPasswordsMatch;
  };

  const isSubmitPass = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill the password correctly");
      return;
    }

    const jsonData = {
      RequestID: userInfo.requestID,
      RequestNo: userInfo.requestNo,
      ReqType: userInfo.reqType,
      UserID: userInfo.userID,
      CPassword: password,
    };

    try {
      setLoading(true);
      const response = await fetch(`${url}:${port}/api/ChangePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      const result = await response.json();
      alert(result.msg);
      if (result.status === 1) {
        router.push("/signin");
      }
      setLoading(false);
      setChangeInput({
        password: "",
        confirmPassword: "",
      });
    } catch (e) {
      console.warn("error" + e);
      setErrorMsg("An error occurred while changing the password.");
    }
  };

  return (
    <>
      <div className="col-lg-6 col-12  ">
        <div className="outer-box ps-0 pe-0 position-relative">
          {/* ----link expred image---------- */}
          <div>
            <div className="col-12 d-flex justify-content-center">
              <div className="d-flex justify-content-center">
                <img
                  src="/assets/images/es-mini-logo2.png"
                  alt="excellent-logo"
                  className="changepassword-excellent-logo"
                />
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center ps-0 pe-0 pt-3">
              {userStatus.status === -1 ? (
                <div className="col-5 pt-5 ">
                  <div
                    className="expired-box d-flex justify-content-center"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <img
                      src="/assets/images/Link Expired.svg"
                      alt="exired picture"
                      className="expired-pic"
                    />
                  </div>
                </div>
              ) : null}
              {userStatus.status === -2 ? (
                <div className="col-5  ">
                  <div className="expired-box-txt ">
                    <h4 className="text-danger">
                      Data Not Found for this Request No.!
                    </h4>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {/* ---------form------------------- */}
          {userStatus.status === 1 ? (
            <div className="row">
              {loading ? (
                <>
                  <div
                    className="spinner-border text-light"
                    role="status"
                    style={{ marginTop: "30vh" }}
                  ></div>
                </>
              ) : (
                <div className="col-12 d-flex justify-content-center  px-lg-5 px-3">
                  <div className="col-12 ">
                    <div
                      style={{ backgroundColor: "#5c34a0" }}
                      className=" text-center"
                    >
                      {" "}
                      <span className="col-12 text-center text-white form-heading">
                        Generate Password{" "}
                      </span>{" "}
                    </div>

                    <div className="col-12 px-3 pt-3 pb-5 form-box">
                      <form onSubmit={isSubmitPass}>
                        <span className="mb-3 ">
                          <label className="form-label " htmlFor="userId">
                            User Id
                            <span className="ps-1 text-danger">*</span>
                          </label>
                          <span
                            className="form-control "
                            style={{ height: "40px" }}
                          >
                            {userInfo.userName}
                          </span>
                        </span>
                        <div className="mb-3 ">
                          <label
                            className="form-label pt-2 "
                            htmlFor="password"
                          >
                            Password
                            <span className="ps-1 text-danger">*</span>
                            {/* <span className="text-danger ps-1">{error}</span> */}
                            <span className="text-danger ps-1">
                              {error || errorMsg}
                            </span>
                          </label>
                          <br></br>
                          <span>
                            <TiIcons.TiLockClosed
                              style={{
                                color: "gray",
                                height: "40px",
                                width: "30px",
                                position: "absolute",
                                paddingTop: "0px",
                                paddingLeft: "12px",
                              }}
                            />
                          </span>
                          <input
                            type="password"
                            name="password"
                            className="form-control ps-5"
                            placeholder="Enter new password"
                            required
                            value={changeInput.password}
                            autoComplete="off"
                            onChange={inputHandlerChnage}
                            ref={passInputRef}
                            onBlur={touchedFieldsHandlerSignup}
                            data-touched={touchedField.password}
                          />
                          {visibility === true ? (
                            <span
                              onClick={togglePasswordVisibility}
                              className="d-flex justify-content-end "
                            >
                              <i
                                className="eye-icon  pe-4"
                                style={{ marginTop: "-35px" }}
                              >
                                <FiIcons.FiEye />
                              </i>
                            </span>
                          ) : (
                            <span
                              onClick={togglePasswordVisibility}
                              className="d-flex justify-content-end"
                            >
                              <i
                                className="eye-icon  pe-4"
                                style={{ marginTop: "-35px" }}
                              >
                                <FiIcons.FiEyeOff />
                              </i>
                            </span>
                          )}
                        </div>
                        <div className="mb-3 ">
                          <label
                            className="form-label pt-2"
                            htmlFor="confirmPassword"
                          >
                            Confirm Password
                            <span className="ps-1 text-danger">*</span>
                            <span className="text-danger ps-1">{errorMsg}</span>
                          </label>
                          <br></br>
                          <span>
                            <TiIcons.TiLockClosed
                              style={{
                                color: "gray",
                                height: "40px",
                                width: "30px",
                                position: "absolute",
                                paddingTop: "0px",
                                paddingLeft: "12px",
                              }}
                            />
                          </span>
                          <input
                            type="password"
                            name="confirmPassword"
                            className="form-control ps-5"
                            placeholder="Confirm password"
                            required
                            value={changeInput.confirmPassword}
                            autoComplete="off"
                            ref={confPassInputRef}
                            onChange={inputHandlerChnage}
                            onBlur={touchedFieldsHandlerSignup}
                            data-touched={touchedField.confirmPassword}
                          />
                          {confPswdVisibility === true ? (
                            <span
                              onClick={toggleCnfmPsVisibility}
                              className="d-flex justify-content-end"
                            >
                              <i
                                className="eye-icon pe-4"
                                style={{ marginTop: "-35px" }}
                              >
                                <FiIcons.FiEye />
                              </i>
                            </span>
                          ) : (
                            <span
                              onClick={toggleCnfmPsVisibility}
                              className="d-flex justify-content-end"
                            >
                              <i
                                className="eye-icon  pe-4"
                                style={{ marginTop: "-35px" }}
                              >
                                <FiIcons.FiEyeOff />
                              </i>
                            </span>
                          )}
                        </div>
                        <span className="mt-4 mb-4 pt-3 d-flex justify-content-center">
                          <button
                            className="me-4 px-4 p-1 button-save"
                            type="submit"
                          >
                            Save
                          </button>
                          <button
                            className="me-4 px-4 p-1 button-cencel "
                            onClick={() => navigate(-1)}
                          >
                            Cancel
                          </button>
                        </span>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {/* ---for right image--- */}
      <div className="col-lg-6 col-0 d-lg-block d-none position-relative ">
        <span>
          <img
            src="/assets/images/signup-banner.png"
            alt="signup-background"
            style={{
              minHeight: "100%",
              height: "100vh",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </span>
      </div>
    </>
  );
};

export default ChangePassword;

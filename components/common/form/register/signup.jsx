"use client";
import react, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoginWithSocial from "./LoginWithSocial";
import Link from "next/link";
import Select from "react-select";
import Modal from "react-modal";
import { toast } from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import ReactLoader from "@/components/Reusable/ResLoader";
import Header from "@/components/pages-menu/register/Header";
import MobileMenu from "@/components/header/MobileMenu";

const SignUp = () => {
  const url = process.env.NEXT_PUBLIC_PRO_BASEURL;
  const port = process.env.NEXT_PUBLIC_PRO_PORT;
  const [formData, setFormData] = useState({
    contactPerson: "",
    companyName: "",
    email: "",
    countryCode: "",
    mobileNo: "",
    gstNo: "",
    panNo: "",
    city: "",
    state: "",
    country: "",
    address: "",
    customerID: "",
    emailOtp: "",
    whatsappOtp: "",
  });
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([
    { code: "0", name: "N/A" },
  ]);
  const [cityOptions, setCityOption] = useState([{ code: "0", name: "N/A" }]);
  const [selectedCountryData, setSelectedCountryData] = useState({});
  const [selectedStateData, setSelectedStateData] = useState({});
  const [selectedCityData, setSelectedCityData] = useState({});
  const [mobileError, setMobileError] = useState("");
  const [checkAvailabilityClicked, setCheckAvailabilityClicked] =
    useState(false);
  const [customerIdMsg, setCustomerIdMsg] = useState("");
  const [customerIdStatus, setCustomerIdStatus] = useState("");
  const [whatsappOtp, setWhatsappOtp] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isButtonDisabled =
    formData.emailOtp !== whatsappOtp.eMailOTP ||
    formData.whatsappOtp !== whatsappOtp.whatsAppOTP;

  //-----modal style-------------------
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#f8f7f7",
    },
  };
  //---common fun for each input ---
  const validateInput = (name, value) => {
    switch (name) {
      case "mobileNo": {
        const isValidMobile = /^\d{10,}$/.test(value);
        setMobileError(
          isValidMobile ? "" : "Mobile number must be at least 10 digits"
        );
        break;
      }

      default:
        break;
    }
  };

  //------modal  handle fun------
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //-----input handler----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset errors when the user starts typing
    if (name === "mobileNo") {
      setMobileError("");
    }
    // Validate the input
    validateInput(name, value);
    setFormData({ ...formData, [name]: value });
  };

  //-----country handler---------------
  const handleCountryChange = (selectedOption) => {
    setSelectedCountryData(selectedOption);
    setCityOption([]);
    setStateOptions([]);
    setSelectedStateData({});
    setSelectedCityData({});
    selectState(selectedOption.code);
  };

  //--------state handler--------------------
  const handleStateChange = (selectedOption) => {
    setSelectedStateData(selectedOption);
    setCityOption([]);
    setSelectedCityData({});
    selectCity(selectedOption.code);
  };

  //-----city chnage handler-------------------
  const handleCityChange = (selectedOption) => {
    setSelectedCityData(selectedOption);
  };

  // -----api calls---------------------------------------
  //----api cals--for Country--------------------
  useEffect(() => {
    const selectCountry = async () => {
      try {
        const response = await fetch(
          url + ":" + port + "/api/GetMaster?MasterType=1&ParentID=0"
        );
        console.log(
          url + ":" + port + "/api/GetMaster?MasterType=1&ParentID=0"
        );
        const result = await response.json();
        console.log(result, "result of country");
        setCountryOptions(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    selectCountry();
  }, []);

  //----api cal for State---fun------------------------
  const selectState = async (cid) => {
    try {
      console.log(
        url + ":" + port + "/api/GetMaster?MasterType=2&ParentID=" + cid
      );
      const response = await fetch(
        url + ":" + port + "/api/GetMaster?MasterType=2&ParentID=" + cid
      );
      const result = await response.json();
      console.log(result, "result");

      const updatedStateOptions =
        result.data.length > 0 ? result.data : [{ code: "0", name: "N/A" }];

      setStateOptions(updatedStateOptions);
      setCityOption([]);
      // setStateOptions(result.data)
    } catch (error) {
      console.log(error);
    }
  };

  //----------select city-----api call----------------------------
  const selectCity = async (sId) => {
    try {
      console.log(
        url + ":" + port + "/api/GetMaster?MasterType=3&ParentID=" + sId
      );
      const response = await fetch(
        url + ":" + port + "/api/GetMaster?MasterType=3&ParentID=" + sId
      );
      const result = await response.json();
      // console.log( 'result of city data', result)
      const updatedCityOptions =
        result.data.length > 0 ? result.data : [{ code: "0", name: "N/A" }];
      setCityOption(updatedCityOptions);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // This code will run after the state is updated
    setFormData((prevFormData) => ({
      ...prevFormData,
      countryCode: selectedCountryData.ccPrefix || prevFormData.countryCode,
    }));
  }, [selectedCountryData]);

  //---------------------send  otp-------------
  const sendOtp = async () => {
    try {
      setLoading(true);
      console.log(
        url +
          ":" +
          port +
          "/api/SendCustomerRegistrationVerificationOTP?Name=" +
          formData.contactPerson +
          "&MobileNo=" +
          formData.mobileNo +
          "&EMailID=" +
          formData.email
      );
      const response = await fetch(
        url +
          ":" +
          port +
          "/api/SendCustomerRegistrationVerificationOTP?Name=" +
          formData.contactPerson +
          "&MobileNo=" +
          formData.mobileNo +
          "&EMailID=" +
          formData.email
      );
      const result = await response.json();
      console.log(result);
      setWhatsappOtp(result);
      setLoading(false);
      // --modal false
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };
  //----------------------check  availability-----customer id ---------
  const customerIdCheck = async () => {
    try {
      setCheckAvailabilityClicked(true);
      console.log(
        url +
          ":" +
          port +
          "/api/ValidateCustomerID?CustomerID=" +
          formData.customerID
      );
      const response = await fetch(
        url +
          ":" +
          port +
          "/api/ValidateCustomerID?CustomerID=" +
          formData.customerID
      );
      const result = await response.json();
      console.log(result, "result customer id");
      setCustomerIdStatus(result.status);
      if (result.status == 1) {
        setCustomerIdMsg(result.msg);
      } else {
        setCustomerIdMsg(result.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //----------------------------
  const jsonData = {
    Id: parseInt(0),
    Name: formData.companyName,
    CPrefix: formData.countryCode,
    Mobile: formData.mobileNo,
    EmailID: formData.email,
    CPerson: formData.contactPerson,
    Address1: formData.address,
    PhoneNo: "",
    CountryCode: parseInt(selectedCountryData.code),
    CountryName: selectedCountryData.name,
    StateCode: parseInt(selectedStateData.code),
    StateName: selectedStateData.name,
    CityCode: parseInt(selectedCityData.code),
    CityName: selectedCityData.name,
    PINCode: "",
    Image: "",
    GSTIN: formData.gstNo,
    ITPAN: formData.panNo,
    Deactivate: parseInt(0),
    CustomerID: formData.customerID,
  };

  // -----api calls---------------------------------------
  const handleOk = (e) => {
    e.preventDefault();
    //---checking customer id first
    customerIdCheck();
    //--opening modal
    if (customerIdStatus == 1) {
      openModal();
    }
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(jsonData), "jsonData");
    try {
      setLoading(true);
      const response = await fetch(url + ":" + port + "/api/SaveCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      const result = await response.json();
      console.log(result, "final saving");
      if (result.status == 1) {
        setLoading(false);
        toast.success(result.msg);
        setFormData({
          contactPerson: "",
          companyName: "",
          email: "",
          countryCode: "",
          mobileNo: "",
          gstNo: "",
          panNo: "",
          city: "",
          state: "",
          country: "",
          address: "",
          customerID: "",
          emailOtp: "",
          whatsappOtp: "",
        });
        setCustomerIdMsg("");
        setCustomerIdStatus("");
        setWhatsappOtp({});
        setCheckAvailabilityClicked(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
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

                <form
                  method="post"
                  action="add-parcel.html"
                  onSubmit={handleOk}
                >
                  <div className="row g-2">
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="contactPerson" className="form-label">
                        Name<span className="star ps-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactPerson"
                        name="contactPerson"
                        autoComplete="off"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="companyName" className="form-label">
                        Company Name<span className="star ps-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        autoComplete="off"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="email" className="form-label">
                        Email<span className="star ps-1">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        autoComplete="off"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="mobileNo" className="form-label">
                        Mobile No.<span className="star ps-1">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${
                          mobileError ? "is-invalid" : ""
                        }`}
                        id="mobileNo"
                        name="mobileNo"
                        autoComplete="off"
                        minLength={"10"}
                        maxLength={"10"}
                        value={formData.mobileNo}
                        onChange={handleChange}
                        required
                      />
                      {mobileError && (
                        <div className="invalid-feedback">{mobileError}</div>
                      )}
                    </div>
                    <div className="col-lg-12 col-md-12 col-12">
                      <label htmlFor="address" className="form-label">
                        Address<span className="star ps-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        autoComplete="off"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="Country" className="form-label">
                        Country<span className="star ps-1">*</span>
                      </label>
                      <Select
                        label="Country"
                        options={countryOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.code}
                        onChange={handleCountryChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="countryCode" className="form-label">
                        Country Code<span className="star ps-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="countryCode"
                        name="countryCode"
                        autoComplete="off"
                        value={formData.countryCode}
                        defaultValue={selectedCountryData.ccPrefix}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="State" className="form-label">
                        State<span className="star ps-1">*</span>
                      </label>
                      <Select
                        label="State"
                        options={stateOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.code}
                        onChange={handleStateChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="City" className="form-label">
                        City<span className="star ps-1">*</span>
                      </label>
                      <Select
                        label="City"
                        options={cityOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.code}
                        onChange={handleCityChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="category" className="form-label">
                        GST No.
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="gstNo"
                        name="gstNo"
                        autoComplete="off"
                        value={formData.gstNo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="panNo" className="form-label">
                        PAN No.
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="panNo"
                        name="panNo"
                        autoComplete="off"
                        value={formData.panNo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="customerID" className="form-label">
                        Customer ID <span className="star ps-1">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          checkAvailabilityClicked && !formData.customerID
                            ? "is-invalid"
                            : ""
                        }`}
                        id="customerID"
                        name="customerID"
                        autoComplete="off"
                        value={formData.customerID}
                        onChange={handleChange}
                        required={checkAvailabilityClicked}
                      />
                      {checkAvailabilityClicked && !formData.customerID && (
                        <div className="invalid-feedback">
                          Customer ID is required when checking availability.
                        </div>
                      )}
                      {formData.customerID && customerIdMsg && (
                        <div
                          className={
                            customerIdMsg === "Available"
                              ? "text-success d-flex"
                              : "text-warning d-flex"
                          }
                        >
                          {customerIdMsg}
                          <span
                            className={
                              customerIdMsg === "Available"
                                ? "d-block ps-3"
                                : "d-none"
                            }
                          >
                            <FaCheck />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end pt-lg-4 pt-md-4 pt-0">
                      <button
                        className="btn btn-primary mt-2"
                        type="button"
                        onClick={customerIdCheck}
                      >
                        Check Availability
                      </button>
                    </div>

                    <div className="col-12 d-flex justify-content-center pt-3">
                      <button type="submit" className="btn btn-dark">
                        Ok
                      </button>
                    </div>
                    {/* Modal section */}
                    <div className="col-12 position-relative">
                      <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        ariaHideApp={false}
                      >
                        <div
                          className="position-absolute"
                          style={{ marginTop: "12%", marginLeft: "50%" }}
                        >
                          <ReactLoader loading={loading} />
                        </div>
                        <div style={{ height: "120px", width: "320px" }}>
                          <p>
                            <b>
                              Are You Sure! <br /> Do You Want to send OTP!{" "}
                            </b>
                          </p>
                        </div>

                        <div className="col-12 d-flex justify-content-center">
                          <button
                            className="btn btn-success px-4 rounded me-3"
                            type="button"
                            onClick={sendOtp}
                          >
                            Yes
                          </button>
                          <button
                            onClick={closeModal}
                            type="button"
                            className="px-4 btn btn-danger"
                          >
                            Cancel
                          </button>
                        </div>
                      </Modal>
                    </div>
                    {/* OTP validation section */}
                    <div
                      className={
                        whatsappOtp.status === 1 ? "col-12 card p-3" : "d-none"
                      }
                    >
                      <div style={{ marginTop: "5%", marginLeft: "50%" }}>
                        <ReactLoader loading={loading} />
                      </div>
                      <div className="col-12">
                        <div className="col-12 gap-2 d-flex pb-2">
                          <div className="col-5">
                            <label htmlFor="emailOtp">
                              Email OTP<span className="star ps-1">*</span>
                            </label>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              name="emailOtp"
                              className="form-control"
                              autoComplete="off"
                              style={{ height: "30px" }}
                              value={formData.emailOtp}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-12 gap-2 d-flex pb-2">
                          <div className="col-5">
                            <label htmlFor="whatsappOtp">
                              Whatsapp OTP<span className="star ps-1">*</span>
                            </label>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              name="whatsappOtp"
                              className="form-control"
                              style={{ height: "30px" }}
                              autoComplete="off"
                              value={formData.whatsappOtp}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-center">
                        <button
                          className={`px-4 button-save me-4 ${
                            isButtonDisabled ? "disabled btn btn-warning" : ""
                          }`}
                          type="button"
                          onClick={isButtonDisabled ? null : handleSubmitSignup}
                          disabled={isButtonDisabled}
                        >
                          Register
                        </button>
                        <button
                          className="px-4 button-save"
                          type="button"
                          onClick={sendOtp}
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                    {/* {OTP validation ends here} */}
                    <div className="col-12 d-flex justify-content-end">
                      <span className="pe-5">
                        {/* <NavLink href="/signIn">Go to SignIn Page</NavLink> */}
                      </span>
                    </div>
                  </div>
                </form>
              </Tabs>
              {/* End form-group */}

              <div className="bottom-box">
                <div className="text">
                  Already have an account?{" "}
                  <Link
                    href="/authentication/signin"
                    className="call-modal login"
                  >
                    LogIn
                  </Link>
                </div>
                <div className="divider">
                  <span>or</span>
                </div>
                {/* <LoginWithSocial /> */}
              </div>
              {/* End bottom-box LoginWithSocial */}
            </div>
          </div>
          {/* <!--End Login Form --> */}
        </div>
      </div>
      {/* <!-- End Info Section --> */}
    </>
  );
};

export default SignUp;

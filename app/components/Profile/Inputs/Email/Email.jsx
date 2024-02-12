import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FormContainer,
  InputField,
  ValidationMessage,
  VerificationHeader,
  ActionButtonsSendOtp,
} from "../Input";
import OTPInput from "../Otp/Otp";
import styles from "../../Profile.module.css";

const EmailInput = ({ email, setEmail, emailVerified, setEmailVerified }) => {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [emailValidationMessage, setEmailValidationMessage] = useState(
    "Should be a valid email address"
  );
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const intervalRef = useRef(null);

  function isEmailValidFunction(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsEmailTouched(true);
    if (isEmailValidFunction(newEmail)) {
      setIsEmailValid(true);
      setEmailValidationMessage("Email is valid");
    } else {
      setIsEmailValid(false);
      setEmailValidationMessage("Email is invalid");
    }
  };

  const handleSendOTP = async () => {
    if (emailVerified == 1) {
      displayToast("Email already verified", "success");
    } else 
    if (emailCountdown > 0 && isEmailValid) {
      displayToast("Please wait before sending another OTP", "error");
    } else {
      const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify?email=${email}`;
      const headers = {
        auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
      try {
        const response = await axios.get(apiurl, {
          headers,
          withCredentials: true,
        });
        if (response.status === 200) {
          displayToast(`OTP code sent to your email`, "success");
          setIsDisabled(false);
          handleEmailCountdown();
        } else {
          displayToast(`OTP failed to send`, "error");
        }
      } catch (error) {
        displayToast(`OTP failed to send`, "error");
      }
    }
  };

  const handleSubmitOTP = async (otp) => {
    const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify?email=${email}&code=${otp}`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };
    try {
      const response = await axios.post(apiurl, {}, {
        headers,
        withCredentials: true,
      });
      if (response.status === 200) {
        displayToast(`Email has being verified`, "success");
        setEmailCountdown(0);
        setIsDisabled(false);
        setEmailVerified("1");
      } else {
        displayToast(`Wrong OTP code`, "error");
      }
    } catch (error) {
      displayToast(`Wrong OTP code`, "error");
    }
  };

  const handleEmailCountdown = () => {
    setEmailCountdown(60);
    intervalRef.current = setInterval(() => {
      setEmailCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalRef.current);
          setIsDisabled(true);
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  return (
    <FormContainer
      inputSectionChildren={
        <>
          {toastVisible && (
            <div className={`toast toast-end`}>
              {toastType === "success" ? (
                <div className={`${styles.toast} ${styles.toastsuccess}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{toastMessage}</span>
                </div>
              ) : (
                <div className={`${styles.toast} ${styles.toasterror}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{toastMessage}</span>
                </div>
              )}
            </div>
          )}
          <VerificationHeader
            title={"Email"}
            description={
              "Your email address will be used for account verification."
            }
            verification={
              <>
                {emailVerified == 1 ? (
                  <div
                    className={`text-xs py-0.5 px-3 bg-green-200 text-green-800 rounded-full`}
                  >
                    Verified
                  </div>
                ) : (
                  <div
                    className={`text-xs py-0.5 px-3 bg-red-200 text-red-800 rounded-full`}
                  >
                    Not Verified
                  </div>
                )}
              </>
            }
          />
          <InputField
            name={"email"}
            onChange={handleEmailChange}
            placeholder={"Enter a valid email"}
            value={email}
          ></InputField>
          <OTPInput
            onSubmit={(otp) => handleSubmitOTP(otp)}
            countdown={emailCountdown}
            isDisabled={isDisabled}
          />
        </>
      }
      validationAndActionSectionChildren={
        <>
          <ValidationMessage
            message={emailValidationMessage}
            isTouched={isEmailTouched}
            isValid={isEmailValid}
          />
          <ActionButtonsSendOtp handleSendOtp={handleSendOTP} />
        </>
      }
    />
  );
};

export default EmailInput;

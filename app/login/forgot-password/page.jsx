"use client";
import React, { useState, useCallback, useContext } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import styles from "./page.module.css";
import authStyles from "@/app/styles/auth.module.css";
import otpStyles from "@/app/components/Profile/Profile.module.css";
import withAuth from "@/app/hooks/UserChecker";
import useInputValidation from "@/app/hooks/UserInputValidation";
import RegisterInput from "@/app/components/Input/Input";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPassword = () => {
  const router = useRouter();
  const [email, emailValid, validateEmail] = useInputValidation("", (value) =>
    EMAIL_REGEX.test(value)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [countdown, setCountdown] = useState(0);

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  const handleSendOTP = async (e) => {
    console.log(emailValid);
    if (emailValid === "valid") {
      if (countdown > 0) {
        displayToast("Please wait before sending another OTP", "warning");
      } else {
        console.log("handleLogin called");
        e.preventDefault();
        setIsLoading(true);
        const sendOtpUrl = `http://localhost:3001/auth/verify?email=${email}`;
        const headers = {
          auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
        };
        try {
          const sendOtpResponse = await axios.get(sendOtpUrl, {
            headers,
            withCredentials: true,
          });
          console.log(sendOtpResponse.data);
        } catch (error) {
          console.log(error);
          if (error.response && error.response.data) {
            console.error(error.response.data["message"]);
            if (error.response.data["code"].startsWith("ERR")) {
              setError(error.response.data["message"]);
              setShowError(true);
            }
          }
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      displayToast("Please enter a valid email", "warning");
    }
  };

  const handleSubmitOTP = async (type, otp) => {
    displayToast(`${type} changed successfully`, "success");
  };

  const handleCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  const OTPInput = ({ onSubmit, countdown }) => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const otpInputRefs = Array.from({ length: 6 }, () => React.createRef());

    const handleChange = (elementIndex, event) => {
      const newOtp = [...otp];
      newOtp[elementIndex] = event.target.value;

      setOtp(newOtp);

      if (newOtp.join("").length === 6) {
        onSubmit(newOtp.join(""));
      } else if (event.target.value.length === 1) {
        if (elementIndex < 5) {
          otpInputRefs[elementIndex + 1].current.focus();
        }
      }
    };

    const handleKeyUp = (elementIndex, event) => {
      if (event.keyCode === 8 && !otp[elementIndex]) {
        if (elementIndex > 0) {
          otpInputRefs[elementIndex - 1].current.focus();
        }
      }
    };

    return (
      <div className={styles.otpcontainer}>
        <label htmlFor={`otp${0}`} className={styles.otpheader}>
          <h3>Enter otp code</h3>
          <span className="countdown">
            <span style={{ "--value": countdown }}></span>
          </span>
        </label>
        <div className={styles.otpinputs}>
          {otp.map((value, index) => (
            <input
              type="text"
              name={`otp${index}`}
              id={`otp${index}`}
              value={value}
              onChange={(event) => handleChange(index, event)}
              onKeyUp={(event) => handleKeyUp(index, event)}
              maxLength="1"
              key={index}
              ref={otpInputRefs[index]}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {toastVisible && (
        <div className={`toast toast-end`}>
          <div className={`${otpStyles.toast}`}>
            {toastType === "success" ? (
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
            ) : (
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
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <div className={authStyles.title}>Change Password</div>
      <div className={authStyles.subtitle}>
        Enter your email and OTP code received to your email
      </div>
      <div className={`${styles.bodyContainer} ${authStyles.bodyContainer}`}>
        <div className={styles.inputcontainer}>
          <RegisterInput
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            isValid={emailValid}
            onChange={validateEmail}
          />
        </div>
        <div>
          <OTPInput
            onSubmit={(otp) => handleSubmitOTP(otp)}
            countdown={countdown}
          />
        </div>
        {/* {showError && (
          <div
            role="alert"
            className={`${authStyles.alertbox} alert alert-error`}
          >
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
            <span>{error}</span>
          </div>
        )} */}
        <div>
          {isLoading ? (
            <button onClick={handleSendOTP} className={authStyles.button}>
              <span className="loading loading-spinner loading-sm"></span>
              Send OTP
            </button>
          ) : (
            <button onClick={handleSendOTP} className={authStyles.button}>
              Send OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ForgotPassword);

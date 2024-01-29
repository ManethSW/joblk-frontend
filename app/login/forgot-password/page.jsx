"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";
import authStyles from "@/app/styles/auth.module.css";
import useInputValidation from "@/app/hooks/UserInputValidation";
import RegisterInput from "@/app/components/auth/Input/Input";
import OTPInput from "@/app/components/Profile/Inputs/Otp/Otp";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPassword = () => {
  const router = useRouter();
  const [email, emailValid, validateEmail] = useInputValidation("", (value) =>
    EMAIL_REGEX.test(value)
  );
  const [password, passwordValid, validatePassword] = useInputValidation(
    "",
    (value) => value.length >= 8
  );
  const [confPassword, confPasswordValid, validateConfPassword] =
    useInputValidation("", (value) => value === password);

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const intervalRef = useRef(null);
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

  const handleSendOTP = async () => {
    if (emailCountdown > 0 && emailValid) {
      displayToast("Please wait before sending another OTP", "error");
    } else {
      setIsLoading(true);
      const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password?email=${email}`;
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
    setIsLoading(false);
  };

  const handleSubmitOTP = async (otp) => {
    if (
      emailValid == "valid" &&
      passwordValid == "valid" &&
      confPasswordValid == "valid"
    ) {
      setIsLoading(true);
      const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`;
      const headers = {
        auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
      try {
        const response = await axios.post(
          apiurl,
          {
            email: email,
            code: otp,
            password: password,
          },
          {
            headers,
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          displayToast(`Password updated successfully`, "success");
          router.push("/login", "/login", { shallow: false });
        } else {
          displayToast(`Wrong OTP code`, "error");
        }
      } catch (error) {
        displayToast(`Wrong OTP code`, "error");
      }
    } else {
      displayToast(`Enter valid password`, "error");
    }
    setIsLoading(false);
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
    <div>
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
          <RegisterInput
            id="password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            isValid={passwordValid}
            onChange={validatePassword}
          />
          <RegisterInput
            id="confPassword"
            type="password"
            placeholder="Confirm your new password"
            value={confPassword}
            isValid={confPasswordValid}
            onChange={validateConfPassword}
          />
        </div>
        <div>
          <OTPInput
            onSubmit={(otp) => handleSubmitOTP(otp)}
            countdown={emailCountdown}
            isDisabled={isDisabled}
            isResetPassword={true}
          />
        </div>
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

export default ForgotPassword;

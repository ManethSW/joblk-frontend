import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FormContainer,
  InputField,
  ValidationMessage,
  VerificationHeader,
  ActionButtonsSendOtp,
} from "@/app/components/Profile/Inputs/Input";
import OTPInput from "../Inputs/Otp/Otp";
import styles from "../Profile.module.css";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const ChangePassword = () => {
  const [passowrd, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordValidationMessage, setPasswordValidationMessage] = useState(
    "Should enter all fields for the passwords"
  );
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const intervalRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(true);
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

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  function isPasswordValidFunction(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  const handleOldPasswordChange = (event) => {
    const oldPassword = event.target.value;
    setOldPassword(oldPassword);
    setIsPasswordTouched(true);
    validatePassword(oldPassword, newPassword, newPasswordConfirm);
  };

  const handleNewPasswordChange = (event) => {
    const newPassword = event.target.value;
    setNewPassword(newPassword);
    setIsPasswordTouched(true);
    validatePassword(oldPassword, newPassword, newPasswordConfirm);
  };

  const handleNewPasswordConfirmChange = (event) => {
    const newPasswordConfirm = event.target.value;
    setNewPasswordConfirm(newPasswordConfirm);
    setIsPasswordTouched(true);
    validatePassword(oldPassword, newPassword, newPasswordConfirm);
  };

  const validatePassword = (oldPassword, newPassword, newPasswordConfirm) => {
    const isOldPasswordValid = isPasswordValidFunction(oldPassword);
    const isNewPasswordValid = isPasswordValidFunction(newPassword);
    const isNewPasswordConfirmValid =
      isPasswordValidFunction(newPasswordConfirm);

    if (isOldPasswordValid && isNewPasswordValid && isNewPasswordConfirmValid) {
      if (oldPassword === newPassword) {
        setIsPasswordValid(false);
        setPasswordValidationMessage(
          "New password should be different from the old password"
        );
      } else if (newPassword !== newPasswordConfirm) {
        setIsPasswordValid(false);
        setPasswordValidationMessage(
          "New password and confirm password should be the same"
        );
      } else {
        setIsPasswordValid(true);
        setPasswordValidationMessage("Valid Password");
      }
    } else {
      setIsPasswordValid(false);
      setPasswordValidationMessage(
        "Should contain 8 characters or more, Capital letter and numbers"
      );
    }
  };

  const handlePasswordCountdown = () => {
    setCountdown(60);
    intervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    console.log(isPasswordValid);
    console.log(countdown > 0 && isPasswordValid);
    if (countdown > 0 && isPasswordValid) {
      displayToast("Please wait before sending another OTP", "warning");
    } else if (isPasswordValid) {
      displayToast(`OTP code sent to your email`, "success");
      handlePasswordCountdown();
      setIsDisabled(false);
      setOtpSent(true);
    } else {
      displayToast(`Please enter valid password`, "error");
    }
  };

  const handleSubmitOTP = async (otp) => {
    console.log(otp);
    if (otp == "123456" && isPasswordValid) {
      const currentPass = oldPassword;
      const newPass = newPassword;
      const confPass = newPasswordConfirm;
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}/password`;
      const headers = {
        auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
      const data = {
        currentPass,
        newPass,
        confPass,
      };
      console.log(data);
      try {
        await axios.put(url, data, {
          headers,
          withCredentials: true,
        });
        displayToast(`Password changed successfully`, "success");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setCountdown(0);
        setIsDisabled(true);
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
          if (error.response.data["code"].startsWith("ERR")) {
            displayToast(error.response.data["message"], "error");
          }
        }
      }
    } else {
      displayToast(`Wrong OTP code`, "error");
    }
  };

  const OTPInputField = ({ value, onChange, onKeyUp }) => {
    const inputRef = React.useRef();

    useEffect(() => {
      if (value.length === 1) {
        inputRef.current.focus();
      }
    }, [value]);

    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        maxLength="1"
        ref={inputRef}
      />
    );
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
            title={"Change Password"}
            description={
              "You can change your password here. Please enter your current password and then enter your new password twice."
            }
          />
          <InputField
            type="password"
            name="oldpassword"
            value={oldPassword}
            onChange={handleOldPasswordChange}
            placeholder="Current Password"
            isTouched={isPasswordTouched}
            isValid={isPasswordValid}
            validationMessage={passwordValidationMessage}
          />
          <InputField
            type="password"
            name="newpassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="New Password"
            isTouched={isPasswordTouched}
            isValid={isPasswordValid}
            validationMessage={passwordValidationMessage}
          />
          <InputField
            type="password"
            name="confirmpassword"
            value={newPasswordConfirm}
            onChange={handleNewPasswordConfirmChange}
            placeholder="Confirm New Password"
            isTouched={isPasswordTouched}
            isValid={isPasswordValid}
            validationMessage={passwordValidationMessage}
          />
          <OTPInput
            onSubmit={(otp) => handleSubmitOTP(otp)}
            countdown={countdown}
            isDisabled={isDisabled}
          />
        </>
      }
      validationAndActionSectionChildren={
        <>
          <ValidationMessage
            message={passwordValidationMessage}
            isTouched={isPasswordTouched}
            isValid={isPasswordValid}
          />
          <ActionButtonsSendOtp handleSendOtp={handleSendOTP} />
        </>
      }
    />
  );
};

export default ChangePassword;

import React, { useState, useRef, useEffect } from "react";
import {
  FormContainer,
  InputField,
  ValidationMessage,
  VerificationHeader,
  ActionButtonsSendOtp,
} from "../Input";
import OTPInput from "../Otp/Otp";
import displayToast from "../../Toast/Toast"

const EmailInput = ({ email, setEmail, emailVerified, setEmailVerified}) => {
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
    if (emailVerified == "1") {
      displayToast("Email already verified", "success");
    } else if (emailCountdown > 0 && isEmailValid) {
      displayToast("Please wait before sending another OTP", "warning");
    } else {
      displayToast(`OTP code sent to your email`, "success");
      setIsDisabled(false);
      handleEmailCountdown();
    }
  };

  const handleSubmitOTP = async (otp) => {
    if (otp == "123456") {
      displayToast(`Email changed successfully`, "success");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setEmailCountdown(0);
      setIsDisabled(true);
      setEmailVerified("1");
    } else {
      displayToast(`Wrong OTP code`, "error");
    }
  };

  const handleEmailCountdown = () => {
    setEmailCountdown(60);
    intervalRef.current = setInterval(() => {
      setEmailCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  return (
    <FormContainer
      inputSectionChildren={
        <>
          <VerificationHeader
            title={"Email"}
            description={
              "Your email address will be used for account verification."
            }
            verification={
              <>
                <div
                  className={`text-xs py-1 px-3 ${
                    emailVerified === "1"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  } rounded-full`}
                >
                  {emailVerified === "1" ? "Verified" : "Not Verified"}
                </div>
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

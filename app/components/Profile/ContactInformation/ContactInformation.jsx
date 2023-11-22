import React, { useState } from "react";
import styles from "../Profile.module.css";

const ContactInformation = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] =
    useState("Should be a valid phone number");
  const [isPhoneNumberTouched, setIsPhoneNumberTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailValidationMessage, setEmailValidationMessage] = useState(
    "Should be a valid email address"
  );
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [emailCountdown, setEmailCountdown] = useState(0);

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  function isPhoneNumberValidFunction(phoneNumber) {
    const phoneNumberRegex = /^[0-9]{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  }

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
    setIsPhoneNumberTouched(true);
    if (isPhoneNumberValidFunction(newPhoneNumber)) {
      setIsPhoneNumberValid(true);
      setPhoneNumberValidationMessage("Phone number is valid");
    } else {
      setIsPhoneNumberValid(false);
      setPhoneNumberValidationMessage("Phone number is invalid");
    }
  };

  function isEmailValidFunction(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

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

  const handleSendOTP = async (type) => {
    if (type === "phone" && phoneCountdown > 0) {
      displayToast("Please wait before sending another OTP", "warning");
    } else if (type === "email" && emailCountdown > 0) {
      displayToast("Please wait before sending another OTP", "warning");
    } else {
      displayToast(`OTP code sent to your ${type}`, "success");
      if (type === "phone") {
        handlePhoneCountdown();
      } else if (type === "email") {
        handleEmailCountdown();
      }
    }
    // const response = await mockApiCall("/send-otp", { [type]: value });
    // if (response.status === 200) {
    //   displayToast("OTP code sent");
    // } else {
    //   displayToast("Failed to send OTP");
    // }
  };

  const handleSubmitOTP = async (type, otp) => {
    displayToast(`${type} changed successfully`, "success");
    // const response = await mockApiCall("/submit-otp", { otp });
    // if (response.status === 200) {
    //   displayToast(`${type} changed successfully`, "success");
    // } else {
    //   displayToast("Failed to submit OTP. Please retry.", "warning");
    // }
  };

  const handlePhoneCountdown = () => {
    setPhoneCountdown(60);
    const interval = setInterval(() => {
      setPhoneCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  const handleEmailCountdown = () => {
    setEmailCountdown(60);
    const interval = setInterval(() => {
      setEmailCountdown((prevCountdown) => {
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
      // If backspace is pressed and the current input field is empty, focus on the previous input field
      if (event.keyCode === 8 && !otp[elementIndex]) {
        if (elementIndex > 0) {
          otpInputRefs[elementIndex - 1].current.focus();
        }
      }
    };

    return (
      <div className={styles.otpcontainer}>
        <div className={styles.otpheader}>
          <h3>Enter OTP Code</h3>
          <span className="countdown">
            <span style={{ "--value": countdown }}></span>
          </span>
        </div>
        <div className={styles.otpinputs}>
          {otp.map((value, index) => (
            <input
              type="text"
              name={`otp${index}`}
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
    <div className={styles.bodycontent}>
      {toastVisible && (
        <div className={`toast toast-end`}>
          <div className={`${styles.toast}`}>
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
      <div className={styles.content}>
        <div className={styles.bodycontentsection}>
          <div>
            <div className={styles.verification}>
              <h2>Phone Number</h2>
              <p>verified</p>
            </div>
            <p>Your phone number will be used for account verification.</p>
          </div>
          <div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            <div>
              <OTPInput
                onSubmit={(otp) => handleSubmitOTP("phone", otp)}
                countdown={phoneCountdown}
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <p
            className={
              isPhoneNumberTouched
                ? isPhoneNumberValid
                  ? styles.valid
                  : styles.invalid
                : styles.initial
            }
          >
            {phoneNumberValidationMessage}
          </p>
          <div className={styles.buttons}>
            <button
              className={`${styles.otp} ${styles.button}`}
              onClick={() => handleSendOTP("phone")}
              disabled={!isPhoneNumberValid}
            >
              Send OTP
            </button>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.bodycontentsection}>
          <div>
            <div className={styles.verification}>
              <h2>Email</h2>
              <p>verified</p>
            </div>
            <p>Your email address will be used for account verification.</p>
          </div>
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <div>
              <OTPInput
                onSubmit={(otp) => handleSubmitOTP("email", otp)}
                countdown={emailCountdown}
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <p
            className={
              isEmailTouched
                ? isEmailValid
                  ? styles.valid
                  : styles.invalid
                : styles.initial
            }
          >
            {emailValidationMessage}
          </p>
          <div className={styles.buttons}>
            <button
              className={`${styles.otp} ${styles.button}`}
              onClick={() => handleSendOTP("email")}
              disabled={!isEmailValid}
            >
              Send OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
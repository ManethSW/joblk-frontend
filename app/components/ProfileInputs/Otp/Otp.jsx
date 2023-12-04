import React, { useState, useEffect } from "react";
import styles from "../Input.module.css";

const OTPInput = ({ onSubmit, countdown, isDisabled }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpInputRefs = Array.from({ length: 6 }, () => React.createRef());

  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length < 6 && otpString.length > 0) {
      otpInputRefs[otpString.length].current.focus();
    }
  }, [otp]);

  const handleChange = (elementIndex, event) => {
    const newOtp = [...otp];
    newOtp[elementIndex] = event.target.value;

    setOtp(newOtp);

    if (newOtp.join("").length === 6) {
      onSubmit(newOtp.join(""));
      setOtp(Array(6).fill(""));
      otpInputRefs[0].current.focus();
    }
  };

  const handleKeyDown = (elementIndex, event) => {
    if (event.keyCode === 8 && otp[elementIndex] === "" && elementIndex > 0) {
      otpInputRefs[elementIndex - 1].current.focus();
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
            onKeyDown={(event) => handleKeyDown(index, event)}
            maxLength="1"
            key={index}
            ref={otpInputRefs[index]}
            disabled={isDisabled}
          />
        ))}
      </div>
    </div>
  );
};

export default OTPInput;
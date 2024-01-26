import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "../Profile.module.css";
import UserContext from "../../../context/UserContext";
import PhoneNumberInput from "../Inputs/PhoneNumber/PhoneNumber";
import EmailInput from "../Inputs/Email/Email";

const ContactInformation = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState("0");

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setEmailVerified(user.email_verified);
    }
  }, [user]);

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  return (
    <div className={styles.bodycontent}>
      <PhoneNumberInput
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />
      <EmailInput
        email={email}
        setEmail={setEmail}
        emailVerified={emailVerified}
        setEmailVerified={setEmailVerified}
        displayToast={displayToast}
      />
    </div>
  );
};

export default ContactInformation;

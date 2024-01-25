import React, { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  Header,
  InputField,
  ValidationMessage,
  ActionButtonsSave,
} from "../Input";

const PhoneNumberInput = ({ phoneNumber, setPhoneNumber }) => {
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] =
    useState("Should be a valid phone number");
  const [isPhoneNumberTouched, setIsPhoneNumberTouched] = useState(false);

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

  const handlePhoneNumberSave = async (e) => {
    e.preventDefault();
    const username = value;
    if (isUsernameValid) {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}`;
      const headers = {
        auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
      const data = {
        username,
      };
      try {
        await axios.put(url, data, {
          headers,
          withCredentials: true,
        });
        setPhoneNumberValidationMessage("Username updated");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
          if (error.response.data["code"].startsWith("ERR")) {
            setPhoneNumberValidationMessage(error.response.data["message"]);
          }
        }
      }
    } else {
      setPhoneNumberValidationMessage("Username is invalid");
    }
  };

  return (
    <FormContainer
      inputSectionChildren={
        <>
          <Header
            title="Phone Number"
            description="Your phone number will be used for account verification."
          />
          <InputField
            name={"phonenumber"}
            onChange={handlePhoneNumberChange}
            placeholder={"Enter a valid value"}
            value={phoneNumber}
          ></InputField>
        </>
      }
      validationAndActionSectionChildren={
        <>
          <ValidationMessage
            message={phoneNumberValidationMessage}
            isTouched={isPhoneNumberTouched}
            isValid={isPhoneNumberValid}
          />
          <ActionButtonsSave onSave={handlePhoneNumberSave} />
        </>
      }
    />
  );
};

export default PhoneNumberInput;

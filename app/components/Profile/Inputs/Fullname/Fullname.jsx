import React, { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  Header,
  InputField,
  ValidationMessage,
  ActionButtonsSave,
} from "../Input";

const FullnameInput = ({ fullname, setFullname }) => {
  const [isFullnameValid, setIsFullnameValid] = useState(true);
  const [fullnameValidationMessage, setFullnameValidationMessage] = useState(
    "Should contain at least 2 names"
  );
  const [isFullnameTouched, setIsFullnameTouched] = useState(false);

  function validateFullname(fullname) {
    const fullnameRegex = /^[a-zA-Z ]+$/;
    if (
      fullname.trim().split(" ").length >= 2 &&
      fullnameRegex.test(fullname)
    ) {
      return true;
    } else {
      return false;
    }
  }

  const handleFullnameChange = (event) => {
    const newFullname = event.target.value;
    setFullname(newFullname);
    setIsFullnameTouched(true);
    if (validateFullname(newFullname)) {
      setIsFullnameValid(true);
      setFullnameValidationMessage("Fullname is valid");
    } else {
      setIsFullnameValid(false);
      setFullnameValidationMessage(
        "Should contain at least 2 names and only letters"
      );
    }
  };

  const handleFullnameSave = async (e) => {
    e.preventDefault();
    const full_name = fullname;
    console.log(full_name);
    if (isFullnameValid) {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}`;
      const headers = {
        auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
      const data = {
        full_name,
      };
      try {
        await axios.put(url, data, {
          headers,
          withCredentials: true,
        });
        setFullnameValidationMessage("Username updated");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
          if (error.response.data["code"].startsWith("ERR")) {
            setFullnameValidationMessage(error.response.data["message"]);
          }
        }
      }
    } else {
      setFullnameValidationMessage("Username is invalid");
    }
  };

  return (
    <FormContainer
      inputSectionChildren={
        <>
          <Header
            title="Fullname"
            description="Your username will be used to identify you on the platform."
          />
          <InputField
            name={" fullname"}
            onChange={handleFullnameChange}
            placeholder={"Enter a valid  fullname"}
            value={fullname}
          ></InputField>
        </>
      }
      validationAndActionSectionChildren={
        <>
          <ValidationMessage
            message={fullnameValidationMessage}
            isTouched={isFullnameTouched}
            isValid={isFullnameValid}
          />
          <ActionButtonsSave onSave={handleFullnameSave} />
        </>
      }
    />
  );
};

export default FullnameInput;

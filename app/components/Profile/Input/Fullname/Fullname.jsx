import React, { useState } from "react";
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

  function validateUserName( fullname) {
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

  const handleUsernameChange = (event) => {
    const newUsername = event.target. fullname;
    setFullname(newUsername);
    setIsUsernameTouched(true);
    if (validateUserName(newUsername)) {
      setIsUsernameValid(true);
      setUserNameValidationMessage("Username is valid");
    } else {
      setIsUsernameValid(false);
      setUserNameValidationMessage("Username is less than 3 characters");
    }
  };

  const handleUsernameSave = async (e) => {
    e.preventDefault();
    const username =  fullname;
    if (isUsernameValid) {
      const url = "http://localhost:3001/user";
      const headers = {
        auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
      };
      const data = {
        username,
      };
      try {
        await axios.put(url, data, {
          headers,
          withCredentials: true,
        });
        setUserNameValidationMessage("Username updated");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
          if (error.response.data["code"].startsWith("ERR")) {
            setUserNameValidationMessage(error.response.data["message"]);
          }
        }
      }
    } else {
      setUserNameValidationMessage("Username is invalid");
    }
  };

  return (
    <FormContainer
      inputSectionChildren={
        <>
          <Header
            title="Username"
            description="Your username will be used to identify you on the platform."
          />
          <InputField
            name={" fullname"}
            onChange={handleUsernameChange}
            placeholder={"Enter a valid  fullname"}
             fullname={ fullname}
          ></InputField>
        </>
      }
      validationAndActionSectionChildren={
        <>
          <ValidationMessage
            message={usernameValidationMessage}
            isTouched={isUsernameTouched}
            isValid={isUsernameValid}
          />
          <ActionButtonsSave onSave={handleUsernameSave} />
        </>
      }
    />
  );
};

export default FullnameInput;

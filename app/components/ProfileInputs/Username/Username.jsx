import React, { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  Header,
  InputField,
  ValidationMessage,
  ActionButtonsSave,
} from "../Input";

const UserNameInput = ({ value, setValue }) => {
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameValidationMessage, setUserNameValidationMessage] = useState(
    "Should be 3 or more characters long"
  );
  const [isUsernameTouched, setIsUsernameTouched] = useState(false);

  function validateUserName(value) {
    if (value.length >= 3) {
      return true;
    } else {
      return false;
    }
  }

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setValue(newUsername);
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
    const username = value;
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
            name={"value"}
            onChange={handleUsernameChange}
            placeholder={"Enter a valid value"}
            value={value}
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

export default UserNameInput;

import React, { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  Header,
  InputField,
  ValidationMessage,
  ActionButtonsSave,
} from "../Input";

const UsernameInput = ({ value, setValue }) => {
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameValidationMessage, setUsernameValidationMessage] = useState(
    "Should be 3 or more characters long"
  );
  const [isUsernameTouched, setIsUsernameTouched] = useState(false);

  function validateUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,15}$/;
    return re.test(username);
  }

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setValue(newUsername);
    setIsUsernameTouched(true);
    if (validateUsername(newUsername)) {
      setIsUsernameValid(true);
      setUsernameValidationMessage("Username is valid");
    } else {
      setIsUsernameValid(false);
      setUsernameValidationMessage("Username is less than 3 characters");
    }
  };

  const handleUsernameSave = async (e) => {
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
        setUsernameValidationMessage("Username updated");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
          if (error.response.data["code"].startsWith("ERR")) {
            setUsernameValidationMessage(error.response.data["message"]);
          }
        }
      }
    } else {
      setUsernameValidationMessage("Username is invalid");
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

export default UsernameInput;

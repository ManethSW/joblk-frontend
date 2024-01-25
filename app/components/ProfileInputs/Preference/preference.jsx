import React, { useState } from "react";
import axios from "axios";
import styles from "./preference.module.css";
import {
  FormContainer,
  Header,
  ValidationMessage,
  ActionButtonsSave,
} from "../Input";

const PreferenceInput = ({ value, setValue }) => {
  const [userPreferenceValidationMessage, setUserPreferenceValidationMessage] =
    useState("Please select one of the 2 options");

  const handleUserPreferenceChange = (preference) => {
    setValue(preference);
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
            title="User Preference"
            description="Choose your prefered user type you would like to stay active on."
          />
          <div className={styles.buttonContainer}>
            <button
              onClick={() => handleUserPreferenceChange("freelancer")}
              className={value === "freelancer" ? styles.activeButton : ""}
            >
              Freelancer
            </button>
            <button
              onClick={() => handleUserPreferenceChange("client")}
              className={value === "client" ? styles.activeButton : ""}
            >
              Client
            </button>
          </div>
        </>
      }
      validationAndActionSectionChildren={
        <>
          <ValidationMessage message={userPreferenceValidationMessage} />
          <ActionButtonsSave onSave={handleUsernameSave} />
        </>
      }
    />
  );
};

export default PreferenceInput;

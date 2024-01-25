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
  const [hasChangedPreference, setHasChangedPreference] = useState(false);

  const handleUserPreferenceChange = (preference) => {
    if (preference != value) {
      setHasChangedPreference(true);
      setValue(preference);
    }
  };

  const handleUsernameSave = async (e) => {
    e.preventDefault();
    const mode_preference = value;
    console.log(mode_preference);
    if (!hasChangedPreference) {
      setUserPreferenceValidationMessage("Please select a different user preference");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };
    const data = {
      mode_preference,
    };
    try {
      await axios.put(url, data, {
        headers,
        withCredentials: true,
      });
      setUserPreferenceValidationMessage("User preference updated");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(error.response.data["message"]);
        if (error.response.data["code"].startsWith("ERR")) {
          setUserPreferenceValidationMessage(error.response.data["message"]);
        }
      }
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
              onClick={() => handleUserPreferenceChange(1)}
              className={value === 1 ? styles.activeButton : ""}
            >
              Freelancer
            </button>
            <button
              onClick={() => handleUserPreferenceChange(2)}
              className={value === 2 ? styles.activeButton : ""}
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

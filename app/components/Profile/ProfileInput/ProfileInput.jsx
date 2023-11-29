import React, { useState } from "react";
import styles from "./ProfileInput.module.css";
import axios from "axios";

const FormContainer = ({
  inputSectionChildren,
  validationAndActionSectionChildren,
}) => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.inputSection}>{inputSectionChildren}</div>
      <div className={styles.validationAndActionSection}>
        {validationAndActionSectionChildren}
      </div>
    </div>
  );
};

const Header = ({ title, description }) => {
  return (
    <div className={styles.inputSectionHeader}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

const InputField = ({ name, value, placeholder, onChange }) => (
  <input
    type="text"
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

const ValidationMessage = ({ message, isTouched, isValid }) => (
  <p
    className={
      isTouched ? (isValid ? styles.valid : styles.invalid) : styles.initial
    }
  >
    {message}
  </p>
);

const ActionButtonsSave = ({ onSave }) => (
  <div className={styles.buttons}>
    <button className={`${styles.save} ${styles.button}`} onClick={onSave}>
      Save
    </button>
  </div>
);

const ActionButtonsDeleteAndSave = ({ onDelete, onSave }) => (
  <div className={styles.buttons}>
    <button className={`${styles.delete} ${styles.button}`} onClick={onDelete}>
      Delete
    </button>
    <button className={`${styles.save} ${styles.button}`} onClick={onSave}>
      Save
    </button>
  </div>
);

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
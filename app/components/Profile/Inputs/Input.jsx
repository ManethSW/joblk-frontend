import React from "react";
import styles from "./Input.module.css";
import PropTypes from "prop-types";

export const FormContainer = ({
  inputSectionChildren,
  validationAndActionSectionChildren,
  isAvatarInput,
  isSocialInput,
}) => {
  return (
    <div className={styles.formContainer}>
      <div
        className={`${isAvatarInput ? styles.inputAvatarSection : ""} ${
          isSocialInput ? styles.inputSocialSection : ""
        } ${styles.inputSection}`}
      >
        {inputSectionChildren}
      </div>
      <div
        className={` ${
          isSocialInput
            ? styles.validationNone
            : styles.validationAndActionSection
        }`}
      >
        {validationAndActionSectionChildren}
      </div>
    </div>
  );
};

FormContainer.propTypes = {
  inputSectionChildren: PropTypes.node.isRequired,
  validationAndActionSectionChildren: PropTypes.node.isRequired,
};

export const Header = ({ title, description }) => {
  return (
    <div className={styles.inputSectionHeader}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export const SocialHeader = ({ title, description }) => {
  return (
    <div className={styles.inputSectionHeader}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

SocialHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export const VerificationHeader = ({ title, description, verification }) => {
  return (
    <div className={styles.inputSectionHeader}>
      <div className={styles.verification}>
        <h2>{title}</h2>
        {verification}
      </div>
      <p>{description}</p>
    </div>
  );
};

export const InputField = ({ name, value, placeholder, onChange }) => (
  <input
    type="text"
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export const InputSocialLinkField = ({
  link,
  name,
  value,
  placeholder,
  onChange,
}) => (
  <div className={styles.inputSocialLinkField}>
    <label for={name}>
      <i class="fa-solid fa-lock"></i>
      {link}
    </label>
    <input
      id={name}
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

InputSocialLinkField.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export const ValidationMessage = ({ message, isTouched, isValid }) => (
  <p
    className={
      isTouched ? (isValid ? styles.valid : styles.invalid) : styles.initial
    }
  >
    {message}
  </p>
);

ValidationMessage.propTypes = {
  message: PropTypes.string.isRequired,
  isTouched: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export const ActionButtonsSave = ({ onSave }) => (
  <div className={styles.buttons}>
    <button className={`${styles.save} ${styles.button}`} onClick={onSave}>
      Save
    </button>
  </div>
);

ActionButtonsSave.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export const ActionButtonsDeleteAndSave = ({ onDelete, onSave }) => (
  <div className={styles.buttons}>
    <button className={`${styles.delete} ${styles.button}`} onClick={onDelete}>
      Delete
    </button>
    <button className={`${styles.save} ${styles.button}`} onClick={onSave}>
      Save
    </button>
  </div>
);

ActionButtonsDeleteAndSave.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export const ActionButtonsSendOtp = ({ handleSendOtp }) => (
  <div className={styles.buttons}>
    <button
      className={`${styles.otp} ${styles.button}`}
      onClick={handleSendOtp}
    >
      Send OTP
    </button>
  </div>
);

ActionButtonsSendOtp.propTypes = {
  handleSendOtp: PropTypes.func.isRequired,
};

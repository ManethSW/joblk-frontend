import React, { useState } from "react";
import styles from "./Input.module.css";
import axios from "axios";
import PropTypes from "prop-types";

export const FormContainer = ({
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

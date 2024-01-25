"use client";
import React, { useState } from "react";
import styles from "./RegisterSelectUser.module.css";
import authStyles from "../../../../styles/auth.module.css";

const UserCard = ({ title, description, onClick, isSelected }) => {
  return (
    <div
      className={`${styles.usercard} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <h2>{title}</h2>
      <div className={styles.divider}></div>
      <p>{description}</p>
    </div>
  );
};

const RegisterSelectUser = ({ onNext, selectedUser, setSelectedUser }) => {
  const [showError, setShowError] = useState(false);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleNextClick = () => {
    if (selectedUser) {
      onNext();
    } else {
      setShowError(true);
    }
  };

  return (
    <div>
      <div className={authStyles.title}>Register</div>
      <div className={authStyles.subtitle}>Please select user type</div>
      <div
        className={`${authStyles.bodyContainer} ${styles.bodyContainer}`}
      >
        <div className={styles.bodycontent}>
          <UserCard
            title="Freelancer"
            description="As an Freelancer, you can showcase your skills, find projects that match your expertise, and collaborate with clients to deliver exceptional results."
            onClick={() => handleUserSelect(1)}
            isSelected={selectedUser === 1}
          />
          <UserCard
            title="Client"
            description="As an Client, you can explore talented freelancers, delegate tasks efficiently, and manage projects seamlessly to achieve your goals."
            onClick={() => handleUserSelect(2)}
            isSelected={selectedUser === 2}
          />
        </div>
        {showError && (
          <div role="alert" className={`${styles.alertbox} alert alert-error`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Please select a user type before proceeding</span>
          </div>
        )}
        <div onClick={handleNextClick} className={authStyles.button}>
          <button>Next</button>
          <i className="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelectUser;

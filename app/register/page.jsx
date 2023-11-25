"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import LogRegBackground from "../components/LogRegBackground/LogRegBackground";
import RegisterSelectUser from "../components/Register/RegisterSelectUser/RegisterSelectUser";
import RegisterGeneralDetails from "../components/Register/RegisterGeneralDetails/RegisterGeneralDetails";
import withAuth from '../hooks/UserChecker';

const Register = () => {
  const [stage, setStage] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const renderStage = () => {
    switch (stage) {
      case 0:
        return (
          <RegisterSelectUser
            onNext={() => setStage(1)}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        );
      case 1:
        return <RegisterGeneralDetails selectedUser={selectedUser} />;
      default:
        return (
          <RegisterSelectUser
            onNext={() => setStage(1)}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        );
    }
  };

  return (
    <div>
      <LogRegBackground />
      <div className={styles.container}>{renderStage()}</div>
    </div>
  );
};

export default withAuth(Register);

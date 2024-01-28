"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import LogRegBackground from "../components/auth/LogRegBackground/LogRegBackground";
import RegisterSelectUser from "../components/auth/Register/RegisterSelectUser/RegisterSelectUser";
import RegisterGeneralDetails from "../components/auth/Register/RegisterGeneralDetails/RegisterGeneralDetails";
import withAuth from "../hooks/UserChecker";
import UserContext from "../context/UserContext";

const Register = () => {
  const [stage, setStage] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/profile");
    }
  }, [user]);

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

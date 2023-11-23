"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import General from "../components/Profile/General/General";
import ContactInformation from "../components/Profile/ContactInformation/ContactInformation";
import ChangePassword from "../components/Profile/ChangePassword/ChangePassword";
import Portfolio from "../components/Profile/Portfolio/Portfolio";
import UserContext from "../context/UserContext";

const Profile = () => {
  const [navigation, setNavigation] = useState("General");
  const handleMenuClick = (menu) => {
    setNavigation(menu);
  };
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the user is not logged in, redirect to the login page
    if (!user) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    ); // Replace this with your loading spinner or placeholder content
  }

  return (
    <div className={styles.container}>
      {/* access the user data */}
      <p></p>
      <div className={styles.header}>
        <h2>Maneth Weerasinghe / {navigation}</h2>
        <p>Edit and setup your account as prefered</p>
      </div>
      <div className={styles.body}>
        <ul className={styles.menu}>
          <li onClick={() => handleMenuClick("General")}>General</li>
          <li onClick={() => handleMenuClick("Contact Information")}>
            Contact Information
          </li>
          <li onClick={() => handleMenuClick("Portfolio")}>Portfolio</li>
          <li onClick={() => handleMenuClick("Change Password")}>
            Change Password
          </li>
          <li onClick={() => handleMenuClick("Social Profiles")}>
            Social Profiles
          </li>
        </ul>
        <div className={styles.divider}></div>
        <div className={styles.bodycontent}>
          {navigation === "General" && (
            <div>
              <General />
            </div>
          )}
          {navigation === "Contact Information" && <ContactInformation />}
          {navigation === "Portfolio" && (
            <div>
              <Portfolio />
            </div>
          )}
          {navigation === "Change Password" && <ChangePassword />}
          {navigation === "Social Profiles" && (
            <div>Social Profiles Content</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import General from "@/app/components/Profile/General/General";
import ContactInformation from "@/app/components/Profile/ContactInformation/ContactInformation";
import ChangePassword from "@/app/components/Profile/ChangePassword/ChangePassword";
import Portfolio from "@/app/components/Profile/Portfolio/Portfolio";
import UserContext from "@/app/context/UserContext";
import SessionContext from "@/app/context/SessionContext";
import withAuth from "@/app/hooks/UserChecker";
import SocialProfiles from "@/app/components/Profile/SocialProfiles/SocialProfiles";

const Profile = () => {
  const [navigation, setNavigation] = useState("General");
  const handleMenuClick = (menu) => {
    setNavigation(menu);
  };
  const { user } = useContext(UserContext);
  const { session, setSession } = useContext(SessionContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      setIsLoading(false);
    }

    if (!session) {
      setSession({ user_mode: "freelancer" });
    }
  }, [user, router, session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>
            {user ? user.username : "Guest"} / {navigation}
          </h2>
          <p>Edit and setup your account as prefered</p>
        </div>
        <div>
          <Link href="/profile/preview">
            {" "}
            <button className={styles.preview}>
              Preview
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </Link>
        </div>
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
            <div>
              <SocialProfiles />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);

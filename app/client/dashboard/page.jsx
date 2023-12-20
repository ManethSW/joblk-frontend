"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../../context/UserContext";
import SessionContext from "../../context/SessionContext";
import styles from "./page.module.css";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const { session, setSession } = useContext(SessionContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      // If the user is not logged in, redirect to the login page
      if (!user) {
        router.replace("/login");
      } else {
        setIsLoading(false);
      }

      if (!session) {
        setSession({ user_mode: "client" });
      }
  }, [user, session]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="loading loading-spinner loading-lg pb-24"></span>
        </div>
    );
  }
  
  return(
    <div className={styles.container}>
      <h1>Client Dashboard</h1>
      <p>Welcome {user.full_name}</p>
    </div>
  )
}

export default Dashboard;
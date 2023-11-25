"use client";
import React, { useState, useCallback, useContext } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import styles from "./page.module.css";
import authStyles from "../styles/auth.module.css";
import UserContext from "../context/UserContext";
import withAuth from "../hooks/UserChecker";
import useInputValidation from "../hooks/UserInputValidation";
import RegisterInput from "../components/Input/Input";
import GoogleLoginButton from "../components/GoogleLogin/GoogleLogin";
import LoginRegisterBackground from "../components/LogRegBackground/LogRegBackground";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const Login = () => {
  const router = useRouter();
  const [email, emailValid, validateEmail] = useInputValidation("", (value) =>
    EMAIL_REGEX.test(value)
  );
  const [password, passwordValid, validatePassword] = useInputValidation(
    "",
    (value) => PASSWORD_REGEX.test(value)
  );
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleLogin = async (e) => {
    console.log("handleLogin called");
    e.preventDefault();
    if (emailValid === "valid" && passwordValid === "valid") {
      setIsLoading(true);
      const loginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_AUTH_LOGIN}`;
      const headers = {
        auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
      const data = {
        email: email,
        password: password,
      };
      try {
        const loginResponse = await axios.post(loginUrl, data, {
          headers,
          withCredentials: true,
        });
        if (loginResponse.data.code === "SUCCESS") {
          const userUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}`;
          const userResponse = await axios.get(userUrl, {
            headers: headers,
            withCredentials: true,
          });
          setUser(userResponse.data);
          router.replace("/profile");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
          if (error.response.data["code"].startsWith("ERR")) {
            setError(error.response.data["message"]);
            setShowError(true);
          }
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter valid credentials");
      setShowError(true);
    }
  };

  const handleChecked = () => {
    console.log("handleChecked called");
  };

  return (
    <GoogleOAuthProvider clientId="286854776272-tij0a772behg9qnd0v0667bga8rqj0p2.apps.googleusercontent.com">
      <div>
        <LoginRegisterBackground></LoginRegisterBackground>
        <div className={authStyles.title}>Login</div>
        <div className={authStyles.subtitle}>Enter your credentials below</div>
        <div className={`${styles.bodyContainer} ${authStyles.bodyContainer}`}>
          <GoogleLoginButton />
          <div className={authStyles.dividerContainer}>
            <div></div>
            <p>or</p>
            <div></div>
          </div>
          <div className={styles.inputcontainer}>
            <RegisterInput
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              isValid={emailValid}
              onChange={validateEmail}
            />
            <RegisterInput
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              isValid={passwordValid}
              onChange={validatePassword}
            />
          </div>
          {showError && (
            <div
              role="alert"
              className={`${authStyles.alertbox} alert alert-error`}
            >
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
              <span>{error}</span>
            </div>
          )}
          <div className={authStyles.otherActions}>
            <div>
              <p>Do not have an account?</p>
              <p>Sign Up</p>
            </div>
            <p>Forgot Password?</p>
          </div>
          <div onClick={handleLogin}>
            {isLoading ? (
              <button className={authStyles.button}>
                <span className="loading loading-spinner loading-sm"></span>
                Login
              </button>
            ) : (
              <button className={authStyles.button}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default withAuth(Login);

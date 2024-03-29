"use client";
import React, { useState, useEffect, useContext } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import styles from "./page.module.css";
import authStyles from "../styles/auth.module.css";
import UserContext from "../context/UserContext";
import SessionContext from "@/app/context/SessionContext";
import withAuth from "../hooks/UserChecker";
import useInputValidation from "../hooks/UserInputValidation";
import RegisterInput from "../components/auth/Input/Input";
import GoogleLoginButton from "../components/auth/GoogleLogin/GoogleLogin";
import LoginRegisterBackground from "../components/auth/LogRegBackground/LogRegBackground";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const Login = () => {
  const router = useRouter();
  const { session, setSession } = useContext(SessionContext);
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
          const user = userResponse.data;
          if (user.mode_preference == 1) {
            setSession({ user_mode: "freelancer" });
          } else {
            setSession({ user_mode: "client" });
          }
          setUser(userResponse.data);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter valid credentials");
      setShowError(true);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace("/profile");
    }
  }, [user]);

  return (
    <GoogleOAuthProvider clientId="313142226606-s0ckkqp44583t9kicgphf902polhi1p7.apps.googleusercontent.com">
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
          <form
            className={styles.inputcontainer}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleLogin();
              }
            }}
          >
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
          </form>
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
              <p>
                <Link href="/register">Sign Up</Link>
              </p>
            </div>
            <p>
              <Link href="/login/forgot-password">Forgot Password?</Link>
            </p>
          </div>
          <div>
            {isLoading ? (
              <button
                type="button"
                onClick={handleLogin}
                className={authStyles.button}
              >
                <span className="loading loading-spinner loading-sm"></span>
                Login
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className={authStyles.button}
              >
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

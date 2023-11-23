"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./RegisterGeneralDetails.module.css";
import Input from "../../Input/Input";
import useInputValidation from "../../../hooks/UserInputValidation";
import axios from "axios";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import registerStyles from "../Register.module.css";
import alertStyles from "../RegisterSelectUser/RegisterSelectUser.module.css";

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,15}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_REGEX =
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const Register = ({ selectedUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [username, usernameValid, validateUsername] = useInputValidation(
    "",
    (value) => USERNAME_REGEX.test(value)
  );
  const [email, emailValid, validateEmail] = useInputValidation("", (value) =>
    EMAIL_REGEX.test(value)
  );
  const [password, passwordValid, validatePassword] = useInputValidation(
    "",
    (value) => PASSWORD_REGEX.test(value)
  );
  const [confirmPassword, confirmPasswordValid, validateConfirmPassword] =
    useInputValidation("", (value) => value === password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      usernameValid === "valid" &&
      emailValid === "valid" &&
      passwordValid === "valid" &&
      confirmPasswordValid === "valid"
    ) {
      setIsLoading(true);
      const url = "https://job-lk-backend.onrender.com/auth/register";
      const headers = {
        auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
      };
      const data = {
        username,
        email,
        password,
      };

      try {
        const response = await axios.post(url, data, { headers });
        console.log(response.data.code);
        if (response.data.code === "SUCCESS") {
          router.push("/login");
        }
      } catch (error) {
        // console.error(error);
        // setError(error.response.data.message);
        // setShowError(true);
        if (error.response.data.code.startsWith("ERR")) {
          setError(error.response.data.message);
          setShowError(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const GoogleLoginButton = () => {
    const handleGoogleLogin = useGoogleLogin({
      onSuccess: async (response) => {
        const { access_token } = response;

        // Get the user's information from Google's APIs
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const googleUser = await res.json();

        // Send the user's information to your server to create a new user
        const { email, name } = googleUser;
        const newUser = { username: name, email }; // Adjust this according to your server's requirements
        console.log(newUser.email + " " + newUser.username);
        // const response = await axios.post("/api/users", newUser); // Replace '/api/users' with your server's endpoint

        console.log(response.data);
      },
      onFailure: (response) => {
        console.error(response);
        // Handle failed login here
      },
    });

    return (
      <div className={styles.google} onClick={handleGoogleLogin}>
        <div className={styles.googleicon}>
          <Image
            src="/google.svg"
            alt="Logo"
            width={1}
            height={1}
            layout="responsive"
          />
        </div>
        <p>Continue with google</p>
      </div>
    );
  };

  return (
    <GoogleOAuthProvider clientId="286854776272-tij0a772behg9qnd0v0667bga8rqj0p2.apps.googleusercontent.com">
      <div>
        <div className={registerStyles.title}>Register</div>
        <div className={registerStyles.subtitle}>Enter your details below</div>
        <div
          className={`${styles.bodycontainer} ${registerStyles.bodycontainer}`}
        >
          <GoogleLoginButton />
          <div className={styles.dividercontainer}>
            <div></div>
            <p>or</p>
            <div></div>
          </div>
          <form onSubmit={handleRegister}>
            <div className={styles.inputcontainer}>
              <Input
                id="username"
                type="text"
                placeholder="Enter a username"
                value={username}
                isValid={usernameValid}
                onChange={validateUsername}
              />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                isValid={emailValid}
                onChange={validateEmail}
              />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                isValid={passwordValid}
                onChange={validatePassword}
              />
              <Input
                id="verifypassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                isValid={confirmPasswordValid}
                onChange={validateConfirmPassword}
              />
            </div>
            {showError && (
              <div
                role="alert"
                className={`${alertStyles.alertbox} ${styles.alertbox} alert alert-error`}
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
            <div className={styles.register}>
              {isLoading ? (
                <button type="submit" className={registerStyles.button}>
                  <span className="loading loading-spinner loading-sm"></span>
                  Register
                </button>
              ) : (
                <div onClick={handleRegister} className={registerStyles.button}>
                  <button type="submit">Register</button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
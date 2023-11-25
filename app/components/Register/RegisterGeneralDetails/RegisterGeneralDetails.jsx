"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./RegisterGeneralDetails.module.css";
import Input from "../../Input/Input";
import useInputValidation from "../../../hooks/UserInputValidation";
import axios from "axios";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import alertStyles from "../RegisterSelectUser/RegisterSelectUser.module.css";
import authStyles from "../../../styles/auth.module.css";

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
      const url = "http://localhost:3001/auth/register";
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
          router.replace("/login");
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
      <div className={authStyles.google} onClick={handleGoogleLogin}>
        <div className={authStyles.googleicon}>
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
        <div className={authStyles.title}>Register</div>
        <div className={authStyles.subtitle}>Enter your details below</div>
        <div className={`${styles.bodyContainer} ${authStyles.bodyContainer}`}>
          <GoogleLoginButton />
          <div className={authStyles.dividerContainer}>
            <div></div>
            <p>or</p>
            <div></div>
          </div>
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
              <p>Already have an account?</p>
              <p>Sign Up</p>
            </div>
          </div>
          <div onClick={handleRegister}>
            {isLoading ? (
              <button className={authStyles.button}>
                <span className="loading loading-spinner loading-sm"></span>
                Register
              </button>
            ) : (
              <button className={authStyles.button}>Register</button>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;

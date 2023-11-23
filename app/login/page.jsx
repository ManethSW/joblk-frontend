"use client";
import React, { useState, useCallback, useContext } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import styles from "./page.module.css";
import useInputValidation from "../hooks/UserInputValidation";
import RegisterInput from "../components/Input/Input";
import LoginRegisterBackground from "../components/LogRegBackground/LogRegBackground";
import registerStyles from "../components/Register/Register.module.css";
import registerGeneralStyles from "../components/Register/RegisterGeneralDetails/RegisterGeneralDetails.module.css";
import UserContext from "../context/UserContext";

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
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (emailValid === "valid" && passwordValid === "valid") {
      const loginUrl = "https://job-lk-backend.onrender.com/auth/login";
      const headers = {
        auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
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
        const userUrl = `https://job-lk-backend.onrender.com/user?email=${email}`;
        const userResponse = await axios.get(userUrl, {
          headers: headers,
          withCredentials: true,
        });
        setUser(userResponse.data);
        router.push("/profile");
      } catch (error) {
        console.error(error);
        console.error("---------------------");
        console.error(error.message);
        console.error("---------------------");
        console.error(error.code);
        showError(true);
        // // If the error response has a data property, it means the server responded with an error message
        // // Check if the error code starts with 'ERR' and if so, set the error message in the state
        // if (
        //   error.response.data.code &&
        //   error.response.data.code.startsWith("ERR")
        // ) {
        //   setError(error.response.data.message);
        // }
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

        const { email, name } = googleUser;
        const newUser = { username: name, email }; // Adjust this according to your server's requirements
        console.log(newUser.email + " " + newUser.username);

        console.log(response.data);
      },
      onFailure: (response) => {
        console.error(response);
      },
    });

    return (
      <div className={registerGeneralStyles.google} onClick={handleGoogleLogin}>
        <div className={registerGeneralStyles.googleicon}>
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
        <LoginRegisterBackground></LoginRegisterBackground>
        <div className={registerStyles.title}>Login</div>
        <div className={registerStyles.subtitle}>
          Enter your credentials below
        </div>
        <div
          className={`${styles.bodycontainer} ${registerGeneralStyles.bodycontainer} ${registerStyles.bodycontainer}`}
        >
          <GoogleLoginButton />
          <div className={registerGeneralStyles.dividercontainer}>
            <div></div>
            <p>or</p>
            <div></div>
          </div>
          <form onSubmit={handleLogin}>
            <div
              className={`${styles.inputcontainer} ${registerGeneralStyles.inputcontainer}`}
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
            </div>
            {showError && (
              <div
                role="alert"
                className={`${styles.alertbox} alert alert-error`}
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
                <span>Please select a user type before proceeding</span>
              </div>
            )}
            <div>
              {isLoading ? (
                <div>
                  <span className="loading-spinner loading-lg"></span>
                  <button
                    type="submit"
                    className={`${styles.button} ${registerStyles.button}`}
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleLogin}
                  className={`${styles.button} ${registerStyles.button}`}
                >
                  <button type="submit">Login</button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

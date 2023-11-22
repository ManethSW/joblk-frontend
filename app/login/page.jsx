"use client";
import React, { useState, useCallback, useContext } from "react";
import Image from "next/image";
// import styles from "../RegisterForm/RegisterForm.module.css";
import styles from "./page.module.css";
import RegisterInput from "../components/Input/Input";
import useInputValidation from "../hooks/UserInputValidation";
import axios from "axios";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from 'next/navigation';
// import { fetch } from 'node-fetch';

const USERNAME_OR_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9]{3,15}$/;
const PASSWORD_REGEX =
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const Login = () => {
  const router = useRouter();
  const [usernameOrEmail, usernameOrEmailValid, validateUsernameOrEmail] =
    useInputValidation("", (value) => USERNAME_OR_EMAIL_REGEX.test(value));
  const [password, passwordValid, validatePassword] = useInputValidation(
    "",
    (value) => PASSWORD_REGEX.test(value)
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    if (usernameOrEmailValid === "valid" && passwordValid === "valid") {
      const loginUrl =
        "https://9f1b-2402-d000-813c-10e5-bd13-b092-4239-a7c9.ngrok-free.app/auth/login";
      const headers = {
        auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
      };
      const data = {
        email: usernameOrEmail,
        password: password,
      };

      try {
        const loginResponse = await axios.post(loginUrl, data, { headers, withCredential: true });
        console.log(loginResponse);
        // const userUrl = `https://274a-2402-d000-813c-10e5-bd13-b092-4239-a7c9.ngrok-free.app/user?email=${usernameOrEmail}`;
        // const userResponse = await axios.get(userUrl, {
        //   headers: headers,
        //   withCredentials: true
        // });
        // console.log(userResponse.data);
        // setUser({
        //   ...user,
        //   username: userResponse.data.username,
        //   email: userResponse.data.email,
        // });
        // router.push('/profile');
      } catch (error) {
        console.error(error.response);
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
        <h1 className={styles.formtitle}>Log In</h1>
        <div className={styles.registerform}>
          <GoogleLoginButton />
          <div className={styles.dividercontainer}>
            <div></div>
            <p>or</p>
            <div></div>
          </div>
          <form onSubmit={handleLogin}>
            <div className={styles.inputcontainer}>
              <RegisterInput
                id="usernameOrEmail"
                type="text"
                placeholder="Enter your username or email"
                value={usernameOrEmail}
                isValid={usernameOrEmailValid}
                onChange={validateUsernameOrEmail}
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
            <div className={styles.register}>
              <button type="submit" className={styles.actionButton}>
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

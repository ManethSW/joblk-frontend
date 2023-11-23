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
  const testUserData = {
    username: "testuser",
    email: "testuser@example.com",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
        console.log("Login", loginResponse.data);
        const newHeaders = {
          auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
        };
        const userUrl = `https://job-lk-backend.onrender.com/user?email=${email}`;
        const userResponse = await axios.get(userUrl, {
          headers: newHeaders,
          withCredentials: true,
        });
        console.log(userResponse.data);
        setUser(userResponse.data);
        router.push("/profile");
      } catch (error) {
        console.error(error);
      }

      // try {
      //   const loginResponse = await axios.post(loginUrl, data, {
      //     headers,
      //     withCredential: true,
      //   });
      //   console.log(loginResponse);
      //   const userUrl = `https://274a-2402-d000-813c-10e5-bd13-b092-4239-a7c9.ngrok-free.app/user?email=${usernameOrEmail}`;
      //   const userResponse = await axios.get(userUrl, {
      //     headers: headers,
      //     withCredentials: true
      //   });
      //   console.log(userResponse.data);
      //   setUser(userData);
      //   router.push('/profile');
      // } catch (error) {
      //   console.error(error.response);
      // }
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
            {/* <div className={registerGeneralStyles.register}>
              <button type="submit" className={styles.actionButton}>
                Log In
              </button>
            </div> */}
            <div>
              {isLoading ? (
                <button
                  type="submit"
                  className={`${styles.button} ${registerStyles.button}`}
                >
                  <span className="loading loading-spinner loading-md"></span>
                  Register
                </button>
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

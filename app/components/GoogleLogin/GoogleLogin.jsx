import React from 'react';
import Image from 'next/image';
import { useGoogleLogin } from '@react-oauth/google';
import authStyles from '../../styles/auth.module.css';

const GoogleLoginButton = () => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const { access_token } = response;

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
      const newUser = { username: name, email };
      console.log(newUser.email + " " + newUser.username);

      console.log(response.data);
    },
    onFailure: (response) => {
      console.error(response);
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

export default GoogleLoginButton;
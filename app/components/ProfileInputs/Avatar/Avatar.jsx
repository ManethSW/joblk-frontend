import React, { createRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Header, ActionButtonsDeleteAndSave, FormContainer } from "../Input";
import styles from "../Input.module.css";

const AvtarInput = ({ avatar, setAvatar }) => {
  const fileInputRef = createRef();

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  const handleAvatarDeleteClick = () => {
    setAvatar(null);
    fileInputRef.current.value = null;
  };

  const handleAvatarSaveClick = async (e) => {
    const newAvatar = JSON.stringify({ avatar });
    e.preventDefault();
    if (newAvatar != null) {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}`;
      const headers = {
        auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
      const data = {
        newAvatar,
      };
      try {
        await axios.put(url, data, {
          headers,
          withCredentials: true,
        });
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
        }
      }
    }
  };

  return (
    <FormContainer
      isAvatarInput={true}
      inputSectionChildren={
        <>
          <Header
            title="Avatar"
            description="Click on the avatar to upload a custom one from your
            files."
          />
          <div className={styles.avatar} onClick={handleAvatarClick}>
            {avatar && (
              <Image
                src={avatar}
                alt="Avatar"
                width={1}
                height={1}
                layout="responsive"
              />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </>
      }
      validationAndActionSectionChildren={
        <>
          <p>Avatar is strongly recommended</p>
          <ActionButtonsDeleteAndSave
            onSave={handleAvatarSaveClick}
            onDelete={handleAvatarDeleteClick}
          ></ActionButtonsDeleteAndSave>
        </>
      }
    />
  );
};

export default AvtarInput;

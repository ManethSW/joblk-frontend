import React, { createRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Header, ActionButtonsDeleteAndSave, FormContainer } from "../Input";
import styles from "../Input.module.css";

const AvtarInput = ({ avatar, setAvatar }) => {
  const fileInputRef = createRef();
  const [avatarFile, setAvatarFile] = useState(null);

const handleAvatarClick = () => {
  console.log("Avatar clicked");
  fileInputRef.current.click();
};

const handleAvatarChange = (event) => {
  console.log("File input changed");
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
     // Store the file object
    setAvatarFile(file);
  }
  event.target.value = null;
};


const handleAvatarDeleteClick = () => {
  setAvatar(null);
  setAvatarFile(null);
  fileInputRef.current.value = null;
};

const handleAvatarSaveClick = async (e) => {
  e.preventDefault();
  console.log(avatarFile)
  if (avatarFile) { // Check if there's a file object
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}/avatar`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };

    let formData = new FormData();
    formData.append('avatar', avatarFile); // Append the file object to the FormData

    try {
      await axios.post(url, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        },
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
                objectFit="cover"
                objectPosition="center"
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

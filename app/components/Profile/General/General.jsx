import React, { useState, createRef, useEffect, useContext } from "react";
import Image from "next/image";
import styles from "../Profile.module.css";
import UserContext from "../../../context/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserNameInput from "../Input/Username/Username";
import AddressInput from "../Input/Address/Address";

const General = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [city, setCity] = useState("");
  const [provinceOrState, setProvinceOrState] = useState("");
  const [country, setCountry] = useState("");

  const fileInputRef = createRef();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      setIsLoading(false);
      setUsername(user.username);
      setFullname(user.fullname);
      setCity(user.city);
      setProvinceOrState(user.provinceOrState);
      setCountry(user.country);
      setAvatar(user.avatar);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    );
  }

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

  const handleAvatarSaveClick = async () => {
    console.log(JSON.stringify({ avatar }));
  };

  function isFullNameValidFunction(fullname) {
    const fullnameRegex = /^[a-zA-Z ]+$/;
    if (
      fullname.trim().split(" ").length >= 2 &&
      fullnameRegex.test(fullname)
    ) {
      return true;
    } else {
      return false;
    }
  }

  const handleFullnameChange = (event) => {
    const newFullname = event.target.value;
    setFullname(newFullname);
    setIsFullnameTouched(true);
    if (isFullNameValidFunction(newFullname)) {
      setIsFullnameValid(true);
      setFullnameValidationMessage("Fullname is valid");
    } else {
      setIsFullnameValid(false);
      setFullnameValidationMessage(
        "Should contain at least 2 names and only letters"
      );
    }
  };

  const handleFullnameSave = async () => {
    if (isFullnameValid) {
      const url = "http: localhost:3001/user";
      const headers = {
        auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
      };
      const data = {
        fullname,
      };
      try {
        await axios.put(url, data, {
          headers,
          withCredentials: true,
        });
        setFullnameValidationMessage("fullname updated");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
          if (error.response.data["code"].startsWith("ERR")) {
            setFullnameValidationMessage(error.response.data["message"]);
          }
        }
      }
    } else {
      setFullnameValidationMessage("fullname is invalid");
    }
  };

  return (
    <div className={styles.bodycontent}>
      <UserNameInput value={username} setValue={setUsername}></UserNameInput>
      <AddressInput city={city} setCity={setCity} provinceOrState={provinceOrState} setProvinceOrState={setProvinceOrState} country={country} setCountry={setCountry}/>
      {/* <div className={styles.content}>
        <div
          className={` ${styles.avatarsection} ${styles.bodycontentsection}`}
        >
          <div>
            <h2>Avatar</h2>
            <p>
              This is your avatar.
              <br></br> Click on the avatar to upload a custom one from your
              files.
            </p>
          </div>
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
        </div>
        <div className={styles.footer}>
          <p>Avatar is strongly recommended</p>
          <div className={styles.buttons}>
            <button
              className={`${styles.delete} ${styles.button}`}
              onClick={handleAvatarDeleteClick}
            >
              Delete
            </button>
            <button
              className={`${styles.save} ${styles.button}`}
              onClick={handleAvatarSaveClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.bodycontentsection}>
          <div>
            <h2>Full Name</h2>
            <p>
              Your full name will be used to identify you in the application.
            </p>
          </div>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={fullname}
            onChange={handleFullnameChange}
          />
        </div>
        <div className={styles.footer}>
          <p
            className={
              isFullnameTouched
                ? isFullnameValid
                  ? styles.valid
                  : styles.invalid
                : styles.initial
            }
          >
            {fullnameValidationMessage}
          </p>
          <div className={styles.buttons}>
            <button
              className={`${styles.save} ${styles.button}`}
              onClick={handleFullnameSave}
            >
              Save
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default General;

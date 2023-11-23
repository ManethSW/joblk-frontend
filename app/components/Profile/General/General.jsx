import React, { useState, createRef, useEffect, useContext } from "react";
import Image from "next/image";
import styles from "../Profile.module.css";
import UserContext from '../../../context/UserContext';
import { useRouter } from 'next/navigation';

const General = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameValidationMessage, setUserNameValidationMessage] = useState(
    "Should be 3 or more characters long"
  );
  const [isUsernameTouched, setIsUsernameTouched] = useState(false);

  const [fullname, setFullname] = useState("");
  const [isFullnameValid, setIsFullnameValid] = useState(true);
  const [fullnameValidationMessage, setFullnameValidationMessage] = useState(
    "Should contain at least 2 names"
  );
  const [isFullnameTouched, setIsFullnameTouched] = useState(false);

  const [address, setAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [addressValidationMessage, setAddressValidationMessage] = useState(
    "Address is optional but recommended"
  );
  const [isAddressTouched, setIsAddressTouched] = useState(false);

  const [city, setCity] = useState("");
  const [provinceOrState, setProvinceOrState] = useState("");
  const [country, setCountry] = useState("");

  const [avatar, setAvatar] = useState(null);
  const fileInputRef = createRef();

  useEffect(() => {
    // If the user is not logged in, redirect to the login page
    if (!user) {
      router.push("/login");
    } else {
      setIsLoading(false);
      setUsername(user.username);
      setFullname(user.fullname);
      setAddress(user.address);
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
    ); // Replace this with your loading spinner or placeholder content
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
    // if (avatar) {
    //   try {
    //     // Replace with your actual API endpoint
    //     const response = await fetch("/api/save-avatar", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ avatar }),
    //     });

    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }

    //     const data = await response.json();
    //     console.log("Avatar saved:", data);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // }
  };

  function isUserNameValidFunction(username) {
    if (username.length >= 3) {
      return true;
    } else {
      return false;
    }
  }

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setIsUsernameTouched(true);
    if (isUserNameValidFunction(newUsername)) {
      setIsUsernameValid(true);
      setUserNameValidationMessage("Username is valid");
    } else {
      setIsUsernameValid(false);
      setUserNameValidationMessage("Username is less than 3 characters");
    }
  };

  const handleUsernameSave = () => {
    if (isUsernameValid) {
      console.log("Username saved:", username);
    } else {
      console.log("Invalid username");
    }
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

  const handleFullnameSave = () => {
    if (isFullnameValid) {
      // Save the fullname
      console.log("Fullname saved:", fullname);
    } else {
      console.log("Invalid fullname");
    }
  };

  function isAddressValidFunction(addresspart) {
    const addressRegex = /^[a-zA-Z ]+$/;
    return addresspart === "" || addressRegex.test(addresspart);
  }

  const handleCityChange = (event) => {
    const newCity = event.target.value;
    setCity(newCity);
    setIsAddressTouched(true);
    validateAddress(newCity, provinceOrState, country);
  };

  const handleProvinceOrStateChange = (event) => {
    const newProvinceOrState = event.target.value;
    setProvinceOrState(newProvinceOrState);
    setIsAddressTouched(true);
    validateAddress(city, newProvinceOrState, country);
  };

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;
    setCountry(newCountry);
    setIsAddressTouched(true);
    validateAddress(city, provinceOrState, newCountry);
  };

  const validateAddress = (city, provinceOrState, country) => {
    const isCityValid = isAddressValidFunction(city);
    const isProvinceOrStateValid = isAddressValidFunction(provinceOrState);
    const isCountryValid = isAddressValidFunction(country);

    if (isCityValid && isProvinceOrStateValid && isCountryValid) {
      setIsAddressValid(true);
      setAddressValidationMessage("Valid");
    } else {
      setIsAddressValid(false);
      setAddressValidationMessage("Should only contain letters");
    }
  };

  const handleAddressSave = () => {
    if (isAddressValid) {
      console.log("Address saved:", address);
    } else {
      console.log("Invalid address");
    }
  };

  return (
    <div className={styles.bodycontent}>
      <div className={styles.content}>
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
        <div className={`${styles.bodycontentsection}`}>
          <div>
            <h2>Username</h2>
            <p>Your username will be used to identify you on the platform.</p>
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className={styles.footer}>
          <p
            className={
              isUsernameTouched
                ? isUsernameValid
                  ? styles.valid
                  : styles.invalid
                : styles.initial
            }
          >
            {usernameValidationMessage}
          </p>
          <div className={styles.buttons}>
            <button
              className={`${styles.save} ${styles.button}`}
              onClick={handleUsernameSave}
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
      </div>
      <div className={styles.content}>
        <div className={styles.bodycontentsection}>
          <div>
            <h2>Address</h2>
            <p>This will help clients identify where you come from</p>
          </div>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={city}
            onChange={handleCityChange}
          />
          <input
            type="text"
            name="provinceorstate"
            placeholder="Province/State"
            value={provinceOrState}
            onChange={handleProvinceOrStateChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={country}
            onChange={handleCountryChange}
          />
        </div>
        <div className={styles.footer}>
          <p
            className={
              isAddressTouched
                ? isAddressValid
                  ? styles.valid
                  : styles.invalid
                : styles.initial
            }
          >
            {addressValidationMessage}
          </p>
          <div className={styles.buttons}>
            <button
              className={`${styles.save} ${styles.button}`}
              onClick={handleAddressSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;

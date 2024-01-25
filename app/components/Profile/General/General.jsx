import React, { useState, createRef, useEffect, useContext } from "react";
import styles from "../Profile.module.css";
import UserContext from "../../../context/UserContext";
import { useRouter } from "next/navigation";
import UsernameInput from "../../ProfileInputs/Username/Username";
import AddressInput from "../../ProfileInputs/Address/Address";
import FullnameInput from "../../ProfileInputs/Fullname/Fullname";
import AvtarInput from "../../ProfileInputs/Avatar/Avatar";
import PreferenceInput from "../../ProfileInputs/Preference/preference";

const General = () => {
  //variables used for when loading the page
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  //variables for the input fields
  const [userPreference, setUserPreference] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [city, setCity] = useState("");
  const [provinceOrState, setProvinceOrState] = useState("");
  const [country, setCountry] = useState("");

  //Ensure to store the data fetched from the API into the frontend
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      setIsLoading(false);
      setUserPreference(user.userPreference);
      setUsername(user.username);
      setFullname(user.full_name);
      setCity(user.city);
      setProvinceOrState(user.province);
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

  return (
    <div className={styles.bodycontent}>
      <PreferenceInput value={userPreference} setValue={setUserPreference}></PreferenceInput>
      <AvtarInput avatar={avatar} setAvatar={setAvatar}></AvtarInput>
      <UsernameInput value={username} setValue={setUsername} />
      <FullnameInput fullname={fullname} setFullname={setFullname} />
      <AddressInput
        city={city}
        setCity={setCity}
        provinceOrState={provinceOrState}
        setProvinceOrState={setProvinceOrState}
        country={country}
        setCountry={setCountry}
      />
    </div>
  );
};

export default General;

import React, { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  Header,
  InputField,
  ValidationMessage,
  ActionButtonsSave,
} from "../Input";

const AddressInput = ({
  city,
  setCity,
  provinceOrState,
  setProvinceOrState,
  country,
  setCountry,
}) => {
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [addressValidationMessage, setAddressValidationMessage] = useState(
    "Address is optional but recommended"
  );
  const [isAddressTouched, setIsAddressTouched] = useState(false);
  const [isCityChanged, setIsCityChanged] = useState(false);
  const [isProvinceOrStateChanged, setIsProvinceOrStateChanged] =
    useState(false);
  const [isCountryChanged, setIsCountryChanged] = useState(false);

  function isAddressValidFunction(addresspart) {
    const addressRegex = /^[a-zA-Z ]+$/;
    return addresspart === "" || addressRegex.test(addresspart);
  }

  const handleCityChange = (event) => {
    const newCity = event.target.value;
    setCity(newCity);
    setIsCityChanged(true);
    setIsAddressTouched(true);
    validateAddress(newCity, provinceOrState, country);
  };

  const handleProvinceOrStateChange = (event) => {
    const newProvinceOrState = event.target.value;
    setProvinceOrState(newProvinceOrState);
    setIsProvinceOrStateChanged(true);
    setIsAddressTouched(true);
    validateAddress(city, newProvinceOrState, country);
  };

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;
    setCountry(newCountry);
    setIsCountryChanged(true);
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

  const handleAddressSave = async (e) => {
    e.preventDefault();
    let data = {};

    if (isCityChanged) {
      data.city = city;
    }
    if (isProvinceOrStateChanged) {
      data.province = provinceOrState;
    }
    if (isCountryChanged) {
      data.country = country;
    }

    if (Object.keys(data).length > 0) {
      const url = "http://localhost:3001/user";
      const headers = {
        auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
      };

      try {
        await axios.put(url, data, {
          headers,
          withCredentials: true,
        });
        setIsCityChanged(false);
        setIsProvinceOrStateChanged(false);
        setIsCountryChanged(false);
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data["message"]);
        }
      }
    }
  };

  return (
    <FormContainer
      inputSectionChildren={
        <>
          <Header
            title="Address"
            description="This will help clients identify where you come from."
          />
          <InputField
            name={"city"}
            onChange={handleCityChange}
            placeholder={"Enter your city"}
            value={city}
          ></InputField>
          <InputField
            name={"value"}
            onChange={handleProvinceOrStateChange}
            placeholder={"Enter your province or state"}
            value={provinceOrState}
          ></InputField>
          <InputField
            name={"value"}
            onChange={handleCountryChange}
            placeholder={"Enter your country"}
            value={country}
          ></InputField>
        </>
      }
      validationAndActionSectionChildren={
        <>
          <ValidationMessage
            message={addressValidationMessage}
            isTouched={isAddressTouched}
            isValid={isAddressValid}
          />
          <ActionButtonsSave onSave={handleAddressSave} />
        </>
      }
    />
  );
};

export default AddressInput;

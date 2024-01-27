import React, { useState } from "react";
import {
  FormContainer,
  Header,
  InputSocialLinkField,
} from "../Input";

const SocialLink = ({ value, setValue, title, icon, description, link, placeholder}) => {

  const handleUsernameChange = (event) => {
    const newLinkedIn = event.target.value;
    setValue(newLinkedIn);
  };

  return (
    <FormContainer
      isSocialInput={true}
      inputSectionChildren={
        <>
          <Header
            title={
              <>
                <i className={icon}></i>{title}
              </>
            }
            description={description}
          />
          <InputSocialLinkField
            link={link}
            name={title}
            onChange={handleUsernameChange}
            placeholder={placeholder}
            value={value}
          />
        </>
      }
    />
  );
};

export default SocialLink;

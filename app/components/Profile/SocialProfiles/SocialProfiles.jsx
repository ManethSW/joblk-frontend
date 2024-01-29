import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "../Profile.module.css";
import UserContext from "../../../context/UserContext";
import SocialLink from "../Inputs/SocialLink/SocialLink";

const SocialProfiles = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [instagram, setInstagram] = useState("");

  const linkedInLink = "https://www.linkedin.com/in/";
  const facebookLink = "https://www.facebook.com/";
  const twitterLink = "https://www.twitter.com/";
  const githubLink = "https://www.github.com/";
  const instagramLink = "https://www.instagram.com/";

  const fetchSocials = async () => {
    const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/socials`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };

    try {
      const response = await axios.get(apiurl, {
        headers,
        withCredentials: true,
      });
      if (response.status === 200) {
        setLinkedin(
          response.data.linkedin
            ? response.data.linkedin.replace(linkedInLink, "")
            : null
        );
        setFacebook(
          response.data.facebook
            ? response.data.facebook.replace(facebookLink, "")
            : null
        );
        setTwitter(
          response.data.x ? response.data.x.replace(twitterLink, "") : null
        );
        setGithub(
          response.data.github
            ? response.data.github.replace(githubLink, "")
            : null
        );
        setInstagram(
          response.data.instagram
            ? response.data.instagram.replace(instagramLink, "")
            : null
        );
      } else {
        console.error("Failed to fetch socials", response);
      }
    } catch (error) {
      console.error("Failed to fetch socials", error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      setIsLoading(false);
      fetchSocials();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    );
  }

  const saveSocials = async (e) => {
    e.preventDefault();
    const data = {};
    data.instagram = `${instagramLink}${instagram}`;
    data.linkedIn = `${linkedInLink}${linkedin}`;
    data.github = `${githubLink}${github}`;
    data.facebook = `${facebookLink}${facebook}`;
    data.x = `${twitterLink}${twitter}`;

    const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/socials`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };
    try {
      const response = await axios.put(apiurl, data, {
        headers,
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Successfully updated socials");
        getProjects();
      } else {
        console.error("Failed to updated socials", response);
      }
    } catch (error) {
      console.error("Failed to updated socials", error);
    }
  };

  return (
    <div className={styles.bodycontent}>
      <div className={styles.socialsHeader}>
        <div>
          <h2>Manage your socials here</h2>
          <h3>These will be public for others when previewing your profile</h3>
        </div>
        <div className={styles.saveSocials} onClick={saveSocials}>
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <h3>Save All</h3>
        </div>
      </div>
      <SocialLink
        value={linkedin}
        setValue={setLinkedin}
        title={"LinkedIn"}
        icon={`fa-brands fa-linkedin`}
        description={"Enter your linkedIn username"}
        link={linkedInLink}
        placeholder={"LinkedIn username"}
      />
      <SocialLink
        value={facebook}
        setValue={setFacebook}
        title={"Facebook"}
        icon={`fa-brands fa-facebook`}
        description={"Enter your facebook username"}
        link={facebookLink}
        placeholder={"facebook username"}
      />
      <SocialLink
        value={twitter}
        setValue={setTwitter}
        title={"Twitter"}
        icon={`fa-brands fa-x-twitter`}
        description={"Enter your twitter username"}
        link={twitterLink}
        placeholder={"twitter username"}
      />
      <SocialLink
        value={github}
        setValue={setGithub}
        title={"Github"}
        icon={`fa-brands fa-github`}
        description={"Enter your github username"}
        link={githubLink}
        placeholder={"github username"}
      />
      <SocialLink
        value={instagram}
        setValue={setInstagram}
        title={"Instagram"}
        icon={`fa-brands fa-instagram`}
        description={"Enter your instagram username"}
        link={instagramLink}
        placeholder={"instagram username"}
      />
    </div>
  );
};

export default SocialProfiles;

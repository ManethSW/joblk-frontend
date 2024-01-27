import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      setLinkedin(user.linkedin);
      setFacebook(user.facebook);
      setTwitter(user.x);
      setGithub(user.github);
      setInstagram(user.instagram);
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    );
  }

  const saveSocials = (e) => {
    e.preventDefault();
    const data = {
      linkedin,
    };
    console.log(data);
  };

  return (
    <div className={styles.bodycontent}>
      <div className={styles.saveSocials} onClick={saveSocials}>
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <h3>Save All</h3>
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

"use client";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import withAuth from "@/app/hooks/UserChecker";
import UserContext from "@/app/context/UserContext";
import styles from "./page.module.css";

const Preview = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const chatTitle = "Start a new chat 👋";

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
      setIsLoading(false);
    }

    getProjects();
    getSocials();
  }, [user, router]);

  const getProjects = async () => {
    const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };

    try {
      const response = await axios.get(apiurl, {
        headers,
        withCredentials: true,
      });
      if (response.status === 200) {
        setProjects(response.data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch projects", response);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const getSocials = async () => {
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
        if (response.data.linkedin !== linkedInLink)
          setLinkedin(response.data.linkedin);
        if (response.data.facebook !== facebookLink)
          setFacebook(response.data.facebook);
        if (response.data.x !== twitterLink) setTwitter(response.data.x);
        if (response.data.github !== githubLink)
          setGithub(response.data.github);
        if (response.data.instagram !== instagramLink)
          setInstagram(response.data.instagram);
      } else {
        console.error("Failed to fetch socials", response);
      }
    } catch (error) {
      console.error("Failed to fetch socials", error);
    }
  };

  const renderProject = (project) => {
    if (project) {
      return (
        <div className={styles.project}>
          <div className={styles.thumbnail}>
            {project && project.image1 ? (
              <Image
                src={project.image1}
                alt={`Preview`}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className={styles.noimage}>No Image</div>
            )}
            <h3>{project.title}</h3>
          </div>
          <Link href={project.url} target="_blank">
            <div className={styles.link}>
              <i class="fa-solid fa-link"></i>
              <h4>{project.url}</h4>
            </div>
          </Link>
          <p>{project.description}</p>
        </div>
      );
    } else {
      return (
        <div className={styles.project}>
          <div className={`${styles.emptyproject} ${styles.thumbnail}`}>
            <h3>No project here</h3>
            <i class="fa-solid fa-minus"></i>
          </div>
        </div>
      );
    }
  };

  const renderSections = () => {
    let sections = [];
    const noProjects = `No projects uploaded by ${user.username} :'(`;
    if (projects.length == 0) {
      sections.push(
        <div className={styles.sectionbody}>
          <div className={styles.emptyprojects}>
            <div className={styles.alert}>!</div>
            <h3>{noProjects}</h3>
          </div>
        </div>
      );
    } else {
      for (let i = 0; i < projects.length; i += 3) {
        sections.push(
          <div className={styles.sectionbody}>
            {renderProject(projects[i])}
            {renderProject(projects[i + 1])}
            {renderProject(projects[i + 2])}
          </div>
        );
      }
    }
    return sections;
  };

  if (isLoading) {
    return (
      <div className={styles.bodycontent}>
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg pb-24"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.close} onClick={() => router.back()}>
        <i class="fa-solid fa-chevron-left"></i>
      </div>
      <div className={styles.content}>
        <div className={styles.contentheader}>
          <div className={styles.infosandsocials}>
            <div className={styles.userinfo}>
              {user.avatar ? (
                <div className={styles.avatar}>
                  <Image
                    src={user.avatar}
                    alt={`Avatar`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div className={styles.avatar}>
                  <i class="fa-solid fa-user"></i>
                </div>
              )}
              <div className={styles.usernameemail}>
                <h2>{`${user.full_name} (${user.username})`}</h2>
                <h3>{user.email}</h3>
              </div>
            </div>
            <div className={styles.socials}>
              {instagram && (
                <Link href={instagram} target="_blank">
                  <i class="fa-brands fa-instagram"></i>
                </Link>
              )}
              {facebook && (
                <Link href={facebook} target="_blank">
                  <i class="fa-brands fa-facebook"></i>
                </Link>
              )}
              {twitter && (
                <Link href={twitter} target="_blank">
                  <i class="fa-brands fa-twitter"></i>
                </Link>
              )}
              {linkedin && (
                <Link href={linkedin} target="_blank">
                  <i class="fa-brands fa-linkedin"></i>
                </Link>
              )}
              {github && (
                <Link href={github} target="_blank">
                  <i class="fa-brands fa-github"></i>
                </Link>
              )}
            </div>
          </div>
          <div className={styles.chatbutton}>
            <button>{chatTitle}</button>
          </div>
        </div>
        <div className={styles.contentdivider}></div>
        <div className={styles.section}>
          <div className={styles.sectionheader}>
            <h3>Portfolio - Freelancer</h3>
            <p>Click on a project to view images</p>
          </div>
          {renderSections()}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Preview);

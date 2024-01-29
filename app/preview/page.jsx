"use client";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import withAuth from "@/app/hooks/UserChecker";
import styles from "@/app/profile/preview/page.module.css";

const Preview = () => {
  const [userData, setUserData] = useState([]);
  const router = useRouter();
  const { user_id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const chatTitle = "Start a new chat 👋";

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    user_id = 4;
    const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${user_id}/details`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };

    try {
      const response = await axios.get(apiurl, {
        headers,
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserData(response.data);
        console.log(userData);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch projects", response);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const renderProject = (project) => {
    if (project) {
      return (
        <div className={styles.project}>
          <div className={styles.thumbnail}>
            {project && project.images[0] ? (
              <Image
                src={project.images[0]}
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
    const noProjects = `No projects uploaded by ${userData.username} :'(`;
    if (userData.projects.length == 0) {
      sections.push(
        <div className={styles.sectionbody}>
          <div className={styles.emptyprojects}>
            <div className={styles.alert}>!</div>
            <h3>{noProjects}</h3>
          </div>
        </div>
      );
    } else {
      for (let i = 0; i < userData.projects.length; i += 3) {
        sections.push(
          <div className={styles.sectionbody}>
            {renderProject(userData.projects[i])}
            {renderProject(userData.projects[i + 1])}
            {renderProject(userData.projects[i + 2])}
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
              {userData.avatar ? (
                <div className={styles.avatar}>
                  <Image
                    src={userData.avatar}
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
                <h2>{`${user.username} (${user.full_name})`}</h2>
                <h3>{userData.email}</h3>
              </div>
            </div>
            <div className={styles.socials}>
              {userData.social_links.instagram && (
                <Link href={userData.social_links.instagram} target="_blank">
                  <i class="fa-brands fa-instagram"></i>
                </Link>
              )}
              {userData.social_links.facebook && (
                <Link href={userData.social_links.facebook} target="_blank">
                  <i class="fa-brands fa-facebook"></i>
                </Link>
              )}
              {userData.social_links.twitter && (
                <Link href={userData.social_links.twitter} target="_blank">
                  <i class="fa-brands fa-twitter"></i>
                </Link>
              )}
              {userData.social_links.linkedin && (
                <Link href={userData.social_links.linkedin} target="_blank">
                  <i class="fa-brands fa-linkedin"></i>
                </Link>
              )}
              {userData.social_links.github && (
                <Link href={userData.social_links.github} target="_blank">
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

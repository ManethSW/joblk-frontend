"use client";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import withAuth from "@/app/hooks/UserChecker";
import styles from "@/app/profile/preview/page.module.css";

const Preview = () => {
  const router = useRouter();
  const user_id = useSearchParams().get("id");
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatTitle = "Start a new chat 👋";
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
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
        if (response.data.reviews.length > 0) {
          let totalRating = 0;
          response.data.reviews.forEach((review) => {
            totalRating += review.rating;
          });
          const averageRating = totalRating / response.data.reviews.length;
          setAverageRating(averageRating);
        } else {
          setAverageRating(0);
        }
        setIsLoading(false);
      } else {
        console.error("Failed to fetch projects", response);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const handleStartConvo = async (id) => {
    const startConvo = await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation`,
        {
          user_id: id,
        },
        {
          headers: { auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
          withCredentials: true,
        }
      )
      .catch((error) => {
        console.log(error);
      });
    router.push(`/messaging`);
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
    if (!userData.projects) {
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

  function ratingComponent(reviews) {
    // Initialize rating counts
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Count the number of each rating
    reviews?.forEach((review) => {
      ratingCounts[review.rating]++;
    });

    // Calculate the total number of reviews
    const totalReviews = reviews?.length;

    // Calculate the percentage of each rating
    const ratingPercentages = {};
    for (let rating in ratingCounts) {
      ratingPercentages[rating] = (ratingCounts[rating] / totalReviews) * 205;
    }

    return (
      <>
        <div className={styles.ratingcontainer}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-4">
              <div className={styles.ratingscore}>
                <h4 className="text-sm font-medium text-cyan-600 dark:text-cyan-500">
                  {rating}
                </h4>
                <i class="fa-solid fa-star"></i>
              </div>
              <div className="mx-4 h-3 w-1/5 rounded-badge bg-gray-300 dark:bg-gray-700">
                <div
                  className="h-3 rounded-badge bg-joblk-green-500 border-black"
                  style={{ width: `${ratingPercentages[rating]}px` }}
                ></div>
              </div>
              <h4
                className={`text-sm font-medium text-cyan-600 dark:text-cyan-500 ${styles.ratingcount}`}
              >
                {ratingCounts[rating]}
              </h4>
            </div>
          ))}
        </div>
      </>
    );
  }

  function Reviews(reviews) {
    const renderStars = (rating) => {
      const fullStars = Array(Math.floor(rating)).fill("★");
      const halfStar = rating % 1 !== 0 ? "½" : "";
      const emptyStars = Array(5 - fullStars.length - (halfStar ? 1 : 0)).fill(
        "☆"
      );
      return (
        <>
          {fullStars.map((star, index) => (
            <i key={index} className="fa-solid fa-star"></i>
          ))}
          {halfStar && <i className="fa-solid fa-star-half-alt"></i>}
          {emptyStars.map((star, index) => (
            <i key={index} className="fa-regular fa-star"></i>
          ))}
        </>
      );
    };

    const truncateReviewContent = (content) => {
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    };

    return (
      <div className={styles.parentContainer}>
        {reviews?.map((review) => (
          <div key={review.id} className={styles.reviewcontainer}>
            <div className={styles.reviewheader}>
              <div className={styles.reviewerinfo}>
                {review.reviewer_avatar ? (
                  <div className={`${styles.avatarImage} ${styles.avatar}`}>
                    <Image
                      src={review.reviewer_avatar}
                      alt={`Avatar`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className={styles.avatar}>
                    <i className={`fa-solid fa-user`}></i>
                  </div>
                )}
                <h4>{review.reviewer_username}</h4>
              </div>
              <div className={styles.reviewrating}>
                {review.rating && renderStars(review.rating)}
              </div>
            </div>
            <div className={styles.reviewdivider}></div>
            <h5>{review.content && truncateReviewContent(review.content)}</h5>
          </div>
        ))}
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
                <h2>{`${userData.username} (${userData.full_name})`}</h2>
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
            <button type="button" onClick={() => handleStartConvo(user_id)}>
              {chatTitle}
            </button>
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
        <div className={styles.contentdivider}></div>
        <div className={styles.section}>
          <div className={styles.sectionheader}>
            <div className={styles.ratingreviewheader}>
              <h3>Rating & Reviews</h3>
              <div>
                <h4>{averageRating.toFixed(1)}</h4>
                <i class="fa-solid fa-star"></i>
              </div>
            </div>
          </div>
          <div className={styles.ratingbody}>
            {/* Check to see if the reviews is empty */}
            {userData.reviews == null ? (
              <>
                <div className={styles.sectionbody}>
                  <div className={styles.emptyprojects}>
                    <div className={styles.alert}>!</div>
                    <h3>No Reviews for {userData.username} {`:'(`}</h3>
                  </div>
                </div>
              </>
            ) : (
              <>
                {ratingComponent(userData.reviews)}
                {Reviews(userData.reviews)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Preview);

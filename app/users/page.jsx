"use client";
import React, { useState, useContext, useEffect, use } from "react";
import { initFlowbite } from "flowbite";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import SessionContext from "../context/SessionContext";
import styles from "./page.module.css";

const Jobs = () => {
    const { user } = useContext(UserContext);
    const { session, setSession } = useContext(SessionContext);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [usersProvider, setUsersProvider] = useState([]);

    useEffect(() => {
      initFlowbite();
    });

    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!user) {
            router.replace("/login");
        } else {
          setIsLoading(false);
        }

        if (!session) {
          setSession({ user_mode: "client" });
        }
        
        getAllUsers();
    }, [user, session, router]);


    const getAllUsers = async () => {
      const getAllUsers = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all`,  
        {
          headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
          withCredentials: true,
        }).then(
          (response) => {
            setUsersProvider(response.data);
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
    };

    if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <span className="loading loading-spinner loading-lg pb-24"></span>
          </div>
      );
    }

    return (
      <div className={styles.container}>
        {/* Jobs Container */}
        <div className={styles.jobs}>
          <div className={styles.frame}>
            <div className={styles.div}>
              <div className={styles.header}>
                <div className={styles.row}>
                  <div className={styles.cont}>
                    <h1 className={styles.title}>Users</h1>
                    <span className={styles.titleUnderline}></span>
                  </div>
                </div>
              </div>

              <div className={`flex flex-wrap gap-3 py-3 pt-4`}>
              { usersProvider.map((user) => { if (user.full_name) return <UserCard user={user} />}) }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const UserCard = ({
  user,
}) => {
  return (
    <>
      <RateModal id={user.id} />
      <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center py-5">
            <div className="flex justify-center items-center w-24 h-24 mb-3 rounded-full shadow-lg bg-gray-100">
              { !user.avatar || user.avatar == " " ? ( <i className="fa-solid fa-user text-2xl"></i> ) : ( <img className="w-full h-full rounded-full" src={user.avatar} alt="avatar" /> )}
            </div>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.full_name}</h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.city != "" ? user.city : ""}${user.country != "" ? ", "+user.country : ""}`}</span>
            {/* <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">4.95  </p>
                <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                <a href="#" className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">73 reviews</a>
            </div> */}
            <div className="flex mt-4 md:mt-6">
              <button type="button" data-modal-target={`rate-job-modal-${user.id}`} data-modal-toggle={`rate-job-modal-${user.id}`} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Rate</button>
            </div>
          </div>
      </div>
    </>
  );
}

const RateModal = ({
  id,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleAddReview = async() => {
    const addRate = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/review`,
    {
      reviewee_id: id,
      rating: rating,
      content: review, 
    },
    {
      headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
      withCredentials: true,
    });
  
    if (addRate.status == 200) {
      console.log("Review Added")
      window.location.reload(false);
    }
  }
  return (
    <div id={`rate-job-modal-${id}`} tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide={`rate-job-modal-${id}`}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                    <h3 className="text-lg font-semibold">Rating and Review</h3>
                    <div className="flex flex-col items-center my-4">
                      <div class="relative flex items-center max-w-[8rem] mb-4">
                        <button type="button" id="decrement-button" data-input-counter-decrement={`rate-job-input-${id}`} class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="text" id={`rate-job-input-${id}`} onChange={(e) => {setRating(Number.parseInt(e.target.value))}} data-input-counter data-input-counter-min="1" data-input-counter-max="5" aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="999" value="1" required/>
                        <button type="button" id="increment-button" data-input-counter-increment={`rate-job-input-${id}`} class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                      </div>
                      <textarea id="description" rows="4" onChange={(e) => {setReview(e.target.value)}} className="block p-2.5 w-full min-h-[70px] max-h-32 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tell us about your experience with the user"></textarea>
                    </div>
                    <button data-modal-hide={`rate-job-modal-${id}`} onClick={handleAddReview} type="button" className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">Yes, I'm sure</button>
                    <button data-modal-hide={`rate-job-modal-${id}`} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-400 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Jobs;

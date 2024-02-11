"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../../context/UserContext";
import SessionContext from "../../context/SessionContext";
import styles from "./page.module.css";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const { session, setSession } = useContext(SessionContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
  }, [user, session]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="loading loading-spinner loading-lg pb-24"></span>
        </div>
    );
  }

  return(
    <div className="px-20 py-10 w-full flex flex-col gap-4">
      <div className="px-5 py-3 flex justify-between w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white my-3">Welcome, {user.full_name}</h3>
        <h5 className="text-lg font-semibold text-gray-500 dark:text-gray-400 my-3">{new Date().toDateString()}</h5>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col items-center w-60 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          {/* <div className="flex flex-col items-center"> */}
            <div className="flex justify-center items-center rounded-lg w-60 py-10 bg-joblk-green-500">
              <div className="flex justify-center items-center w-24 h-24 rounded-full shadow-lg bg-gray-100">
                { !user.avatar || user.avatar == " " ? ( <i className="fa-solid fa-user text-2xl"></i> ) : ( <img className="w-full h-full rounded-full" src={user.avatar} alt="avatar" /> )}
              </div>
            </div>
            <div className="my-4 mx-3 flex items-center flex-col">
              <div className="flex items-center flex-col my-3">
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">{user.full_name}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.city != "" ? user.city : "N/A"}${user.country != "" ? ", "+user.country : ", N/A"}`}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">{user.averageRating}</p>
              </div>
              <div className="flex gap-1 mt-4">
                <button type="button" onClick={() => router.push(`/profile`)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-joblk-green-500 rounded-lg hover:bg-joblk-green-600 focus:ring-4 focus:outline-none focus:ring-joblk-green-300 dark:bg-joblk-green-600 dark:hover:bg-joblk-green-700 dark:focus:ring-joblk-green-800">View Profile</button>
              </div>
            </div>
          {/* </div> */}
        </div>
        <div class="flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  p-4 md:p-6">
          <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">
              Notifications
          </h5>
          <div class="flex flex-col gap-2 mt-4 h-full">
            <div class="flex items-center justify-center w-full h-full">
                <div class="flex flex-col items-center text-gray-400">
                    <div class="mb-5"><i class="fa-solid fa-bell fa-2xl"></i></div>
                    <p class="text-lg font-semibold text-gray-600 dark:text-white">No notifications</p>
                    <p class="text-md text-gray-400 dark:text-gray-400">You have no pending notifications</p>
                </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-60 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 md:p-6">
          <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">
              Chats
          </h5>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
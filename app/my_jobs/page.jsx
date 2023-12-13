"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import SessionContext from "../context/SessionContext";
import styles from "./page.module.css";

const MyJobs = () => {
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

    return (
      <div className={styles.container}>
        {/* Stats Container */}
        <div className={styles.stats}>
          <div className={styles.frame}>
            <div className={styles.div}>
              <div className={styles.column}>
                <div className={styles.title}>Pending Jobs</div>
                <div className={styles.title}>Ongoing Jobs</div>
                <div className={styles.title}>Completed Jobs</div>
              </div>
              <div className={styles.column}>
                <div className={styles.value}>10</div>
                <div className={styles.value}>2</div>
                <div className={styles.value}>50</div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Container */}
        <div className={styles.jobs}>
          <div className={styles.frame}>
            <div className={styles.div}>

              <div className={styles.header}>
                <div className={styles.row}>
                  <div className={styles.cont}>
                    <h1 className={styles.title}>Jobs</h1>
                    <span className={styles.titleUnderline}></span>
                  </div>
                  <div className={styles.cont}>
                    <button className={styles.addBtn}>
                      <img src="/icons/add.svg" className={styles.addIcon} />
                      <p>New Job</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.filters}>
                <div className={styles.row}>
                <label className={styles.option} for="all">
                    <input type="radio" id="all" name="filter" value="0" defaultChecked/>
                    All
                  </label>
                  <label className={styles.option} for="pending">
                    <input type="radio" id="pending" name="filter" value="1"/>
                    Pending
                  </label>
                  <label className={styles.option} for="ongoing">
                    <input type="radio" id="ongoing" name="filter" value="2"/>
                    Ongoing
                  </label>
                  <label className={styles.option} for="completed">
                    <input type="radio" id="completed" name="filter" value="3"/>
                    Completed
                  </label>
                </div>
              </div>
              <div class="relative overflow-x-auto shadow-sm sm:rounded-lg mt-3 job-table">
                  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                              <th scope="col" class="p-4">
                                  <div class="flex items-center">
                                      <input id="checkbox-all" type="checkbox" onChange={checkAll} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                      <label for="checkbox-all" class="sr-only">checkbox</label>
                                  </div>
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Name
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Views
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Clicks
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Bids
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Options
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          <TableEntry id="1" name="Revamp of DOC990" views="100" clicks="50" bids="10"/>
                          <TableEntry id="2" name="Updating 2017 attendance system" views="60" clicks="20" bids="2"/>
                      </tbody>
                  </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const TableEntry = ({
  id,
  name,
  views,
  clicks,
  bids,
}) => {
  return (
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td class="w-4 p-4">
        <div class="flex items-center">
          <input id={`checkbox-${id}`} type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          <label for={`checkbox-${id}`} class="sr-only">checkbox</label>
        </div>
      </td>
      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {name}
      </th>
      <td class="px-6 py-4">
        {views}
      </td>
      <td class="px-6 py-4">
        {clicks}
      </td>
      <td class="px-6 py-4">
        {bids}
      </td>
      <td class="px-6 py-4">
        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
      </td>
  </tr>
  );
}

const checkAll = () => {
  if (document.getElementById("checkbox-all").checked) {
    document.querySelectorAll('.job-table tbody input[type="checkbox"]').forEach((el) => {
      el.checked = true;
    });
  } else {
    document.querySelectorAll('.job-table tbody input[type="checkbox"]').forEach((el) => {
      el.checked = false;
    });
  }
}

export default MyJobs;

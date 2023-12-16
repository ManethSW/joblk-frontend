"use client";
import React, { useState, useContext, useEffect } from "react";
import Datepicker from "tailwind-datepicker-react";
import { initFlowbite } from "flowbite";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import SessionContext from "../context/SessionContext";
import styles from "./page.module.css";

const MyJobs = () => {
    const { user } = useContext(UserContext);
    const { session, setSession } = useContext(SessionContext);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const [show, setShow] = useState(false);
    const handleChange = (selectedDate) => {
      console.log(selectedDate)
    }
    const handleClose = (state) => {
      setShow(state)
    }

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
                    <button className={styles.addBtn} data-modal-target="add-job-modal" data-modal-toggle="add-job-modal">
                      <img src="/icons/add.svg" className={styles.addIcon} />
                      <p>New Job</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.filters}>
                <div className="flex flex-row flex-wrap mt-2 max-sm:gap-1 gap-2">
                <label className={styles.option} htmlFor="all">
                    <input type="radio" id="all" name="filter" value="0" defaultChecked/>
                    All
                  </label>
                  <label className={styles.option} htmlFor="pending">
                    <input type="radio" id="pending" name="filter" value="1"/>
                    Pending
                  </label>
                  <label className={styles.option} htmlFor="ongoing">
                    <input type="radio" id="ongoing" name="filter" value="2"/>
                    Ongoing
                  </label>
                  <label className={styles.option} htmlFor="completed">
                    <input type="radio" id="completed" name="filter" value="3"/>
                    Completed
                  </label>
                </div>
              </div>
              <div className={`${styles.jobsTable} jobs-table relative overflow-x-auto shadow-sm sm:rounded-lg mt-3`}>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                          <div className="flex items-center">
                              <input id="checkbox-all" type="checkbox" onChange={checkAll} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                              <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                          </div>
                      </th>
                      <th scope="col" className="px-6 py-3 md:px-3">
                          Name
                      </th>
                      <th scope="col" className="px-6 py-3 md:px-3">
                          Views
                      </th>
                      <th scope="col" className="px-6 py-3 md:px-3">
                          Clicks
                      </th>
                      <th scope="col" className="px-6 py-3 md:px-3">
                          Bids
                      </th>
                      <th scope="col" className="px-6 py-3 md:px-3">
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
              <div className={`${styles.jobsSM} flex flex-wrap gap-3 py-3`}>
                <JobCard id="1" name="Revamp of DOC990" views="100" clicks="50" bids="10"/>
                <JobCard id="2" name="Updating 2017 attendance system" views="60" clicks="20" bids="2"/>
              </div>
            </div>
          </div>
        </div>
        {/* Add Job Modal */}
        <div id="add-job-modal" tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-14 right-0 left-0 z-50 justify-center items-center w-full lg:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative p-4 w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Job
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="add-job-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>  
              <form id="add-job" className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2 max-md:grid-cols-1">
                  <div className="inline">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type the name of Job" required=""/>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea id="description" rows="4" className="block p-2.5 w-full min-h-[70px] max-h-32 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Give us the gist of it"></textarea>                    
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catergory</label>
                        <select id="catergory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option defaultChecked value="development">Development</option>
                          <option value="engineering">Engineering</option>
                          <option value="designing">Designing</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="sub-catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sub Catergory</label>
                        <select id="sub-catergory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option defaultChecked value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="fullstack">FullStack</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="deadline" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deadline</label>
                        <Datepicker onChange={handleChange} show={show} setShow={handleClose} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget</label>
                        <div id="budget" className="flex flex-row items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          LKR
                          <input type="text" id="budget-input" onInput={(event) => {event.target.value = Number(event.target.value.replace(/[^\d]/g, '').substring(0,11)).toLocaleString();}} class="flex w-32 border border-0 text-sm bg-gray-50 focus:border-0 focus:ring-0 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="0.00" required/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="inline">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Experience Level</label>
                        <select id="experience" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option defaultChecked value="entry">Entry</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Communication Method</label>
                        <select id="experience" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option defaultChecked value="text">Text / Messages</option>
                          <option value="phone-call">Phone Call</option>
                          <option value="online-meet">Online Meeting</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                        <div id="tags" className="flex flex-row flex-wrap items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <span class="bg-gray-700 text-white text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">React</span>
                          <input type="text" id="tag-search" class="border border-0 text-xs bg-gray-50 focus:border-0 focus:ring-0 block min-w-xs max-w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search the tag" required/>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Required Skills</label>
                        <div id="skills" className="flex flex-row flex-wrap items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <span class="bg-gray-700 text-white text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Time Management</span>
                          <input type="text" id="skill-search" class="border border-0 text-xs bg-gray-50 focus:border-0 focus:ring-0 block min-w-xs max-w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search the skill" required/>
                        </div>
                      </div>
                      <div className="col-span-2">                      
                        <div class="flex items-center justify-center w-full">
                          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" />
                          </label>
                        </div> 
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Add Job
                </button>
              </form>
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
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input id={`checkbox-${id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          <label htmlFor={`checkbox-${id}`} className="sr-only">checkbox</label>
        </div>
      </td>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        {name}
      </th>
      <td className="px-6 py-4 md:px-3">
        {views}
      </td>
      <td className="px-6 py-4 md:px-3">
        {clicks}
      </td>
      <td className="px-6 py-4 md:px-3">
        {bids}
      </td>
      <td className="px-6 py-4 md:px-3">
        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
      </td>
  </tr>
  );
}

const JobCard = ({
  id,
  name,
  views,
  clicks,
  bids,
}) => {
  return (
    <div className="container max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
            <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
        </a>
        <div className="p-5">
            <a href="#">
                <h5 className="mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
            </a>
            <div className="flex items-center mb-2 space-x-3 text-sm font-medium">
              <div className="flex items-center flex-col">
                <p className="font-bold text-xs text-gray-700 dark:text-gray-400">Views</p>
                <p className="font-normal">{views}</p>
              </div>
              <div className="flex items-center flex-col">
                <p className="font-bold text-xs text-gray-700 dark:text-gray-400">Click</p>
                <p className="font-normal">{clicks}</p>
              </div>
              <div className="flex items-center flex-col">
                <p className="font-bold text-xs text-gray-700 dark:text-gray-400">Bids</p>
                <p className="font-normal">{bids}</p>
              </div>
              <button id="dropdownMenuIconHorizontalButton" data-dropdown-toggle={`dropdownDotsHorizontal-${id}`} className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button"> 
              <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
                <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z"/>
              </svg>
              <span className="sr-only">Options</span>
              </button>

              {/* <!-- Dropdown menu --> */}
              <div id={`dropdownDotsHorizontal-${id}`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">View</a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                    </li>
                  </ul>
              </div>
            </div>
        </div>
    </div>
  );
}

const checkAll = () => {
  if (document.getElementById("checkbox-all").checked && document.getElementById("checkbox-all")) {
    document.querySelectorAll('.jobs-table tbody input[type="checkbox"]').forEach((el) => {
      el.checked = true;
    });
  } else {
    document.querySelectorAll('.jobs-table tbody input[type="checkbox"]').forEach((el) => {
      el.checked = false;
    });
  }
}

export default MyJobs;

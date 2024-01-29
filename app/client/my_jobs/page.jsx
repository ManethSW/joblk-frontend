"use client";
import React, { useState, useContext, useEffect } from "react";
import Datepicker from "tailwind-datepicker-react";
import { initFlowbite } from "flowbite";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserContext from "../../context/UserContext";
import SessionContext from "../../context/SessionContext";
import styles from "./page.module.css";
import JobBids from "../../components/Job/JobBids";

const MyJobs = () => {
    const { user } = useContext(UserContext);
    const { session, setSession } = useContext(SessionContext);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState({});
    const [jobsProvider, setJobsProvider] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    

    
    

    

    useEffect(() => {
      initFlowbite();
    });

    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!user) {
          router.replace("/login");
        } else {
          setIsLoading(false);
          setCurrentUser(user);
        }

        if (!session) {
          setSession({ user_mode: "client" });
        }

        getAllJobs();
    }, [user, session, router]);

    const getAllJobs = async () => {
      const getAllJobs = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job/userJobs/${user.id}`,  
        {
          headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
          withCredentials: true,
        }).then(
          (response) => {
            setJobsProvider(response.data);
            setFilteredJobs(response.data);
            console.log(response.data)
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
    };

    

    // const searchFilteredJobs = filteredJobs.filter((job) => {
    //   return job.client_id == currentUser.id;
    // });
    // setFilteredJobs(searchFilteredJobs);

    const handleFilter = (e) => {
      const filterQuery = e.target.value;
      if (filterQuery == 0) {
        setFilteredJobs(jobsProvider);
      } else if (filterQuery == 1) {
        const filteredJobs = jobsProvider.filter((job) => {
          return job.job_status == 1;
        });
        setFilteredJobs(filteredJobs);
      } else if (filterQuery == 2) {
        const filteredJobs = jobsProvider.filter((job) => {
          return job.job_status == 2;
        });
        setFilteredJobs(filteredJobs);
      } else if (filterQuery == 3) {
        const filteredJobs = jobsProvider.filter((job) => {
          return job.job_status == 3;
        });
        setFilteredJobs(filteredJobs);
      }
    }

    let completedJobs = 0;
    let ongoingJobs = 0;
    let pendingJobs = 0;

    jobsProvider.map((job) => {
      if (job.job_status == 1) {
        pendingJobs++;
      }
      if (job.job_status == 2) {
        ongoingJobs++;
      }
      if (job.job_status == 3) {
        completedJobs++;
      }
    });

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
                <div className={styles.value}>{ pendingJobs }</div>
                <div className={styles.value}>{ ongoingJobs }</div>
                <div className={styles.value}>{ completedJobs }</div>
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
                    <input type="radio" id="all" name="filter" value="0" defaultChecked onClick={handleFilter}/>
                    All
                  </label>
                  <label className={styles.option} htmlFor="pending">
                    <input type="radio" id="pending" name="filter" value="1" onClick={handleFilter}/>
                    Pending
                  </label>
                  <label className={styles.option} htmlFor="ongoing">
                    <input type="radio" id="ongoing" name="filter" value="2" onClick={handleFilter}/>
                    Ongoing
                  </label>
                  <label className={styles.option} htmlFor="completed">
                    <input type="radio" id="completed" name="filter" value="3" onClick={handleFilter}/>
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
                    { filteredJobs.map((job) => { if (job.id) return <TableEntry data={job} />}) }
                  </tbody>
                </table>
              </div>
              <div className={`${styles.jobsSM} flex flex-wrap gap-3 py-3`}>
                { filteredJobs.map((job) => { if (job.id) return <JobCard data={job} key={job.id}/>}) }

                {/* <JobCard id="1" name="Revamp of DOC990" views="100" clicks="50" bids="10"/>
                <JobCard id="2" name="Updating 2017 attendance system" views="60" clicks="20" bids="2"/> */}
              </div>
            </div>
          </div>
        </div>
        {/* Add Job Modal */}
        <AddJobModal/>
            

      </div>
    );
};



const AddJobModal = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(1);
  const [subCategory, setSubCategory] = useState(1);
  const [deadline, setDeadline] = useState(moment(Date.now()).format("YYYY-MM-DD 00:00:00"));
  const [budget, setBudget] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState(1);
  const [communicationMethod, setCommunicationMethod] = useState(1);
  const [jobTags, setJobTags] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");

  const handleClose = (state) => {
    setShow(state)
  }

  const handleJobAdd = async () => {
    try{
      const updateJob = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job`, 
        {
          'title':name,
          'description':description,
          'category':category,
          'sub_category':subCategory,
          'deadline':deadline,
          'budget':budget,
          'experience_level':experienceLevel,
          'communication_method':communicationMethod,
          'job_tags':jobTags,
          'required_skills':requiredSkills,
          'job_status':1,
        }, 
        {
          headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
          withCredentials: true,
        }
      );
      if (updateJob.status == 200) {
        console.log("Job Added");
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return(
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
                    <input type="text" name="name" id="name" onChange={(e)=>{setName(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type the name of Job" required=""/>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea id="description" onChange={(e)=>{setDescription(e.target.value)}} rows="4" className="block p-2.5 w-full min-h-[70px] max-h-32 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Give us the gist of it"></textarea>                    
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catergory</label>
                    <select id="catergory" onChange={(e)=>{setCategory(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option defaultChecked value="1">Development</option>
                      <option value="2">Engineering</option>
                      <option value="3">Designing</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="sub-catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sub Catergory</label>
                    <select id="sub-catergory" onChange={(e)=>{setSubCategory(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option defaultChecked value="1">Frontend</option>
                      <option value="2">Backend</option>
                      <option value="3">FullStack</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="deadline" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deadline</label>
                    <Datepicker onChange={(selectedDate) => {setDeadline(moment(selectedDate).format("YYYY-MM-DD 00:00:00"))}} show={show} setShow={handleClose} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget</label>
                    <div id="budget" className="flex flex-row items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      LKR
                      <input type="text" id="budget-input" onInput={(event) => {setBudget(Number.parseInt(event.target.value.split(",").join(""))); event.target.value = Number(event.target.value.replace(/[^\d]/g, '').substring(0,11)).toLocaleString();}} className="flex w-32 border border-0 text-sm bg-gray-50 focus:border-0 focus:ring-0 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="0.00" required/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Experience Level</label>
                    <select id="experience" onChange={(e)=>{setExperienceLevel(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option defaultChecked value="1">Entry</option>
                      <option value="2">Intermediate</option>
                      <option value="3">Expert</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="communication" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Communication Method</label>
                    <select id="communication" onChange={(e)=>{setCommunicationMethod(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option defaultChecked value="1">Text / Messages</option>
                      <option value="2">Phone Call</option>
                      <option value="3">Online Meeting</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                  <label htmlFor="tags" className="flex items-end gap-1 mb-2"><p className="text-sm font-medium text-gray-900 dark:text-white">Tags</p><p className="text-xs font-regular text-gray-900 dark:text-white">(Seperate the tags by a comma)</p></label>
                    <div id="tags" className="flex flex-row flex-wrap items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      {/* <span className="bg-gray-700 text-white text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">React</span> */}
                      <input type="text" id="tag-search" onChange={(e) => {setJobTags(e.target.value.replace(/\s*,\s*/g, ","))}} className="border border-0 text-xs bg-gray-50 focus:border-0 focus:ring-0 block min-w-xs max-w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search the tag" required/>
                    </div>
                  </div>
                  <div className="col-span-2">
                  <label htmlFor="skills" className="flex items-end gap-1 mb-2"><p className="text-sm font-medium text-gray-900 dark:text-white">Required Skills</p><p className="text-xs font-regular text-gray-900 dark:text-white">(Seperate the skills by a comma)</p></label>
                    <div id="skills" className="flex flex-row flex-wrap items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      {/* <span className="bg-gray-700 text-white text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Time Management</span> */}
                      <input type="text" id="skill-search" onChange={(e) => {setRequiredSkills(e.target.value.replace(/\s*,\s*/g, ","))}} className="border border-0 text-xs bg-gray-50 focus:border-0 focus:ring-0 block min-w-xs max-w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search the skill" required/>
                    </div>
                  </div>
                  {/* <div className="col-span-2">                      
                    <div className="flex items-center justify-center w-full">
                      <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" accept="image/png, image/jpeg, image/jpg" multiple="multiple" className="hidden"/>
                      </label>
                    </div> 
                  </div> */}
                </div>
              </div>
            </div>
            <button type="button" data-modal-toggle={`add-job-modal`} onClick={handleJobAdd} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Add Job
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const TableEntry = ({
  data,
}) => {
  return (
    <>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="w-4 p-4">
          <ViewJobModal data={data}/>
          <EditJobModal data={data}/>
          <DeleteJobModal data={data}/>
          <div className="flex items-center">
            <input id={`checkbox-${data.id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            <label htmlFor={`checkbox-${data.id}`} className="sr-only">checkbox</label>
          </div>
        </td>
        <th scope="row" className="px-6 py-4 md:px-3 font-medium text-gray-900 dark:text-white">
          {data.title}
        </th>
        <td className="px-6 py-4 md:px-3">
          {data.views}
        </td>
        <td className="px-6 py-4 md:px-3">
          {data.clicks}
        </td>
        <td className="px-6 py-4 md:px-3">
          {/* {bids} */}0
        </td>
        <td className="px-6 py-4 md:px-3">
          <div className="flex items-center space-x-4 text-sm">
            <button data-modal-target={`view-job-modal-${data.id}`} data-modal-toggle={`view-job-modal-${data.id}`}>
              <img src="/icons/view.svg" className="w-4 h-4"/>
            </button>
            <button data-modal-target={`edit-job-modal-${data.id}`} data-modal-toggle={`edit-job-modal-${data.id}`}>
              <img src="/icons/edit.svg" className="w-4 h-4"/>
            </button>
            <button data-modal-target={`delete-job-modal-${data.id}`} data-modal-toggle={`delete-job-modal-${data.id}`}>
              <img src="/icons/delete.svg" className="w-4 h-4"/>
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

const JobCard = ({
  data,
}) => {
  return (
    <div className="container max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <ViewJobModal data={data}/>
        <EditJobModal data={data}/>
        <DeleteJobModal data={data}/>
        <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">{data.title}</h5>
            </a>
            <div className="flex items-center mb-2 space-x-3 text-sm font-medium">
              <div className="flex items-center flex-col">
                <p className="font-bold text-xs text-gray-700 dark:text-gray-400">Views</p>
                <p className="font-normal">{data.views}</p>
              </div>
              <div className="flex items-center flex-col">
                <p className="font-bold text-xs text-gray-700 dark:text-gray-400">Click</p>
                <p className="font-normal">{data.clicks}</p>
              </div>
              <div className="flex items-center flex-col">
                <p className="font-bold text-xs text-gray-700 dark:text-gray-400">Bids</p>
                <p className="font-normal">0</p>
              </div>
              <button id="dropdownMenuIconHorizontalButton" data-dropdown-toggle={`dropdownDotsHorizontal-${data.id}`} className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button"> 
              <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
                <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z"/>
              </svg>
              <span className="sr-only">Options</span>
              </button>

              {/* <!-- Dropdown menu --> */}
              <div id={`dropdownDotsHorizontal-${data.id}`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                  <li>
                    <button type="button" data-modal-target={`view-job-modal-${data.id}`} data-modal-toggle={`view-job-modal-${data.id}`}  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">View</button>
                  </li>
                  <li>
                    <button type="button" data-modal-target={`edit-job-modal-${data.id}`} data-modal-toggle={`edit-job-modal-${data.id}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</button>
                  </li>
                  <li>
                    <button type="button" data-modal-target={`delete-job-modal-${data.id}`} data-modal-toggle={`delete-job-modal-${data.id}`} className="block px-4 py-2 text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</button>
                  </li>
                </ul>
              </div>
            </div>
        </div>
    </div>
  );
}

const ViewJobModal = ({
  data,
}) => {

  const [milestones, setMilestones] = useState();

  useEffect(() => {
    handleGetMilestone();
  }, [data]);

  const categorySelector = (value) => {
    if (value == 1) {
      return "Development";
    } else if (value == 2) {
      return "Engineering";
    } else if (value == 3) {
      return "Designing";
    }
  }

  const subCategorySelector = (value) => {
    if (value == 1) {
      return "Frontend";
    } else if (value == 2) {
      return "Backend";
    } else if (value == 3) {
      return "FullStack";
    }
  }

  const expLvlSelector = (value) => {
    if (value == 1) {
      return "Entry Level";
    } else if (value == 2) {
      return "Intermediate";
    } else if (value == 3) {
      return "Expert";
    }
  }

  const commMethodSelector = (value) => {
    if (value == 1) {
      return "Text / Messages";
    } else if (value == 2) {
      return "Phone Call";
    } else if (value == 3) {
      return "Online Meeting";
    }
  }

  const handleGetMilestone = async () => {
    try{
      const milestones = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/milestone/${data.id}`, 
        {
          headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
          withCredentials: true,
        }
      ).then((res) => {
        setMilestones(res.data);
        console.log(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div id={`view-job-modal-${data.id}`} tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-14 right-0 left-0 z-50 justify-center items-center w-full lg:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              View Job
            </h3>
            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle={`view-job-modal-${data.id}`}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>  
          <form id="add-job" className="p-4 md:p-5">
            <div id="carousel" className="relative w-full" data-carousel="static">
              <div className="relative overflow-y-auto overflow-x-hidden rounded-lg h-96">
                <div className="hidden duration-200 ease-linear" data-carousel-item="active">
                  <div className="grid gap-4 mb-4 grid-cols-2 max-md:grid-cols-1">
                    <div className="inline">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                          <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Name</label>
                          <div id="name" className="border border-0 border-t border-gray-300 text-gray-900 text-sm block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">{data.title}</div>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Description</label>
                          <div id="description" className="border border-0 border-t border-gray-300 text-gray-900 text-sm block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">{data.description}</div>                    
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catergory</label>
                          <div id="catergory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">{categorySelector(data.category)}</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="sub-catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sub Catergory</label>
                          <div id="sub-catergory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">{subCategorySelector(data.sub_category)}</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget</label>
                          <div id="budget" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">LKR {Number(data.budget).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="inline">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Experience Level</label>
                          <div id="experience" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">{expLvlSelector(data.experience_level)}</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Communication Method</label>
                          <div id="experience" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">{commMethodSelector(data.communication_method)}</div>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                          <div id="tags" className="border border-0 border-t border-gray-300 text-gray-900 text-sm block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                            {data.job_tags ? data.job_tags.split(",").map((tag) => { return <span className="bg-gray-700 text-white text-xs font-medium m-0.5 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300" key={tag}>{tag}</span> }) : "No tags"}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Required Skills</label>
                          <div id="skills" className="border border-0 border-t border-gray-300 text-gray-900 text-sm block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                            {data.required ? data.required_skills.split(",").map((skill) => { return <span className="bg-gray-700 text-white text-xs font-medium m-0.5 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300" key={skill}>{skill}</span> }) : "No skills"}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden duration-200 ease-linear" data-carousel-item>
                  <div className="flex items-center justify-center h-full">
                    <JobBids jobId={data.id} />
                  </div>
                </div>
                <div className="hidden duration-200 ease-linear" data-carousel-item>
                  <div className="col-span-2">
                    <label htmlFor="milestones" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Milestones</label>
                    {milestones ? (
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="py-3 px-6">Name</th>
                            <th scope="col" className="py-3 px-6">Due Date</th>
                            <th scope="col" className="py-3 px-6">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {milestones.map((milestone) => (
                            <tr key={milestone.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="py-4 px-6">{milestone.name}</td>
                              <td className="py-4 px-6">{(milestone.due_date).substring(0,10)}</td>
                              <td className="py-4 px-6">{milestone.priority}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      'No milestones'
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between w-full">
                  <button type="button" data-carousel-prev className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Previous
                  </button>
                <div className="flex flex-row items-center gap-1">
                  <button type="button" data-carousel-next className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Next
                  </button>
                  <button  type="button" className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" data-modal-toggle={`view-job-modal-${data.id}`}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const EditJobModal = ({
  data,
}) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [category, setCategory] = useState(data.category);
  const [subCategory, setSubCategory] = useState(data.sub_category);
  const [deadline, setDeadline] = useState(moment(data.deadline).format("YYYY-MM-DD 00:00:00"));
  const [budget, setBudget] = useState(data.budget);
  const [experienceLevel, setExperienceLevel] = useState(data.experience_level);
  const [communicationMethod, setCommunicationMethod] = useState(data.communication_method);
  const [jobTags, setJobTags] = useState(data.job_tags);
  const [requiredSkills, setRequiredSkills] = useState(data.required_skills);

  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [milestoneDueDate, setMilestoneDueDate] = useState("");
  const [milestonePriority, setMilestonePriority] = useState("");
  const [milestones, setMilestones] = useState();
  const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    handleGetMilestone();
  }, [data]);

  const handleClose = (state) => {
    setShow(state)
  }
  const handleEditMilestone = (milestone) => {
    setSelectedMilestone(milestone);
    setIsEditModalOpen(true);
  };

  const handleJobSave = async () => {
    try{
      const updateJob = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job/${data.id}`, 
        {
          'title':name,
          'description':description,
          'category':category,
          'sub_category':subCategory,
          'deadline':deadline,
          'budget':budget,
          'experience_level':experienceLevel,
          'communication_method':communicationMethod,
          'job_tags':jobTags,
          'required_skills':requiredSkills,
        }, 
        {
          headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
          withCredentials: true,
        }
      );
      if (updateJob.status == 200) {
        console.log("Job Updated")
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetMilestone = async () => {
    try{
      const milestones = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/milestone/${data.id}`, 
        {
          headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
          withCredentials: true,
        }
      ).then((res) => {
        setMilestones(res.data);
        console.log(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }
  const EditMilestoneModal = ({ milestone, closeModal }) => {
    const [name, setName] = useState(milestone.name);
    const [description, setDescription] = useState(milestone.description);
    const [dueDate, setDueDate] = useState(new Date(milestone.due_date).toISOString().split('T')[0]);
    const [status, setStatus] = useState(milestone.status);
    const [priority, setPriority] = useState(milestone.priority);
  
    const handleUpdateMilestone = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${milestone.id}`,
            {
                'name':name,
                'description':description,
                'due_date':dueDate,
                
                'priority':priority,
            },
            {
              headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            closeModal();
          }
        } catch (error) {
          console.error('Error updating milestone:', error);
        }
      };
  
    const handleCloseModal = () => {
        closeModal();
    }
  
    return (
          <div className={styles.modalOverlay} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
  
          <div className={styles.frame}>
            <div className={styles.div} style={{ width: '600px' }}>
              <div className={styles.header}>
                <div className="flex flex-row justify-between">
                  {/* <div className={styles.cont}>
                    <h1 className={styles.title}>Edit Milestone</h1>
                    <span className={styles.titleUnderline}></span>
                  </div> */}
                  <h3 className="text-2xl font-semibold ms-3 mt-3">
                Edit Milestones
              </h3>
                </div>
              </div>
              
              <div className={`${styles.jobsTable} jobs-table relative overflow-x-auto shadow-sm sm:rounded-lg mt-3`}>
                <form 
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    onSubmit={handleUpdateMilestone}
  
                >
                  <div className="px-6 py-3">
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 mt-2 text-gray-900 bg-white border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="px-6 py-3">
                    <label htmlFor="description" className="block text-xs font-semibold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Description</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 mt-2 text-gray-900 bg-white border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="px-6 py-3">
                    <label htmlFor="dueDate" className="block text-xs font-semibold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 mt-2 text-gray-900 bg-white border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                <div className="px-6 py-3">
                    <label htmlFor="priority" className="block text-xs font-semibold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-2 mt-2 text-gray-900 bg-white border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                  <div className="flex items-center justify-end px-6 py-3">
                    <button
                    //   onClick={handleUpdateMilestone}
                    type='submit'
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none me-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                    >
                      Close
                    </button>
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div id={`edit-job-modal-${data.id}`} tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-14 right-0 left-0 z-50 justify-center items-center w-full lg:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Job
            </h3>
            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle={`edit-job-modal-${data.id}`}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>  
          <form id="add-job" className="p-4 md:p-5">
            <div id="edit-carousel" className="relative w-full" data-carousel="static">
              <div className="relative overflow-y-auto overflow-x-hidden rounded-lg h-96">
                <div className="hidden duration-200 ease-linear" data-carousel-item="active">
                  <div className="grid gap-4 mb-4 grid-cols-2 max-md:grid-cols-1">
                    <div className="inline">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                          <input type="text" name="name" id="name" onChange={(e)=>{setName(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type the name of Job" required="" defaultValue={data.title}/>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                          <textarea id="description" name="description" onChange={(e)=>{setDescription(e.target.value)}} rows="4" className="block p-2.5 w-full min-h-[70px] max-h-32 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Give us the gist of it" defaultValue={data.description}></textarea>                    
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catergory</label>
                          <select id="catergory" defaultValue={data.category} onChange={(e)=>{setCategory(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option value="1">Development</option>
                            <option value="2">Engineering</option>
                            <option value="3">Designing</option>
                          </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="sub-catergory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sub Catergory</label>
                          <select id="sub-catergory" defaultValue={data.sub_category} onChange={(e)=>{setSubCategory(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option value="1">Frontend</option>
                            <option value="2">Backend</option>
                            <option value="3">FullStack</option>
                          </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="deadline" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deadline</label>
                          <Datepicker onChange={(selectedDate) => {setDeadline(moment(selectedDate).format("YYYY-MM-DD 00:00:00"))}} />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget</label>
                          <div id="budget" className="flex flex-row items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            LKR
                            <input type="text" id="budget-input" onInput={(event) => {setBudget(Number.parseInt(event.target.value.split(",").join(""))); event.target.value = Number(event.target.value.replace(/[^\d]/g, '').substring(0,11)).toLocaleString();}} className="flex w-32 border border-0 text-sm bg-gray-50 focus:border-0 focus:ring-0 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="0.00" defaultValue={Number(data.budget).toLocaleString()} required/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="inline">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Experience Level</label>
                          <select id="experience" defaultValue={data.experience_level} onChange={(e) => {setExperienceLevel(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option value="1">Entry</option>
                            <option value="2">Intermediate</option>
                            <option value="3">Expert</option>
                          </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="communication" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Communication Method</label>
                          <select id="communication" defaultValue={data.communication_method} onChange={(e) => {setCommunicationMethod(Number.parseInt(e.target.value))}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option value="1">Text / Messages</option>
                            <option value="2">Phone Call</option>
                            <option value="3">Online Meeting</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="tags" className="flex items-end gap-1 mb-2"><p className="text-sm font-medium text-gray-900 dark:text-white">Tags</p><p className="text-xs font-regular text-gray-900 dark:text-white">(Seperate the tags by a comma)</p></label>
                          <div id="tags" className="flex flex-row flex-wrap items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <input type="text" id="tag-search" onChange={(e) => {setJobTags(e.target.value.replace(/\s*,\s*/g, ","))}} className="border border-0 text-xs bg-gray-50 focus:border-0 focus:ring-0 block min-w-xs max-w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search the tag" required defaultValue={data.job_tags.split(",").join(", ")}/>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="skills" className="flex items-end gap-1 mb-2"><p className="text-sm font-medium text-gray-900 dark:text-white">Required Skills</p><p className="text-xs font-regular text-gray-900 dark:text-white">(Seperate the skills by a comma)</p></label>
                          <div id="skills" className="flex flex-row flex-wrap items-center gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <input type="text" id="skill-search" onChange={(e) => {setRequiredSkills(e.target.value.replace(/\s*,\s*/g, ","))}} className="border border-0 text-xs bg-gray-50 focus:border-0 focus:ring-0 block min-w-xs max-w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search the skill" required defaultValue={data.required_skills.split(",").join(", ")}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden duration-200 ease-linear" data-carousel-item>
                  <div className="col-span-2">
                    <label htmlFor="milestones" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Milestones</label>
                    {milestones ? (
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="py-3 px-6">Name</th>
                            <th scope="col" className="py-3 px-6">Description</th>
                            <th scope="col" className="py-3 px-6">Due Date</th>
                            <th scope="col" className="py-3 px-6">Priority</th>
                            <th scope="col" className="py-3 px-6">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {milestones.map((milestone) => (
                            <tr key={milestone.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="py-4 px-6"><input type="text" name="name" id="name" onChange={(e)=>{setMilestoneName(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" defaultValue={milestone.name}/></td>
                              <td className="py-4 px-6"><textarea id="description" name="description" onChange={(e)=>{setMilestoneDesc(e.target.value)}} rows="4" className="block p-2.5 w-60 h-[70px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Give us the gist of it" defaultValue={milestone.description}></textarea></td>
                              <td className="py-4 px-6"><Datepicker onChange={(selectedDate) => {setMilestoneDueDate(moment(selectedDate).format("YYYY-MM-DD 00:00:00"))}} show={show} setShow={handleClose} /></td>
                              <td className="py-4 px-6"><input type="number" name="priority" id="priority" max={5} min={1} onChange={(e)=>{setMilestonePriority(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" defaultValue={milestone.priority}/></td>
                            </tr>
                          ))} */}
                          {milestones.map((milestone) => (
                            <tr key={milestone.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="py-4 px-6">{milestone.name}</td>
                              <td className="py-4 px-6">{milestone.description}</td>
                              <td className="py-4 px-6 whitespace-nowrap">{(milestone.due_date).substring(0,10)}</td>
                              <td className="py-4 px-6">{milestone.priority}</td>
                              <td className="py-4 px-6">
                              <div className="flex items-center space-x-4 text-sm">
                              <button onClick={() => handleEditMilestone(milestone)}>
                                  <img src="/icons/edit.svg" className="w-4 h-4"/>
                                </button>

                                <button data-modal-target={`delete-milestone-modal-${milestone.id}`} data-modal-toggle={`delete-milestone-modal-${milestone.id}`}>
                                  <img src="/icons/delete.svg" className="w-4 h-4"/>
                                </button>
                              </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      'No milestones'
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between w-full">
                <button type="button" data-carousel-prev className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Previous
                </button>
                <div className="flex flex-row items-center gap-1">
                  <button type="button" data-carousel-next className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Next
                  </button>
                  <button type="button" data-modal-toggle={`edit-job-modal-${data.id}`} onClick={handleJobSave} className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {isEditModalOpen && (
      <EditMilestoneModal 
        milestone={selectedMilestone} 
        closeModal={() => setIsEditModalOpen(false)} 
      />
    )}
    </div>
  )
}

const DeleteJobModal = ({
  data,
}) => {
  const handleJobDelete = async () => {
    const deleteJob = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/job/${data.id}`,  
      {
        headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
        withCredentials: true,
      });

    if (deleteJob.status == 200) {
      console.log("Job Deleted")
      window.location.reload(false);
    }
  }

  return(
    <div id={`delete-job-modal-${data.id}`} tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide={`delete-job-modal-${data.id}`}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                    <button data-modal-hide={`delete-job-modal-${data.id}`} onClick={handleJobDelete} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">{`Yes, I'm sure`}</button>
                    <button data-modal-hide={`delete-job-modal-${data.id}`} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-400 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                </div>
            </div>
        </div>
    </div>
  )
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

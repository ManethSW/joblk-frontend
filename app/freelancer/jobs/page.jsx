"use client";
import React, { useState, useContext, useEffect } from "react";
import { initFlowbite } from "flowbite";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserContext from "../../context/UserContext";
import SessionContext from "../../context/SessionContext";
import styles from "./page.module.css";
import BidForm from "../../components/Job/BidForm";

const Jobs = () => {
    const { user } = useContext(UserContext);
    const { session, setSession } = useContext(SessionContext);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [jobsProvider, setJobsProvider] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [filter, setFilter] = useState(0);

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

        getAllJobs();
    }, [user, session, router]);

    const getAllJobs = async () => {
      const getAllJobs = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job`,  
        {
          headers: {auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN},
          withCredentials: true,
        }).then(
          (response) => {
            let jobs = response.data;
            jobs = jobs.filter((job) => {
              return job.job_status == 1;
            });
            setJobsProvider(jobs);
            setFilteredJobs(jobs);
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
    };

    const handleSearch = (e) => {
      const searchQuery = e.target.value;
      const filteredJobs = jobsProvider.filter((job) => {
        return job.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredJobs(filteredJobs);
    }

    const handleFilter = (e) => {
      console.log(jobsProvider)
      const filterQuery = e.target.value;
      setFilter(filterQuery);
      if (filterQuery == 0) {
        setFilteredJobs(jobsProvider);
      } else if (filterQuery == 1) {
        const filteredJobs = jobsProvider.filter((job) => {
          return job.category == 1;
        });
        setFilteredJobs(filteredJobs);
      } else if (filterQuery == 2) {
        const filteredJobs = jobsProvider.filter((job) => {
          return job.category == 2;
        });
        setFilteredJobs(filteredJobs);
      } else if (filterQuery == 3) {
        const filteredJobs = jobsProvider.filter((job) => {
          return job.category == 3;
        });
        setFilteredJobs(filteredJobs);
      }
    }

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
                <div className="flex flex-row justify-between">
                  <div className={styles.cont}>
                    <h1 className={styles.title}>Jobs</h1>
                    <span className={styles.titleUnderline}></span>
                  </div>
                  <div className="">
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="flex jutify-center items-center block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <div className="flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                      </div>
                      <input type="text" id="default-search" onChange={handleSearch} className="border border-0 text-sm bg-gray-50 focus:border-0 focus:ring-0 block min-w-xs max-w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search Jobs..." required/>
                      {/* <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.filters}>
                <div className="flex flex-row flex-wrap mt-2 max-sm:gap-1 gap-2">
                  <label className={styles.option} htmlFor="all">
                    <input type="radio" id="all" name="filter" value="0" onChange={handleFilter} defaultChecked/>
                    All
                  </label>
                  <label className={styles.option} htmlFor="pending">
                    <input type="radio" id="pending" name="filter" onChange={handleFilter} value="1"/>
                    Development
                  </label>
                  <label className={styles.option} htmlFor="ongoing">
                    <input type="radio" id="ongoing" name="filter" onChange={handleFilter} value="2"/>
                    Engineering
                  </label>
                  <label className={styles.option} htmlFor="completed">
                    <input type="radio" id="completed" name="filter" onChange={handleFilter} value="3"/>
                    Designing
                  </label>
                </div>
              </div>
              <div className={`${styles.jobsSM} flex flex-wrap gap-3 py-3`}>
                {(filteredJobs.length == 0) ? (<p className="text-gray-900 dark:text-white">No jobs found</p>) : (
                  filteredJobs.map((job) => { if (job.id) return <><JobCard data={job}/><ViewJobModal data={job}/></>})
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const JobCard = ({
  data,
}) => {
  const catergorySelector = (value) => {
    if (value == 1) {
      return "Development";
    } else if (value == 2) {
      return "Engineering";
    } else if (value == 3) {
      return "Designing";
    }
  }

  const subCatergorySelector = (value) => {
    if (value == 1) {
      return "Frontend";
    } else if (value == 2) {
      return "Backend";
    } else if (value == 3) {
      return "FullStack";
    }
  }

  return (
    <>
      <div className="container max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-5">
          <a href="#">
            <h5 className="inline mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">{data.title}</h5>
          </a>
          <div className="flex flex-wrap justify-between">
            <div className="flex justify-between w-100 mb-2 space-x-3 text-sm font-medium">
              <div className="flex flex-col">
                <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{catergorySelector(data.category)}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{subCatergorySelector(data.sub_category)}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-normal text-sm text-gray-700 dark:text-gray-400">LKR {Number(data.budget).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-4 text-sm">
                <button data-modal-target={`view-job-modal-${data.id}`} data-modal-toggle={`view-job-modal-${data.id}`}>
                  <img src="/icons/view.svg" className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </>
  );
}

const ViewJobModal = ({
  data,
}) => {
  const [viewModalCurrent, setViewModalCurrent] = useState(0);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const [milestones, setMilestones] = useState();

  useEffect(() => {
    handleGetMilestone();
  }, [data]);

  const openBidModal = () => setIsBidModalOpen(true);
  const closeBidModal = () => setIsBidModalOpen(false);

  const switchModalView = () => {
    setViewModalCurrent(viewModalCurrent === 0 ? 1 : 0);
  }

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
    <div id={`view-job-modal-${data.id}`} tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-10 right-0 left-0 z-50 justify-center items-center w-full lg:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {viewModalCurrent == 0 ? `View Job` : `Place Bid`}
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
                          <div id="tags" className="flex flex-wrap border border-0 border-t border-gray-300 text-gray-900 text-sm block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
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
                <div className="hidden duration-200 ease-linear" data-carousel-item>
                  <div className="flex items-center justify-center h-full">
                    <BidForm jobId={data.id}  closeModal={closeBidModal} />
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

export default Jobs;

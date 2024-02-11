"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../../context/UserContext";
import styles from "../../freelancer/jobs/page.module.css";

const Projects = () => {
  const { user } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const openSubmissionModal = (milestone) => {
    setSelectedMilestone(milestone);
    setIsSubmissionModalOpen(true);
   closeModal();
  };

  const closeSubmissionModal = () => {
    setIsSubmissionModalOpen(false);
  };

  const openModal = (projectId, projectStatus) => {
    setSelectedProjectId(projectId);
    setSelectedProjectStatus(projectStatus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const user_type = `"client"`;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${user_type}`,
          {
            headers: { auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
            withCredentials: true,
          }
        );
        const sortedProjects = response.data.sort((a, b) => a.status - b.status);
        setProjects(sortedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setIsLoading(false);
    };
  
    if (user) {
      fetchProjects();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.jobs}>
        <div className={styles.frame}>
          <div className={styles.div}>
            <div className={styles.header}>
              <div className="flex flex-row justify-between">
                <div className={styles.cont}>
                  <h1 className={styles.title}>Projects</h1>
                  <span className={styles.titleUnderline}></span>
                </div>
              </div>
            </div>
            <div
              className={`${styles.jobsTable} jobs-table relative overflow-x-auto shadow-sm sm:rounded-lg mt-3`}
            >
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {/* <th scope="col" className="px-6 py-3 md:px-3">
                      Project ID
                    </th> */}
                    <th scope="col" className="px-6 py-3 md:px-3">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 md:px-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 md:px-3">
                      Status
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {/* <td className="px-6 py-4 md:px-3">
                        {project.id}
                      </td> */}
                      <td className="px-6 py-4 md:px-3 font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </td>
                      <td className="px-6 py-4 md:px-3">
                        {project.description}
                      </td>
                    <td className="px-6 py-4 md:px-3">
                        {project.status === 1 ? "Active" :
                         project.status === 2 ? "Completed" : ""}
                    </td>
                      <td className="px-6 py-4 md:px-3">
                        <div className="flex items-center space-x-4 text-sm">
                        {project.status ===  2 ? (
                          <img
                            src="/icons/view.svg"
                            alt="Submission History"
                            className="ml-2 mb-2 w-5 h-5 cursor-pointer"
                            onClick={() => openModal(project.id, project.status)}
                          />
                        ) : (
                          <img
                            src="/icons/view.svg"
                            alt="View Milestones"
                            className="ml-2 mb-2 w-5 h-5 cursor-pointer"
                            onClick={() => openModal(project.id, project.status)}
                          />
                        )}
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ViewMilestonesModal
          projectId={selectedProjectId}
          projectStatus={selectedProjectStatus}
          closeModal={closeModal}
          openSubmissionModal={openSubmissionModal} 


        />
      )}
      {isSubmissionModalOpen && (
        <SubmissionModal milestone={selectedMilestone} closeModal={closeSubmissionModal}/>
      )}
    </div>
  );
};


const ViewMilestonesModal = ({ projectId, closeModal, openSubmissionModal, projectStatus }) => {
    const [milestones, setMilestones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
      
  
    useEffect(() => {
      const fetchMilestones = async () => {
        
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/milestones/client/${projectId}`, 
            {
              headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
              withCredentials: true,
            }
          );
          setMilestones(response.data);
        } catch (error) {
          console.error('Error fetching milestones:', error);
        }
        setIsLoading(false);
      };
  
      if (projectId) {
        fetchMilestones();
      }
    }, [projectId]);
  
    return (
        <div className={styles.modalOverlay}>

      <div id={`view-milestones-modal-${projectId}`} tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center">
        <div className="relative w-auto my-6 mx-auto max-w-4xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-3xl font-semibold">Milestones</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {isLoading ? (
                <div className="my-4 text-gray-600 text-lg leading-relaxed">
                  Loading milestones...
                </div>
              ) : (
                <div>
                  <div className="flex justify-end items-center space-x-2 ml-auto">
                    {/* <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none mb-5"
                        >
                            Add Milestone
                        </button> */}
                  </div>

                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>

                        {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order Number
                      </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {milestones.map((milestone) => (
                        <tr key={milestone.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {milestone.name}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {milestone.description}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {new Date(milestone.due_date).toLocaleDateString(
                              "en-US",
                              { day: "numeric", month: "long", year: "numeric" }
                            )}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {milestone.status === 1 ? "Incomplete" : "Complete"}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {milestone.priority === 1 && "Low"}
                            {milestone.priority === 2 && "Medium"}
                            {milestone.priority === 3 && "High"}
                            {milestone.priority === 4 && "Urgent"}
                            {milestone.priority === 5 && "Critical"}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex justify-start items-center space-x-2">
                            {/*add upload files modal*/}
                          
                            <img
                              src="/icons/view.svg"
                              alt="Submissions"
                              className="ml-2 mb-2 w-5 h-5 cursor-pointer"
                              onClick={() => openSubmissionModal(milestone)}
                            />
                        </div>
                        </td>
                        
                        {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {milestone.order_number}
                        </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
            

            {/* {projectStatus === 3 && (
                <button
                  onClick={makePayment}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  Make Payment
                </button>
            )} */}
              {/* <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={closeModal}
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>
      </div> 
    );
  };


const SubmissionModal = ({ milestone, closeModal }) => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchMilestoneContent = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/milestone/${milestone.id}/content`, {
                    headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
                    withCredentials: true,
                });
                setFiles(response.data.upload_reference || []);
            } catch (error) {
                console.error('Error fetching milestone content:', error);
            }
            setIsLoading(false);
        };

        fetchMilestoneContent();
    }, [milestone]);

    // const isViewableInBrowser = (fileName) => {
    //     return fileName.match(/\.(jpeg|jpg|gif|png|pdf)$/i);
    // };

    const handleFileView = (fileUrl) => {
      window.open(fileUrl, '_blank');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg pb-24"></span>
                </div>
              ) : (
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Uploaded Files
                    </h3>
                    <div className="mt-5 mb-5">
                      {files.length > 0 ? (
                        <table className="table-auto">
                          <thead>
                            <tr>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">File Name</th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Submitted On</th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {files.map((file, index) => (
                              <tr key={index}>
                                <td className="border px-3 py-3">{file.reference.split('/').pop()}</td>
                                <td className="border px-3 py-3">{new Date(file.createdAt).toLocaleDateString()}</td>
                                <td className="border px-3 py-3">
                                <img
                                    src="/icons/view.svg"
                                    alt="View File"
                                    className="ml-2 mb-2 w-5 h-5 cursor-pointer"
                                    onClick={() => handleFileView(file.reference, file.reference.split('/').pop())}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No files uploaded.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  


export default Projects;

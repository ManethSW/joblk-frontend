"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from "../../context/UserContext";
import styles from '../../freelancer/jobs/page.module.css';

const Projects = () => {
  const { user } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProjectStatus, setSelectedProjectStatus] = useState(null);


  const openAddMilestoneModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsAddModalOpen(true);
   };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openModal = (projectId, projectStatus) => {
    setSelectedProjectId(projectId);
    setSelectedProjectStatus(projectStatus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditMilestoneModal = (milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(false); 
    setIsEditModalOpen(true); 
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
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
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
            <div className={`${styles.jobsTable} jobs-table relative overflow-x-auto shadow-sm sm:rounded-lg mt-3`}>
                
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
                    <tr key={project.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                        {project.status === 1 ? "Milestone definition" :
                         project.status === 2 ? "Milestone Approval" :
                         project.status === 3 ? "Payment" :
                         project.status === 4 ? "Active" :
                         project.status === 5 ? "Completed" : ""}
                    </td>
                      <td className="px-6 py-4 md:px-3">
                        <div className="flex items-center space-x-4 text-sm">
                        <button
                            onClick={() => openAddMilestoneModal(project.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                            >
                            Add Milestones
                            </button>
                          <button
                            onClick={() => openModal(project.id, project.status)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                          >
                            View Milestones
                          </button>
                          
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
          openEditMilestoneModal={openEditMilestoneModal}

        />
      )}
      {isEditModalOpen && selectedMilestone && (
        <EditMilestoneModal
          milestone={selectedMilestone}
          closeModal={() => setIsEditModalOpen(false)}
        />
      )}
       {isAddModalOpen && (
      <AddMilestoneModal
        projectId={selectedProjectId}
        closeModal={closeAddModal}
      />
    )}
    </div>
  );
};

const AddMilestoneModal = ({ projectId, closeModal }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('1'); 
    const [priority, setPriority] = useState('1');
  
    const handleAddMilestone = async (event) => {
        event.preventDefault();
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${projectId}`,
          {
            'name':name,
            'description':description,
            'due_date':dueDate,
            
            'priority':priority,
            // description,
            // due_date: dueDate,
            // // status: parseInt(status),
            // priority: parseInt(priority),
          },
          {
            headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          closeModal();
          console.log('Milestone added successfully!');
        }
      } catch (error) {
        console.error('Error adding milestone:', error);
      }
    };
  
    return (
      <div className={styles.modalOverlay} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.frame} >
          <div className={styles.div} style={{ width: '600px' }}>
            <div className={styles.header}>
              <div className="flex flex-row justify-between">
                {/* <div className={styles.cont}>
                  <h1 className={styles.title}>Add Milestone</h1>
                  <span className={styles.titleUnderline}></span>
                </div> */}
                <h3 className="text-2xl font-semibold ms-3 mt-3">
               Add Milestones
             </h3>
              </div>
            </div>
            <div className={`${styles.jobsTable} jobs-table relative overflow-x-auto shadow-sm sm:rounded-lg mt-3`}>
              <form 
                className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                onSubmit={handleAddMilestone}

              >
                {/* Name input */}
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
                {/* Description input */}
                <div className="px-6 py-3">
                  <label htmlFor="description" className="block text-xs font-semibold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 mt-2 text-gray-900 bg-white border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                {/* Due Date input */}
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
                {/* Status select */}
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
                {/* Buttons */}
                <div className="flex items-center justify-end px-6 py-3">
                  <button
            

                    // onClick={handleAddMilestone}
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Add
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none ml-2"
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
              name,
              description,
              due_date: dueDate,
              priority: parseInt(priority),
            //   status: parseInt(status),
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



const ViewMilestonesModal = ({ projectId, closeModal, openEditMilestoneModal, projectStatus }) => {
    const [milestones, setMilestones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleDeleteMilestone = async (milestoneId) => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${milestoneId}`,
                {
                    headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                setMilestones(milestones.filter(milestone => milestone.id !== milestoneId));
            }
        } catch (error) {
            console.error('Error deleting milestone:', error);
        }
    };
    
    const submitMilestones = async () => {
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/project/${projectId}`,
            {
              status: 2
            },
            {
              headers: { 
                'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN 
              },
              withCredentials: true,
            }
          );
            if (response.status === 200) {
                console.log('Milestones submitted successfully!');
                closeModal();
            }
        } catch (error) {
          console.error('Error submitting milestones:', error);
        }
       };
  
    useEffect(() => {
      const fetchMilestones = async () => {
        
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/milestones/${projectId}`, 
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
              <h3 className="text-3xl font-semibold">
                Milestones
              </h3>
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
                            {new Date(milestone.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {milestone.status === 1 ? 'Incomplete' : 'Complete'}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex justify-start items-center space-x-2">
                        <button
            //   onClick={() => handleDeleteMilestone(milestone.id)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
            >
              Complete
            </button>
            <button
                    onClick={() => openEditMilestoneModal(milestone)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
            <button
              onClick={() => handleDeleteMilestone(milestone.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Delete
            </button>
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
            {projectStatus === 1 && (
                <button
                    onClick={submitMilestones}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                    Submit Milestones
                </button>
            )}
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
  


export default Projects;
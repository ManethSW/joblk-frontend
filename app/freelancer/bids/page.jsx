"use client";
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import UserContext from "../../context/UserContext";
import styles from '../jobs/page.module.css';


const Bids = () => {
  const { user } = useContext(UserContext);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bidProvider, setBidProvider] = useState([]);
    const [filteredBids, setFilteredBids] = useState([]);
    const [filter, setFilter] = useState(0);
    const [showModal, setShowModal] = useState(false);
  const [currentBid, setCurrentBid] = useState({
    bid_value: "",
    supporting_content: "",
    
  });


  const handleEditClick = useCallback((bid) => {
    setCurrentBid(bid);
    setShowModal(true);
   }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send a request to the API to update the bid value and supporting content
    // ...
    setShowModal(false);
  };
  const handleInputChange = (event) => {
    setCurrentBid({
      ...currentBid,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/bid`, 
            {
                headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
                withCredentials: true,
            }
        );
        setBids(response.data);
        setBidProvider(response.data);
        setFilteredBids(response.data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchBids();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    )
   }
  
  const handleFilter = (e) => {
    const filterQuery = e.target.value;
    setFilter(filterQuery);
    if (filterQuery == 0) {
      setFilteredBids(bidProvider);
    } else if (filterQuery == 1) {
      const filteredBids = bidProvider.filter((bid) => {
        return bid.status_name == "pending"; // Pending
      });
      setFilteredBids(filteredBids);
    } else if (filterQuery == 2) {
      const filteredBids = bidProvider.filter((bid) => {
        return bid.status_name == "accepted"; // Accepted
      });
      setFilteredBids(filteredBids);
    } else if (filterQuery == 3) {
      const filteredBids = bidProvider.filter((bid) => {
        return bid.status_name == "rejected"; // Rejected
      });
      setFilteredBids(filteredBids);
    }
   }
  return (
    <div className={styles.container}>
      <div className={styles.jobs}>
        <div className={styles.frame}>
          <div className={styles.div}>
            <div className={styles.header}>
              <div className="flex flex-row justify-between">
                <div className={styles.cont}>
                  <h1 className={styles.title}>Bids</h1>
                  <span className={styles.titleUnderline}></span>
                </div>
                
              </div>
              
            </div>
            <div className={styles.filters}>
                    <div className="flex flex-row flex-wrap mt-7 max-sm:gap-1 gap-2">
                        <label className={styles.option} htmlFor="all">
                            <input type="radio" id="all" name="filter" value="0" onChange={handleFilter} defaultChecked/>
                            All
                        </label>
                        <label className={styles.option} htmlFor="pending">
                            <input type="radio" id="pending" name="filter" onChange={handleFilter} value="1"/>
                            Pending
                        </label>
                        <label className={styles.option} htmlFor="ongoing">
                            <input type="radio" id="ongoing" name="filter" onChange={handleFilter} value="2"/>
                            Accepted
                        </label>
                        <label className={styles.option} htmlFor="completed">
                            <input type="radio" id="completed" name="filter" onChange={handleFilter} value="3"/>
                            Rejected
                        </label>
                    </div>
                </div>
            <div className={`${styles.jobsSM} flex flex-wrap gap-3 py-3`}>
            {filteredBids.map((bid) => (
              <div key={bid.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="inline mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">{bid.job_title}</p>
                  <div className="flex">
                    <img src="/icons/view.svg" alt="View" className="ml-2 mb-2 w-5 h-5 cursor-pointer" /> 
                    <img src="/icons/edit.svg" alt="Edit" className="ml-2 mb-2 w-5 h-5 cursor-pointer" onClick={() => handleEditClick(bid) } /> 
                  </div>
                </div>
                <p>Bid Value: {bid.bid_value}</p>
                <p>Status: {bid.status_name}</p>
              </div>
            ))}
            {showModal && (
              <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mt-3 mr-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                              Edit Bid
                              </h3>
                              <div className="mt-4">
                                <label htmlFor="bidValue" className="mb-2 block text-sm font-medium text-gray-700">
                                    Bid Value
                                </label>
                                <input type="number" name="bidValue" id="bidValue" className="mb-4 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentBid.bid_value} onChange={handleInputChange}  />
                                <label htmlFor="supportingContent" className="mb-2 text-sm font-medium text-gray-700">
                                    Supporting Content
                                </label>
                                <textarea name="supportingContent" id="supportingContent" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentBid.supporting_content} onChange={handleInputChange} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Save
                          </button>
                          <button onClick={() => setShowModal(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bids;
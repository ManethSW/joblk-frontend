"use client";
import React, { useState, useEffect, useContext } from 'react';
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
                  <p className="inline mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">{bid.job_title}</p>
                  
                  <p>Bid Value: {bid.bid_value}</p>
                  <p>Status: {bid.status_name}</p>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bids;
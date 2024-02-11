import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../context/UserContext';

const JobBids = ({ jobId, jobStatus }) => {
  const { user } = useContext(UserContext);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");    

    const handleSendMessage = (bidId, event) => {
      event.preventDefault();
    };
  
  

  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bid/${jobId}`, {
          headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
          withCredentials: true,
        });
        setBids(response.data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
      setIsLoading(false);
    };

    if (jobId) {
      fetchBids();
      console.log('Fetching bids for job status:', jobStatus);
    }
  }, [jobId, process.env.NEXT_PUBLIC_API_AUTH_TOKEN]);


  const updateBidStatus = async (bidId, status) => {
    try {
        setIsLoading(true)
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bid/${bidId}`, {
        status: status
      }, {
        headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
        withCredentials: true,
      });
      if (status === 2) {
        setSuccessMessage("Bid accepted successfully!");
      } else if (status === 3) {
        setSuccessMessage("Bid rejected successfully!");
        }
      if (response.status === 200) {
        setBids(bids.map(bid => bid.id === bidId ? { ...bid, status: status } : bid));
      }
      setIsLoading(false)
    } catch (error) {
        setErrorMessage(error.response.data.message);
      console.error('Error updating bid status:', error);
    }
  };


  const handleAccept = (bidId, event) => {
    event.preventDefault();
    updateBidStatus(bidId, 2); 
    
  };

  const handleReject = (bidId, event) => {
    event.preventDefault();
    updateBidStatus(bidId, 3); 
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg pb-24"></span>
      </div>
    )
   }

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        {errorMessage && <div className="mt-4 text-red-500 mb-4">{errorMessage}</div>}
        {successMessage && <div className="mt-4 text-green-500 mb-6">{successMessage}</div>}
      {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bids for Job ID: {jobId}</h2> */}
      {bids.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">Bid Amount</th>
              <th scope="col" className="py-3 px-6">Freelancer</th>
              <th scope="col" className="py-3 px-6">Supporting Content</th>
              <th scope="col" className="py-3 px-6">Score</th>
              <th scope="col" className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="py-4 px-6">LKR {Number(bid.bid_value).toLocaleString()}</td>
                <td className="py-4 px-6">{bid.freelancer_username}</td>
                <td className="py-4 px-6">{bid.supporting_content || 'N/A'}</td>
                <td className="py-4 px-6">{bid.bid_Score}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-4 text-sm">
                  {jobStatus !==  2 ? (
                <>
                  <button
                    onClick={(e) => handleAccept(bid.id, e)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => handleReject(bid.id, e)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <img
                src="/icons/message.svg"
                alt="message"
                className="ml-2 mb-2 w-5 h-5 cursor-pointer"
                onClick={(e) => handleSendMessage(bid.id, e)}
              />
              )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-900 dark:text-white">No bids placed yet.</p>
      )}
    </div>
  );
};

export default JobBids;
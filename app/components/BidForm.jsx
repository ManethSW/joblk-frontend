import React, { useState, useContext } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';

const BidForm = ({ jobId, closeModal }) => {
  const { user } = useContext(UserContext);
  const [bidValue, setBidValue] = useState('');
  const [supportingContent, setSupportingContent] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to submit a bid.');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bid/${jobId}`,
        {
          bid_value: bidValue,
          supporting_content: supportingContent,
        },
        {
          headers: { 'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN },
          withCredentials: true,
        }
      );
      if (response.data.code === 'SUCCESS') {
        setSuccessMessage("Bid submitted successfully!");
        console.log('Bid submitted successfully!');
        // alert('Bid submitted successfully!');
        closeModal();
        // window.location.reload(false);
      }
    } catch (error) {
      console.error('Failed to submit bid:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        setErrorMessage(error.response.data.message);
      }
     }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 md:p-5">
      {errorMessage && <div className="mt-4 text-red-500 mb-4">{errorMessage}</div>}
      {successMessage && <div className="mt-4 text-green-500 mb-4">{successMessage}</div>}
      <div className="mb-4">
        <label htmlFor="bidValue" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bid Value</label>
        <input
          type="number"
          id="bidValue"
          value={bidValue}
          onChange={(e) => setBidValue(e.target.value)}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="supportingContent" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Supporting Content
            <br />
            <span className="text-xs text-gray-500">Recommended: Provide a link to a project that you believe supports your claim for this job.</span>
        </label>
        <input
          type="text"
          id="supportingContent"
          value={supportingContent}
          onChange={(e) => setSupportingContent(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <button onClick={handleSubmit} type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Submit Bid
      </button>
    </div>
  );
};

export default BidForm;
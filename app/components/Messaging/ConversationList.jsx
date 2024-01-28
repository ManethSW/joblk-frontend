import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from "../../context/UserContext";

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const { user } = useContext(UserContext);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation`, 
      {
          headers: {
              'auth_token': process.env.NEXT_PUBLIC_API_AUTH_TOKEN 
          },
          withCredentials: true 
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelectConversation = async (id) => {
    onSelectConversation(id);
    setTimeout(fetchConversations, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* <button onClick={() => onSelectConversation(null)} className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4">
        New Conversation
      </button> */}
      <div className="overflow-y-auto">
        {conversations.map((conversation) => (
          <div key={conversation.id} onClick={() => handleSelectConversation(conversation.id)} className="cursor-pointer bg-green-100 p-1 hover:bg-green-300 rounded-md mt-1 mr-4 ml-4 border border-gray-500 transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black font-bold">{conversation.user_two_username === user.username ? conversation.user_one_username : conversation.user_two_username}</p>
                <p className="text-gray-500 text-sm overflow-hidden overflow-ellipsis">
                  {conversation.last_message.length > 20
                    ? conversation.last_message.substring(0, 20) + "..."
                    : conversation.last_message}
                </p>
              </div>
              {conversation.unread_messages > 0 && <span className="ml-3 badge badge-success text-white font-bold">{conversation.unread_messages}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationsList;
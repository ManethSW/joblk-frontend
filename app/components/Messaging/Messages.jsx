import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import UserContext from "../../context/UserContext";
import io from "socket.io-client";

const Messages = ({ conversationId }) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationDetails, setConversationDetails] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = io("http://localhost:3001");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  socket.on("new_message", (message) => {
    // Update the chat interface with the new message
    console.log("New message received:", message);
  });

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/message/${conversationId}`,
        {
          headers: {
            auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
          },
          withCredentials: true,
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  }, [conversationId]);

  const fetchConversationDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation/${conversationId}`,
        {
          headers: {
            auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
          },
          withCredentials: true,
        }
      );
      setConversationDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch conversation details", error);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      fetchConversationDetails();
    }
  }, [conversationId, fetchMessages, fetchConversationDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/message/${conversationId}`,
        { messageContent: newMessage },
        {
          headers: {
            auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
          },
          withCredentials: true,
        }
      );
      setNewMessage("");
      fetchMessages();

      // Emit new_message event
      socket.emit("new_message", {
        conversationId: conversationId,
        messageContent: newMessage,
        senderId: user.id,
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {conversationDetails && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{conversationDetails.title}</h3>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <div className="h-[400px] overflow-y-auto p-4 space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender_id === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${
                  message.sender_id === user.id
                    ? "bg-green-300"
                    : "bg-green-100"
                }`}
              >
                <p>{message.message_content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;

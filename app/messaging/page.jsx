"use client";
import React, { use, useState } from "react";
import ConversationsList from "../components/Messaging/ConversationList";
import Messages from "../components/Messaging/Messages";
import withAuth from "../hooks/UserChecker";
import io from "socket.io-client";

const Messaging = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const socket = io("http://localhost:3001");

  socket.on("new_message", (message) => {
    // Update the chat interface with the new message
    console.log("New message received:", message);
  });

  return (
    <div className="container mx-auto pt-10 lg:pr-32 lg:pl-32 sm:pr-5 sm:pl-5">
      {/* <button
        onClick={() => {
          socket.emit("send_message", { content: "Hello, world!" });
        }}
      >
        Test
      </button> */}
      <h1 className="text-2xl font-semibold pb-5">Messaging</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-row justify-between items-center mb-4"></div>
        <div className="flex flex-1">
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-100 p-3 mr-4 rounded-lg shadow">
            <ConversationsList
              onSelectConversation={setSelectedConversationId}
            />
          </div>
          <div className="flex-1 bg-white p-3 rounded-lg shadow">
            {selectedConversationId ? (
              <Messages conversationId={selectedConversationId} />
            ) : (
              <div
                className="h-[480px]"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/convo.svg" alt="convo" width="200" height="200" />
                <div className="text-center text-gray-500">
                  Select a conversation to start messaging.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Messaging);

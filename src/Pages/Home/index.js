import React, { useState } from "react";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";
import ChatArea from "./components/ChatArea";
import { useSelector } from "react-redux";

function Home() {
  const [searchKey, setSearchKey] = React.useState("");
  const [messages, setMessages] = useState([]);

  const selectedChat = useSelector((state) => state.selectedChat);
  return (
    <div className="flex gap-5">
      {/* 1st part   user search , userslist/chatlist */}
      <div className="w-96">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList
          messages={messages}
          setMessages={setMessages}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
        />
      </div>
      {/* 2nd part   chatbox */}
      {Object.keys(selectedChat).length > 0 && (
        <div className="w-full">
          <ChatArea messages={messages} setMessages={setMessages} />
        </div>
      )}
      {/* {!selectedChat && (
        <div className="w-full h-[80vh]  items-center justify-center flex bg-white flex-col">
          <img
            src="https://www.pngmart.com/files/16/Speech-Chat-Icon-Transparent-PNG.png"
            alt=""
            className="w-96 h-96"
          />
          <h1 className="text-2xl font-semibold text-gray-500">
            Select a user to chat
          </h1>
        </div>
      )} */}
    </div>
  );
}

export default Home;

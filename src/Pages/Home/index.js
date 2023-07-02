import React from "react";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";

function Home() {
  const [searchKey, setSearchKey] = React.useState("");

  return (
    <div className="flex gap-5">
      {/* 1st part   user search , userslist/chatlist */}
      <div className="w-96">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList searchKey={searchKey} setSearchKey={setSearchKey} />
      </div>

      {/* 2nd part   chatbox */}
      {/* {selectedChat && (
        <div className="w-full">
          <ChatArea socket={socket} />
        </div>
      )} */}

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

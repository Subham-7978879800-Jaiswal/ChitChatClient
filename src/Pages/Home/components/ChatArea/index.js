import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ChatArea({ socket, messages, setMessages }) {
  const user = useSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState("");
  const selectedChat = useSelector((state) => state.selectedChat);
  const receipentUser = selectedChat?.members?.find(
    (mem) => mem._id !== user._id
  );
  const { REACT_APP_API_URL } = process.env;

  const createNewMessage = async (chatId, senderId) => {
    try {
      const newMessageBody = {
        chatId: selectedChat._id,
        senderId: user._id,
        text: newMessage,
      };

      const response = await axios.post(
        `${REACT_APP_API_URL}/messages/create-new-message`,
        newMessageBody,
        { withCredentials: true }
      );

      const newMessageRes = response.data.message;

      setMessages((prev) => {
        return [...prev, newMessageRes];
      });
      setNewMessage("")
    } catch (err) {
      const errMsg = err?.response?.data?.errorMessage;
      if (errMsg !== {}) toast.error(errMsg.toString());
    }
  };

  return (
    <>
      <Toaster></Toaster>{" "}
      <div className="bg-white h-[80vh] border rounded-2xl w-full flex flex-col justify-between p-5">
        {/* 1st part receipent user */}
        <div>
          <div className="flex gap-5 items-center mb-2">
            {receipentUser.profilePic && (
              <img
                src={receipentUser.profilePic}
                alt="profile pic"
                className="w-10 h-10 rounded-full"
              />
            )}
            {!receipentUser.profilePic && (
              <div className="bg-gray-500  rounded-full h-10 w-10 flex items-center justify-center">
                <h1 className="uppercase text-xl font-semibold text-white">
                  {receipentUser.name[0]}
                </h1>
              </div>
            )}
            <h1 className="uppercase">{receipentUser.name}</h1>
          </div>
          <hr />
        </div>

        {/* 2nd part chat messages */}
        <div className="h-[55vh] overflow-y-scroll p-5" id="messages">
          <div className="flex flex-col gap-2">
            {messages.map((message, index) => {
              const isCurrentUserIsSender = message.senderId === user._id;
              return (
                <div
                  className={`flex ${isCurrentUserIsSender && "justify-end"}`}
                >
                  <div className="flex flex-col gap-1">
                    {message.text && (
                      <h1
                        className={`${
                          isCurrentUserIsSender
                            ? "bg-primary text-white rounded-bl-none"
                            : "bg-gray-300 text-primary rounded-tr-none"
                        } p-2 rounded-xl`}
                      >
                        {message.text}
                      </h1>
                    )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="message image"
                        className="w-24 h-24 rounded-xl"
                      />
                    )}
                    <h1 className="text-gray-500 text-sm">
                      {/* {getDateInRegualarFormat(message.createdAt)} */}
                    </h1>
                  </div>
                  {isCurrentUserIsSender && message.read && (
                    <div className="p-2">
                      {receipentUser.profilePic && (
                        <img
                          src={receipentUser.profilePic}
                          alt="profile pic"
                          className="w-4 h-4 rounded-full"
                        />
                      )}
                      {!receipentUser.profilePic && (
                        <div className="bg-gray-400 rounded-full h-4 w-4 flex items-center justify-center relative">
                          <h1 className="uppercase text-sm font-semibold text-white">
                            {receipentUser.name[0]}
                          </h1>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {/* {isReceipentTyping && (
            <div className="pb-10">
              <h1 className="bg-blue-100 text-primary  p-2 rounded-xl w-max">
                typing...
              </h1>
            </div>
          )} */}
          </div>
        </div>

        {/* 3rd part chat input */}

        <div className="h-18 rounded-xl border-gray-300 shadow border flex justify-between p-2 items-center relative">
          {/* {showEmojiPicker && (
          <div className="absolute -top-96 left-0">
            <EmojiPicker
              height={350}
              onEmojiClick={(e) => {
                setNewMessage(newMessage + e.emoji);
              }}
            />
          </div>
        )} */}

          <div className="flex gap-2 text-xl">
            <label for="file">
              <i className="ri-link cursor-pointer text-xl" typeof="file"></i>
              <input
                type="file"
                id="file"
                style={{
                  display: "none",
                }}
                accept="image/gif,image/jpeg,image/jpg,image/png"
                // onChange={onUploadImageClick}
              />
            </label>
            <i
              className="ri-emotion-line cursor-pointer text-xl"
              // onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            ></i>
          </div>

          <input
            type="text"
            placeholder="Type a message"
            className="w-[90%] border-0 h-full rounded-xl focus:border-none"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
          <button
            className="bg-primary text-white py-1 px-5 rounded h-max"
            onClick={() => createNewMessage(receipentUser)}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatArea;

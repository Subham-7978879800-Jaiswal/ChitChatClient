import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Highlighter from "react-highlight-words";
import axios from "axios";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../../../Components/Loader";
import { setAllChats, setSelectedChat } from "../../../../Redux/Slices/users";
import { Badge } from "@material-tailwind/react";

function UsersList({ searchKey, setSearchKey, setMessages }) {
  const otherUsers = useSelector((state) => state.otherUsers);
  const chats = useSelector((state) => state.chats);
  const user = useSelector((state) => state.user);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const { REACT_APP_API_URL } = process.env;
  const dispatch = useDispatch();
  const createChat = async (event) => {
    try {
      setLoading(true);
      const id = event.target.id;
      const members = [id, user?._id];

      const newChatBody = {
        members,
        unreadMessages: 0,
      };

      const response = await axios.post(
        `${REACT_APP_API_URL}/chat/create-new-chat`,
        newChatBody,
        { withCredentials: true }
      );
      const newChat = response.data.chat;
      const allChats = [...chats, newChat];
      dispatch(setAllChats(allChats));
      dispatch(setSelectedChat(newChat));
      toast.success("Start By Saying Hii :) ");
    } catch (err) {
      const errMsg = err?.response?.data?.errorMessage;
      if (errMsg !== {}) toast.error(errMsg.toString());
    } finally {
      setLoading(false);
    }
  };

  const getAllMessages = async (chatId) => {
    try {
      setLoading(true);

      const messagesLinkedToChatId = {
        chatId: chatId,
      };

      const response = await axios.post(
        `${REACT_APP_API_URL}/messages/get-all-messages/`,
        messagesLinkedToChatId,
        { withCredentials: true }
      );
      return response.data.messages;
    } catch (err) {
      const errMsg = err?.response?.data?.errorMessage;
      if (errMsg !== {}) toast.error(errMsg.toString());
    } finally {
      setLoading(false);
    }
  };

  const getDateInRegualarFormat = (date) => {
    let result = "";

    // if date is today return time in hh:mm format
    if (moment(date).isSame(moment(), "day")) {
      result = moment(date).format("hh:mm");
    }
    // if date is yesterday return yesterday and time in hh:mm format
    else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
      result = `Yesterday ${moment(date).format("hh:mm")}`;
    }
    // if date is this year return date and time in MMM DD hh:mm format
    else if (moment(date).isSame(moment(), "year")) {
      result = moment(date).format("MMM DD hh:mm");
    }

    return result;
  };

  const getLastMsg = (userObj) => {
    const chat = chats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const lastMsgPerson =
        chat?.lastMessage?.senderId === user._id ? "You : " : "";
      return (
        <div className="flex justify-between w-72">
          <h1 className="text-gray-600 text-sm">
            {lastMsgPerson} {chat?.lastMessage?.text}
          </h1>
          <h1 className="text-gray-500 text-sm">
            {getDateInRegualarFormat(chat?.lastMessage?.createdAt)}
          </h1>
          <div
            style={{
              position: "absolute",
              borderRadius: "50%",
              backgroundColor: "red",
              top: "-9px",
              right: "-9px",
              width: "24px",
              height: " 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "wheat",
              fontSize: "12px",
            }}
          >
            {chat.unreadMessages}
          </div>
        </div>
      );
    }
  };

  const getUserToShowOnLeftPanel = (otherUsers) => {
    return otherUsers?.filter(
      (userObj) =>
        (userObj?.name
          ?.split(" ")
          .join()
          .toLowerCase()
          .includes(searchKey?.toLowerCase()) &&
          searchKey) ||
        chats.filter((chat) =>
          chat?.members.map((m) => m?._id)?.includes(userObj?._id)
        ).length > 0
    );
  };

  const openNewChatWindowForSelectedUser = async (userObj) => {
    const currentChat = { ...userObj };
    currentChat.members = [userObj, user?._id];
    currentChat.unreadMessages = 0;
    currentChat._id = chats.filter(
      (chat) => chat.members.filter((m) => m?._id === userObj?._id).length > 0
    )[0]?._id;
    dispatch(setSelectedChat(currentChat));
    setMessages(await getAllMessages(currentChat?._id));
  };

  return (
    <>
      {loading && <Loader></Loader>}
      <Toaster></Toaster>

      {getUserToShowOnLeftPanel(otherUsers)?.map((userObj, index) => {
        return (
          <React.Fragment key={userObj?.name + index}>
            <div
              onClick={() => {
                if (userObj?._id === selectedUserId) {
                  return;
                }
                setSelectedUserId(userObj?._id);
                openNewChatWindowForSelectedUser(userObj);
              }}
              className="flex flex-col gap-3 mt-5"
              style={{
                boxShadow:
                  userObj?._id === selectedUserId ? "2px 2px 2px grey" : "",
                position: "relative",
              }}
            >
              <div
                style={{
                  padding: "7px",
                  borderRadius: "7px",
                  borderTopLeftRadius: "0px",
                  boxShadow: "1px 1px 1px lightgrey",
                }}
                className="bg-[#fff] hover:bg-[#ddd] flex gap-5 items-center hover:bg-sky-700 "
              >
                {userObj.profilePic && (
                  <img
                    src={userObj.profilePic}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                {!userObj.profilePic && (
                  <div className="bg-gray-400 rounded-full h-12 w-12 flex items-center justify-center relative">
                    <h1 className="uppercase text-xl font-semibold text-white">
                      {userObj.name[0]}
                    </h1>
                  </div>
                )}

                <div className="flex flex-col gap-">
                  <div className="flex gap-1">
                    <div className="relative flex gap-1 items-center ">
                      <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[`${searchKey}`]}
                        autoEscape={true}
                        textToHighlight={`${userObj?.name}`}
                      />
                    </div>
                  </div>
                  {getLastMsg(userObj)}
                </div>

                {!chats.filter((chat) =>
                  chat?.members.map((m) => m?._id)?.includes(userObj?._id)
                ).length > 0 && (
                  <button
                    id={userObj["_id"]}
                    onClick={createChat}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-auto"
                  >
                    Add To Chat
                  </button>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}

export default UsersList;

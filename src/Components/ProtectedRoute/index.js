import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setOtherUsers, setAllChats } from "../../Redux/Slices/users";
import axios from "axios";
import ShieldUserFillIcon from "remixicon-react/ShieldUserFillIcon";
import LogoutBoxLineIcon from "remixicon-react/LogoutBoxLineIcon";

const ProtectedRoute = (props) => {
  const isAuthenticated = localStorage.getItem("authenticated"); // Check if the token exists in the cookie
  const { REACT_APP_API_URL } = process.env;
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.user;
  });

  const getUser = async () => {
    try {
      const userUrl = `${REACT_APP_API_URL}/users`;
      const response = await axios.get(userUrl, { withCredentials: true });
      dispatch(setUser(response.data.user));
    } catch (err) {
      toast.error("Please Login");
      localStorage.setItem("authenticated", false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  const getOtherUsers = async () => {
    try {
      const userUrl = `${REACT_APP_API_URL}/users/allUserExceptCurrentUser`;
      const response = await axios.get(userUrl, { withCredentials: true });
      dispatch(setOtherUsers(response.data.users));
    } catch (err) {
      toast.error("Other users are  not available");
    }
  };

  const getAllChats = async () => {
    try {
      const chatUrl = `${REACT_APP_API_URL}/chat/get-all-chats`;
      const response = await axios.get(chatUrl, { withCredentials: true });
      dispatch(setAllChats(response.data.chats));
    } catch (err) {
      toast.error("Other users are  not available");
    }
  };

  useEffect(() => {
    (async () => {
      await getUser();
      await getOtherUsers();
      await getAllChats();
    })();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Toaster />

      <div className="h-screen w-screen bg-gray-100 p-2">
        {/* header */}
        <div className="flex justify-between p-5 bg-primary rounded">
          <div className="flex items-center gap-1">
            <i className="ri-message-3-line text-2xl text-white"></i>
            <h1
              className="text-white text-2xl uppercase font-bold cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              CHIT CHAT
            </h1>
          </div>
          <div className="flex gap-2 text-md items-center bg-white p-2 rounded">
            {user?.profilePic && (
              <img
                src={user?.profilePic}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            {!user?.profilePic && <ShieldUserFillIcon></ShieldUserFillIcon>}
            <h1
              className="underline text-primary cursor-pointer"
              onClick={() => {
                navigate("/profile");
              }}
            >
              {user?.name}
            </h1>
            <span
              onClick={() => {
                localStorage.removeItem("authenticated");
                navigate("/login");
              }}
            >
              <LogoutBoxLineIcon></LogoutBoxLineIcon>
            </span>
          </div>
        </div>

        {/* content (pages) */}
        <div className="py-5">{props.children}</div>
      </div>
    </>
  );
};

export default ProtectedRoute;

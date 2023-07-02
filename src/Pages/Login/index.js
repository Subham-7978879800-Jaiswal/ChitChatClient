import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Components/Loader";

function Login() {
  const [user, setUser] = React.useState({
    emailId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { REACT_APP_API_URL } = process.env;
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = JSON.parse(localStorage.getItem("authenticated")); // Check if the token exists in the cookie
    if(isAuthenticated){
      navigate("/")
    }
  },[])


  const handleLogin = async (event) => {
    event.preventDefault();

    const loginUrl = `${REACT_APP_API_URL}/users/login`;
    try {
      setLoading(true);
      await axios.post(loginUrl, user, { withCredentials: true });
      toast.success("Successfully logged in");
      localStorage.setItem("authenticated",JSON.stringify(true))
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const errMsg = err?.response?.data?.errorMessage; 
      if (errMsg !== {}) toast.error(errMsg.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {loading && <Loader></Loader>}
      <form onSubmit={handleLogin}>
        <div className="h-screen bg-primary flex items-center justify-center">
          <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96">
            <div className="flex gap-2">
              <i className="ri-message-3-line text-2xl text-primary"></i>
              <h1 className="text-2xl uppercase font-semibold text-primary">
                Chit Chat Login{" "}
              </h1>
            </div>
            <hr />

            <input
              type="email"
              value={user.emailId}
              onChange={(e) => setUser({ ...user, emailId: e.target.value })}
              placeholder="Enter your email"
            />
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
            />

            <button
              type="submit"
              className={
                user.emailId && user.password ? "contained-btn" : "disabled-btn"
              }
            >
              LOGIN
            </button>

            <Link to="/register" className="underline">
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;

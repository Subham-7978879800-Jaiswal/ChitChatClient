import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Register() {
  const [user, setUser] = React.useState({
    name: "",
    emailId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { REACT_APP_API_URL } = process.env;

  const navigate = useNavigate();


  const handleRegister = async (event) => {
    event.preventDefault();

    const registerUrl = `${REACT_APP_API_URL}/users/register`;
    try {
      setLoading(true);
      const response = await axios.post(registerUrl, user, {
        withCredentials: true,
      });
      toast.success(response?.data?.message);
      setTimeout(() => {navigate("/login")},2000) ;
    } catch (err) {
      toast.error(err?.response?.data?.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner></Spinner>}
      <Toaster />
      <form onSubmit={handleRegister}>
        <div className="h-screen bg-primary flex items-center justify-center">
          <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96">
            <div className="flex gap-2">
              <i className="ri-message-3-line text-2xl text-primary"></i>
              <h1 className="text-2xl uppercase font-semibold text-primary">
                Chit Chat register{" "}
              </h1>
            </div>
            <hr />
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Enter your name"
            />
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
                user.name && user.emailId && user.password
                  ? "contained-btn"
                  : "disabled-btn"
              }
            >
              Register
            </button>

            <Link to="/login" className="underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

export default Register;

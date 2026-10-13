import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      console.log("Login successful:", data);

      // Later, navigate to your home page here.
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };


  return (
    <div className="bg-black min-h-screen flex justify-center items-center">

      <div className="bg-gray-400 min-h-[400px] w-[500px] max-w-[90%] rounded-[20px] p-10">

        <h1 className="text-black text-2xl font-bold text-center mb-8">
          Login
        </h1>

        <form className="flex flex-col gap-4 "
          onSubmit={handleLogin}>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Username
            </label>
            <input
              className="bg-white p-3 rounded-md text-black outline-none focus:ring-2 focus:ring-black"
              type="text"
              value={username}
              onChange={(e) => {
                setusername(e.target.value);
              }}
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Password
            </label>

            <div className="flex items-center bg-white text-black rounded-md focus-within:ring-2 focus-within:ring-black">
              <input
                className="bg-transparent p-3 flex-1 min-w-0 outline-none"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-black text-white p-3 rounded-md mt-3 hover:bg-gray-800"
          >
            Login
          </button>
          <div>
            <p className='text-black'>New here? <Link to="/signin" className="font-bold underline">Sign Up</Link></p>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login
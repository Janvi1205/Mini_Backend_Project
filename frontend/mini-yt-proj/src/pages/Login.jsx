
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

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
        throw new Error(
          data.message || data.error || "Login failed"
        );
      }

      console.log("Login successful:", data);

      // Redirect after successful login
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="min-h-[400px] w-[500px] max-w-[90%] rounded-[20px] bg-gray-400 p-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-black">
          Login
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleLogin}
        >
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-black">
              Username
            </label>

            <input
              className="rounded-md bg-white p-3 text-black outline-none focus:ring-2 focus:ring-black"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-black">
              Password
            </label>

            <div className="flex items-center rounded-md bg-white text-black focus-within:ring-2 focus-within:ring-black">
              <input
                className="min-w-0 flex-1 bg-transparent p-3 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="rounded-md bg-red-200 p-3 text-sm text-red-900">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-md bg-black p-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Sign Up Link */}
          <p className="text-black">
            New here?{" "}
            <Link
              to="/signin"
              className="font-bold underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

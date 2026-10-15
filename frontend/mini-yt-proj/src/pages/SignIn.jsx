import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  const [fullname, setFullname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()

    setError("")
    setMessage("")

    if (!avatar) {
      setError("Please select a profile picture.")
      return
    }

    const formData = new FormData()       //as we have images and text both so we are using formdata instead of json.stringify

    formData.append("fullname", fullname)
    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("avatar", avatar)

    if (coverImage) {
      formData.append("coverImage", coverImage)
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/register`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Registration failed"
        )
      }

      setMessage("Account created successfully!")
      console.log("Registration response:", data)

    } catch (err) {
      setError(err.message || "Something went wrong")
      console.error("Registration error:", err)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black min-h-screen flex justify-center items-center p-4">

      <div className="bg-gray-400 w-[500px] max-w-full rounded-[20px] p-8">

        <h1 className="text-black text-2xl font-bold text-center mb-6">
          Create YourTube Account
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSignUp}
        >

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              className="bg-white text-black p-3 rounded-md outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="bg-white text-black p-3 rounded-md outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white text-black p-3 rounded-md outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="bg-white text-black p-3 rounded-md outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Profile Picture
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              required
              className="bg-white text-black p-2 rounded-md"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              className="bg-white text-black p-2 rounded-md"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>

          {error && (
            <p className="text-red-700 text-sm" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-800 text-sm" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 rounded-md mt-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-black text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-bold underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default SignIn
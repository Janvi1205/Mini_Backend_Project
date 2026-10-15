
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const[password,setPassword]=useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/users/current-user`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load profile"
                    );
                }

                // Your current-user controller returns { data: req.user }
                const currentUser = result.data;

                if (!currentUser) {
                    throw new Error("User details were not returned");
                }

                setUser(currentUser);
                setFullname(currentUser.fullname || "");
                setEmail(currentUser.email || "");
            } catch (err) {
                console.error("Failed to load edit profile:", err);
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const uploadAvatar = async () => {
        if (!avatar) {
            alert("Please upload a avatar");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", avatar);

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/users/avatar`,
            {
                method: "PATCH",
                credentials: "include",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Avatar update failed");
        }

        // Update the local user data with the new avatar
        setUser((prevUser) => ({
            ...prevUser,
            avatar: result.data?.avatar || prevUser.avatar,
        }));

        alert("Avatar upadated successfully!");
    };

    const updateCoverImage = async () => {
        if (!coverImage) {
            alert("Please select a cover image first");
            return;
        }

        const formData = new FormData();
        formData.append("coverImage", coverImage);

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/users/cover-image`,
            {
                method: "PATCH",
                credentials: "include",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Cover image update failed");
        }

        // Update the local user data with the new cover image
        setUser((prevUser) => ({
            ...prevUser,
            coverImage: result.data?.coverImage || prevUser.coverImage,
        }));

        alert("Cover image updated successfully!");
    };

    const updatePassword=async()=>{
        if(!password)
        {
            alert("New pass is required");
        }

        const response=await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/users/change-password`,
            {
                method:"PATCH",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    password:password
                })
            }
        )

        const result=await response.json();

        if(!result.ok)
        {
            throw new Error(
                result.message || "Failed to update the password"
            ); 
        }

        setPassword(response.data.password||"")

        alert("Password updated successfully!");
    }

    const updateAccountDetails = async () => {
        if (!fullname.trim() || !email.trim()) {
            throw new Error("Full name and email are required");
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/users/update-account`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullname: fullname.trim(),
                    email: email.trim(),
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to update account details"
            );
        }

        setUser(result.data);
        setFullname(result.data.fullname || "");
        setEmail(result.data.email || "");

        alert("Profile details updated successfully!");
    };

    const handleSaveChanges = async () => {
        try {
            setSaving(true);

            const detailsChanged =
                fullname.trim() !== (user?.fullname || "") ||
                email.trim() !== (user?.email || "");

            if (detailsChanged) {
                await updateAccountDetails();
            }

            if (avatar) {
                await uploadAvatar();
                setAvatar(null);
            }

            if (coverImage) {
                await updateCoverImage();
                setCoverImage(null);
            }
            if(password)
            {
                await updatePassword();
            }

            if (!detailsChanged && !avatar && !coverImage) {
                alert("No changes to save.");
            }


            // Navigate to Profile after successfully saving all changes
            navigate("/profile");
        } catch (error) {
            console.error("Profile update error:", error);
            alert(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 p-10 text-center text-white">
                Loading your profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 p-10 text-center text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                <h1 className="text-2xl font-bold text-red-500">
                    YourTube
                </h1>

                <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="rounded-full bg-gray-800 px-5 py-2 transition hover:bg-gray-700"
                >
                    Back to Profile
                </button>
            </nav>

            {/* Main Content */}
            <div className="mx-auto max-w-3xl px-4 py-10">
                {/* Page Heading */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold">Edit Profile</h2>
                    <p className="mt-2 text-gray-400">
                        Update your profile information and personalize your channel.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                    {/* Cover Image */}
                    <div className="relative">
                        <img
                            src={
                                coverImage
                                    ? URL.createObjectURL(coverImage) //This creates a temporary URL that allows the browser to display the selected local file without uploading it to the backend first.
                                    : user?.coverImage ||
                                    "https://placehold.co/1200x300/27272a/ffffff?text=YourTube"
                            }
                            alt="Cover preview"
                            className="h-48 w-full object-cover sm:h-60"
                        />

                        <label className="absolute bottom-4 right-4 cursor-pointer rounded-full bg-black/80 px-4 py-2 text-sm font-medium hover:bg-black">
                            Change Cover
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    setCoverImage(e.target.files[0])
                                }
                            />
                        </label>
                    </div>

                    {/* Avatar */}
                    <div className="border-b border-gray-800 px-6 py-7">
                        <h3 className="mb-5 text-lg font-semibold">
                            Profile Picture
                        </h3>

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <img
                                src={
                                    avatar
                                        ? URL.createObjectURL(avatar) //This creates a temporary URL that allows the browser to display the selected local file without uploading it to the backend first.
                                        : user?.avatar ||
                                        "https://placehold.co/128x128/27272a/ffffff?text=User"
                                }
                                alt="Avatar preview"
                                className="h-24 w-24 rounded-full border-4 border-gray-700 object-cover"
                            />

                            <div>
                                <p className="font-medium">Your Avatar</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Choose a clear image for your profile picture.
                                </p>

                                <label className="mt-3 inline-block cursor-pointer rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium transition hover:bg-gray-800">
                                    Upload Picture
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            setAvatar(e.target.files[0])
                                        }
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-5 p-6">
                        <h3 className="text-lg font-semibold">
                            Profile Information
                        </h3>

                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={fullname}
                                onChange={(e) =>
                                    setFullname(e.target.value)
                                }
                                placeholder="Enter your full name"
                                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Username
                            </label>

                            <input
                                type="text"
                                value={user?.username || ""}
                                readOnly
                                placeholder="Username"
                                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-gray-400 outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="rounded-lg border border-gray-700 px-6 py-3 font-medium transition hover:bg-gray-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
                    <h3 className="text-lg font-semibold">
                        Account Security
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                        Want to update your password? Manage your account security here.
                    </p>

                    <button
                        type="button"
                        className="mt-4 rounded-lg border border-gray-700 px-5 py-2.5 font-medium transition hover:bg-gray-800"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;

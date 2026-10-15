import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentUser = async () => {
            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/users/current-user`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                console.log("HTTP STATUS:", response.status);

                const result = await response.json();

                console.log("ACTUAL RESPONSE BODY:", JSON.stringify(result, null, 2));

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to fetch user profile"
                    );
                }

                // Handle common API response structures
                const currentUser =
                    result?.data?.user ??
                    result?.data ??
                    result?.user ??
                    null;

                console.log("EXTRACTED USER:", currentUser);

                if (!currentUser) {
                    throw new Error(
                        "API returned no user object. Check the current-user controller response."
                    );
                }

                setUser(currentUser);

            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 p-10 text-center text-white">
                Loading profile...
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

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-950 p-10 text-center text-white">
                No user information found.
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

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="rounded-full bg-gray-800 px-4 py-2 hover:bg-gray-700"
                    >
                        Home
                    </button>

                    <button
                        type="button"
                        className="rounded-full bg-red-600 px-4 py-2 hover:bg-red-700"
                        onClick={() => navigate("/edit-profile")}
                        
                    >
                        Edit Profile
                    </button>
                </div>
            </nav>

            {/* Profile Cover */}
            <div className="mx-auto max-w-5xl px-4 pt-8">
                <div className="h-48 overflow-hidden rounded-2xl bg-gradient-to-r from-red-900 via-gray-800 to-gray-700 sm:h-64">
                    {user.coverImage && (
                        <img
                            src={user.coverImage}
                            alt="Cover"
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Profile Details */}
            <div className="mx-auto max-w-5xl px-4 pb-8">
                <div className="relative px-4">
                    <div className="-mt-16 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                        <img
                            src={
                                user.avatar ||
                                "https://placehold.co/128x128/27272a/ffffff?text=User"
                            }
                            alt="Profile"
                            className="h-32 w-32 rounded-full border-4 border-gray-950 bg-gray-800 object-cover"
                        />

                        <div className="flex-1 text-center sm:pb-2 sm:text-left">
                            <h2 className="text-3xl font-bold">
                                {user.fullname}
                            </h2>

                            <p className="mt-1 text-gray-400">
                                @{user.username}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="rounded-full bg-white px-5 py-2 font-semibold text-black hover:bg-gray-200"
                            onClick={() => navigate("/edit-profile")}
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* User Information */}
                    <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
                        <h3 className="mb-5 text-xl font-semibold">
                            Account Information
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Full Name
                                </p>
                                <p className="mt-1 text-lg">
                                    {user.fullname}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">
                                    Username
                                </p>
                                <p className="mt-1 text-lg">
                                    @{user.username}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">
                                    Email Address
                                </p>
                                <p className="mt-1 text-lg">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Channel Section */}
                    <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
                        <h3 className="text-xl font-semibold">
                            Your Channel
                        </h3>

                        <p className="mt-2 text-gray-400">
                            Your videos and channel information will appear here.
                        </p>

                        <button
                            type="button"
                            className="mt-4 rounded-full bg-red-600 px-5 py-2 font-medium hover:bg-red-700"
                        >
                            View Channel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

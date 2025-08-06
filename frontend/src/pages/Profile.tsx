import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/Skeleton";
import { BACKEND_URL } from "../config/utils";
import { X, Youtube } from "lucide-react";

interface Blog {
    _id: string;
    title: string;
    content: string;
    publishedDate: string;
    tags: string[];
    author: {
        _id: string;
        name: string;
    };
}

interface UserProfile {
    _id: string;
    name: string;
}

// A custom hook to fetch a single user's blogs
const useUserBlogs = (userId: string | undefined) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setError("User ID not found.");
            return;
        }
        
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/signin');
                    return;
                }

                // Fetch blogs for a specific user ID
                const response = await axios.get<{ posts: Blog[] }>(
                    `${BACKEND_URL}/api/v1/blog/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.posts.length > 0) {
                    // Assuming the author details are consistent across all posts for that author
                    setUser(response.data.posts[0].author); 
                    setBlogs(response.data.posts);
                } else {
                    // If no blogs are found, we still want to show the user's profile
                    // So, we'll try to fetch user details separately if no blogs are returned
                    try {
                        const userResponse = await axios.get(`${BACKEND_URL}/api/v1/user/get/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setUser(userResponse.data.user);
                        setBlogs([]); // No blogs found
                    } catch (userError) {
                        console.error("Error fetching user details:", userError);
                        setError("User not found or failed to fetch user details.");
                    }
                }

                setLoading(false);
            } catch (e: any) {
                console.error("Error fetching user blogs:", e);
                if (e.response && e.response.status === 403) {
                    setError("Session expired. Please sign in again.");
                    localStorage.removeItem('token');
                    navigate('/signin');
                } else if (e.response && e.response.status === 404) {
                    setError("User not found.");
                } else {
                    setError("Failed to fetch user blogs. Please try again.");
                }
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [userId, navigate]);

    return { loading, blogs, user, error };
};

export const Profile = () => {
    const { userId } = useParams<{ userId: string }>();
    const { loading, blogs, user, error } = useUserBlogs(userId);

    const getFirstInitial = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-96">
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Appbar />
                <div className="text-center mt-20 text-red-500 font-bold text-xl">
                    {error}
                </div>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div>
                <Appbar />
                <div className="text-center mt-20 text-gray-500 font-bold text-xl">
                    User not found.
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6 sm:p-10 lg:p-16">
                <div className="container mx-auto max-w-6xl">
                    {/* User Profile Header Section */}
                    <div className="flex items-center space-x-6 mb-12 bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-200">
                        {/* Avatar */}
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold bg-indigo-600 shadow-xl border-4 border-indigo-200">
                            {getFirstInitial(user.name)}
                        </div>

                        {/* User Details */}
                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                                {user.name}
                            </h1>
                            {/* Social Media Links Placeholder */}
                            <div className="flex items-center space-x-4 text-gray-500">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                                    <X size={24} />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                                    <Youtube size={24} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Blog Posts Section */}
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        {user.name}'s Blogs
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.length > 0 ? (
                            blogs.map(blog => 
                                <BlogCard 
                                    key={blog._id}
                                    id={blog._id}
                                    authorName={blog.author.name || "Anonymous"}
                                    title={blog.title}
                                    description={blog.content}
                                    publishedDate={blog.publishedDate} 
                                    tags={blog.tags}
                                    
                                />
                            )
                        ) : (
                            <p className="text-gray-500 text-lg italic">
                                This user hasn't published any blogs yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Avatar } from "../components/BlogCard";
import DOMPurify from 'dompurify';
import { BACKEND_URL } from "../config/utils";
import { BlogSkeleton } from "../components/Skeleton";

interface Blog {
    _id: string;
    title: string;
    content: string;
    publishedDate: string;
    description:string,
    tags: string[];
    author: {
        name: string;
    };
}

// A custom hook to fetch a single blog post
const useBlog = (id: string) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // We don't need a token here as the API route is public
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/get/${id}`);
                setBlog(response.data.post);
                setLoading(false);
            } catch (e) {
                console.error("Error fetching blog post:", e);
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    return { loading, blog };
};

export const BlogDetails = () => {
    const { id } = useParams<{ id: string }>(); // Get the ID from the URL
    const { loading, blog } = useBlog(id || "");

    if (loading || !blog) {
        return (
            <div>
                <Appbar />
                <BlogSkeleton />
            </div>
        );
    }
    
    // Sanitize the HTML content before rendering
    const sanitizedContent = DOMPurify.sanitize(blog.content);

    return (
        <div>
            <Appbar />
            <div className="flex justify-center p-4">
                <div className="w-full lg:w-2/3">
                    <div className="p-8 border-b-2 border-slate-200">
                        <div className="text-4xl font-extrabold break-words">
                            {blog.title}
                        </div>
                        <div className="text-4xl font-extrabold break-words">
                            {blog.description}
                        </div>
                        <div className="text-slate-500 text-sm mt-2">
                            Published on {new Date(blog.publishedDate).toISOString().split('T')[0]}
                        </div>
                        <div className="mt-6">
                            <div className="flex items-center">
                                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                                <div className="ml-4">
                                    <div className="text-lg font-semibold">
                                        {blog.author.name || "Anonymous"}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Author of the post
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <div 
                            className="text-lg leading-relaxed break-words" 
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
                        />
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {blog.tags.map(tag => (
                                    <span key={tag} className="bg-blue-100 text-blue-800 
                                        text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

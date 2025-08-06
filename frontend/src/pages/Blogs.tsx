import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { ChevronRight,ChevronLeft } from "lucide-react";
import { useBlogs } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BlogSkeleton } from "../components/Skeleton";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/utils";

export const Blogs = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const {loading, blogs,fetchBlogs,totalBlogs,BLOGS_PER_PAGE
        , error
    }= useBlogs(currentPage);

    // have states for modal also, 

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/signin');
        }
    }, [navigate]);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

  if (loading) {
      return (
          <div>
              <Appbar />
              
              <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(BLOGS_PER_PAGE)].map((_, i) => (
                            <BlogSkeleton key={i} />
                        ))}
                    </div>
              </div>
          </div>
      );
  }
    
      // Display an error message if the API call failed
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

  return (
    <div>
        <Appbar />
        <h3 className="text-center text-[50px] m-4 text-bold">
        📚 Explore Blogs
            </h3>
        <div className="flex justify-center">
            {/* Responsive grid for the blog cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => 
                        <BlogCard 
                        //@ts-ignore
                            key={blog._id}
                            //@ts-ignore
                            id={blog._id}
                            authorName={blog.author.name || "Anonymous"}
                            title={blog.title}
                            description={blog.description}
                            publishedDate={blog.publishedDate} 
                            tags={blog.tags} 
                        />
                    )}
                </div>
        </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center my-8 gap-4 items-center">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200
                        ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="text-gray-700 text-lg font-bold">
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200
                        ${currentPage >= totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

    </div>
  )
}
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"

import { useBlogs } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BlogSkeleton } from "../components/Skeleton";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/utils";

export const Blogs = () => {
    const navigate = useNavigate();
    const {loading, blogs,fetchBlogs}= useBlogs();

    // have states for modal also, 

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/signin');
        }
    }, [navigate]);


  if (loading) {
      return (
          <div>
              <Appbar />
              <div className="flex justify-center">
                  <div className="w-screen sm:w-2/3 lg:w-1/2 items-center">
                      <BlogSkeleton />
                      <BlogSkeleton />
                      <BlogSkeleton />
                  </div>
              </div>
          </div>
      );
  }
    

  return (
    <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="w-screen sm:w-2/3 lg:w-1/2 items-center">
                {blogs.map(blog=> <BlogCard 
                    //@ts-ignore
                    key={blog._id}
                    //@ts-ignore
                    id={blog._id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    description={blog.description}
                    publishedDate={blog.publishedDate} 
                    tags={blog.tags} />)}
            </div>
        </div>


    </div>
  )
}
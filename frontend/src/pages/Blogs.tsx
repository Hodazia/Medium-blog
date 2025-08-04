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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentTag, setCurrentTag] = useState<string>('');
    const [tags, setTags] = useState([]); // array of strings, 

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/signin');
        }
    }, [navigate]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleTagInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTag(e.target.value);
    };

    //@ts-ignore
    const handleAddTag = (e) => {
        if (e.key === 'Enter' && currentTag.trim() !== '' && tags.length < 3) {
            //@ts-ignore
            setTags([...tags, currentTag.trim()]);  // keep the previous tag and add a new one
            setCurrentTag('');
            e.preventDefault(); // Prevents form submission
        }
    };

    //@ts-ignore
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // submit the modal post,
    const handlePostBlog = async () => {
      try {
          await axios.post(`${BACKEND_URL}/api/v1/blog/create`, {
              title,
              content,
              tags
          }, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          });
          // On success, close the modal, clear the form, and re-fetch blogs
          closeModal();
          setTitle('');
          setContent('');
          // once u submit the modal blog , fetchBlog() run it 
          /*which will update the blogs, since it will re-run the setBlogs(response.data.blogs) 
          
          
          */
          fetchBlogs();
      } catch (e) {
          console.error("Error posting blog:", e);
          // Handle error, e.g., show an error message to the user
      }
  };

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
        <Appbar onNewBlogClick={openModal}/>
        <div className="flex justify-center">
            <div className="w-screen sm:w-2/3 lg:w-1/2 items-center">
                {blogs.map(blog=> <BlogCard 
                //@ts-ignore
                    id={blog._id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.publishedDate} 
                    tags={blog.tags} />)}
            </div>
        </div>

        {/* Modal for creating a new blog post */}
        {isModalOpen && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center p-4">
                    {/* Modal Content */}
                    <div className="relative w-full max-w-md transform
                     rounded-2xl bg-gray-800 p-6 text-left shadow-xl 
                    transition-all duration-300 scale-100 opacity-100">
                        <h3 className="text-lg font-medium leading-6 text-white">
                            Create a New Blog Post
                        </h3>
                        <div className="mt-4 space-y-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Content"
                                rows={8}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                            {/* Tags Section */}
                            <div>
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={handleTagInput}
                                    onKeyDown={handleAddTag}
                                    placeholder="Add a tag (max 3, press Enter)"
                                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={tags.length >= 6}
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <span key={tag} className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                            {tag}
                                            <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-xs focus:outline-none">
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none"
                                onClick={handlePostBlog}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  )
}
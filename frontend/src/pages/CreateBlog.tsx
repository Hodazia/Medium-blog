import { useState } from 'react';
import ReactQuill from 'react-quill-new'; // Import the compatible package
import 'react-quill-new/dist/quill.snow.css'; // Import the Quill stylesheet
import axios from 'axios';
import { BACKEND_URL } from '../config/utils';
import { useNavigate } from 'react-router-dom';
import { Appbar } from "../components/Appbar"; 


/*
so when we click on new post, this blogs component will be unmounted
and the /blog/create component will come and when we save the DATA THERE, then
we get redirected to this page only and the useBlogs hook refetches the 
data again

*/
export const BlogEditor = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [currentTag, setCurrentTag] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [isPosting, setIsPosting] = useState(false);

    // Quill modules for the toolbar
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTag(e.target.value);
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim() !== '' && tags.length < 3) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
            e.preventDefault(); 
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handlePostBlog = async () => {
        setIsPosting(true);
        try {
            await axios.post(`${BACKEND_URL}/api/v1/blog/create`, {
                title,
                content,
                description,
                tags
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            navigate('/blogs'); // Navigate back to the main blogs page
        } catch (e) {
            console.error("Error posting blog:", e);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div>
            <Appbar />
            <div className="flex flex-col items-center p-4">
                <div className="w-full sm:w-2/3 lg:w-1/2">
                    <div className='w-full text-center text-xl mb-2'
                    onClick={() => navigate("/blogs")}
                    >Back to the Blogs Page</div>
                    <h1 className="text-3xl font-bold mb-4">Create a New Post</h1>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full px-4 py-2 mb-4 text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full px-4 py-2 mb-4 text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    
                    <ReactQuill 
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        placeholder="Start writing your blog post here..."
                        className="h-80 mb-12"
                    />
                    {/* Tags Section */}
                    <div className="mt-4">
                        <input
                            type="text"
                            value={currentTag}
                            onChange={handleTagInput}
                            onKeyDown={handleAddTag}
                            placeholder="Add a tag (max 3, press Enter)"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={tags.length >= 3}
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
                    <button
                        onClick={handlePostBlog}
                        disabled={isPosting}
                        className="mt-6 w-full text-white bg-green-700 hover:bg-green-800 
                        focus:outline-none focus:ring-4 focus:ring-green-300 font-medium 
                        rounded-full text-sm px-5 py-2.5 text-center disabled:opacity-50"
                    >
                        {isPosting ? 'Posting...' : 'Create Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

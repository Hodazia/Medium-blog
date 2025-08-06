import { Link } from "react-router-dom";
import { MessageCircle, Heart, User, Sparkle } from "lucide-react";
import parse from "html-react-parser"

interface BlogCardProps {
    id: string;
    authorName: string;
    title: string;
    description: string;
    publishedDate: string;
    tags: string[];
}

export const BlogCard = ({
    id,
    authorName,
    title,
    description,
    publishedDate,
    tags,
}: BlogCardProps) => {
    // Helper function to format the date string
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        // Ensure the Link takes full height and width of its grid cell
        // The w-full h-full here ensures it fills the grid cell, then the inner div sets the fixed size
        <Link to={`/blog/${id}`} className="block w-full h-full flex justify-center"> {/* Added flex justify-center for centering in grid */}
            <div className="relative rounded-3xl shadow-lg 
                            transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] 
                            bg-white border border-gray-200 
                            w-80 h-[420px] overflow-hidden flex flex-col"> {/* Fixed width and height, overflow hidden */}
                
                {/* Header Section (1% Better) */}
                <div className="bg-[#2a2d48] text-white p-4 sm:p-6 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkle size={20} className="text-[#a5b4fc]" />
                        <h3 className="text-xl font-bold">1% Better</h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-tight">
                        Weekly content on how to improve little by little every single day
                    </p>
                </div>

                {/* Main Content Section - flex-grow to take available space */}
                <div className="p-4 sm:p-6 space-y-4 flex-grow flex flex-col overflow-hidden"> {/* Added overflow-hidden here too */}
                    {/* Top Row: Date and Icons */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2 flex-shrink-0">
                        <span>{formatDate(publishedDate)}</span>
                        <div className="flex items-center gap-3">
                            <MessageCircle size={18} className="hover:text-indigo-500 transition-colors cursor-pointer" />
                            <Heart size={18} className="hover:text-red-500 transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Blog Title - Truncate to 2 lines */}
                    <h2 className="text-2xl font-bold text-gray-900 leading-snug line-clamp-2 flex-shrink-0">
                        {title}
                    </h2>

                    {/* Blog Description - Truncate to 3 lines */}
                    {/* The line-clamp will truncate text, and overflow-hidden on parent will clip images/excess */}
                    <p className="text-gray-600 line-clamp-3 flex-grow">
                        {parse(description)}
                    </p>

                    {/* Footer Section: Author and Tags/Badges */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 flex-shrink-0 mt-auto">
                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center">
                                <User size={18} className="text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {authorName}
                            </span>
                        </div>


                    </div>
                </div>
            </div>
        </Link>
    );
};

export function Avatar({name, size="small"}: {name:string, size?:"small"| "big"}){
    return  <div className={`relative inline-flex items-center justify-center ${size==="small"? "w-6 h-6":"w-10 h-10"} overflow-hidden bg-gray-600 rounded-full`}>
    <span className={`font-medium uppercase text-gray-200 ${size==="small"? "text-s": "font-bold text-2xl"}`}>{name[0]}</span>
</div>
}
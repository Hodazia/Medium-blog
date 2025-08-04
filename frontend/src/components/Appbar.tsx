import { Link } from "react-router-dom"
import {Avatar}  from "./BlogCard"

interface onClickProps {
  onNewBlogClick?: () => void
}

// accept an onClick props from the parent to open/close down a modal
export const Appbar = ({ onNewBlogClick } : onClickProps) => {
  return (
    <div className="border-b flex justify-between px-10 py-3">
      <Link to={"/blogs"} className="flex flex-col justify-center cursor-pointer">
        Medium
      </Link>
      <div>
          <button type="button" className="mr-4 text-white bg-green-700
           hover:bg-green-800 focus:outline-none focus:ring-4 
           focus:ring-green-300 font-medium rounded-full text-sm 
           px-5 py-2.5 text-center me-2 mb-2"
           onClick={onNewBlogClick}>New
           </button>
        <Avatar size="big" name="adarsh"/>
      </div>
    </div>
  )
}
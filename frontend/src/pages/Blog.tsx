
import { Fullblog } from "../components/FullBlog";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BlogSkeleton } from "../components/Skeleton";

// an id will be passed for this component to open up on a new page
export const Blog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {loading, blog} = useBlog({
    id : Number(id)
  });

 useEffect(()=>{
      if(!localStorage.getItem('token')){
        navigate('/signin')
      }
    })

  if(loading || !blog ){
    return <div className="flex justify-center">
      <div className="w-full max-w-screen-lg">
      <BlogSkeleton/>
      <BlogSkeleton/>
      <BlogSkeleton/>
      <BlogSkeleton/>
      <BlogSkeleton/>
      </div>
    </div>
  }
  
  return (
    <div>
      <Fullblog blog={blog}/>
    </div> 
  )
}
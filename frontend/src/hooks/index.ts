import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config/utils";

// id? Blogid or authorid?
export interface Blog{
    "content": string,
    "title":   string,
    "id":      string,
    "publishedDate":string,
    "author": {
    "name":   string
    },
    "tags":string[]
}

export const useBlog= ({ id }: {id:string})=>{
    const [loading, setLoading]= useState(true);
    const [blog, setBlog]= useState<Blog>();
    useEffect(()=>{
       axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
       })
        .then(response => {
            console.log(response);
            setBlog(response.data.post);
            setLoading(false);
        })     
    },[id])

    return {
        loading,
        blog
    }
}


/*
response.data.blogs = [
        {
            "id": "6890c9fab9069368052bb392",
            "title": "yo yo",
            "content": "yo yo honey singh",
            "author": {
                "name": "John DOE 2002"
            }
        },
        {
            "id": "6890fa98639f2b414da24eee",
            "title": "qatal song",
            "content": "song by guru randhawa",
            "author": {
                "name": "John DOE 2002"
            }
        },
        {
            "id": "68910495639f2b414da24f07",
            "title": "songs about now",
            "content": "dilbar\ncoldplay",
            "author": {
                "name": "John DOE 2002"
            }
        }
    ]

*/
export const useBlogs = () => {
    const [loading, setLoading]= useState(true);
    const [blogs, setBlogs]= useState<Blog[]>([]);
    // array of Blog objects 

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setBlogs(response.data.blogs);
        } catch (e) {
            console.error("Failed to fetch blogs:", e);
            // Handle error, e.g., show a toast notification
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    },    [])

    return {
        loading,
        blogs,
        fetchBlogs
    }
}
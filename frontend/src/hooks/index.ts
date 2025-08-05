import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config/utils";

// id? Blogid or authorid?
export interface Blog{
    "description": string,
    "title":   string,
    "id":      string,
    "publishedDate":string,
    "author": {
    "name":   string
    },
    "content":string,
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
            "description": "COLDplay",
            content:"ksdfbvndb kdlfn"
            "author": {
                "name": "John DOE 2002",
                "id":""
                            },
            publishedDate:{},
            tags:["st","svd"]
        }
    ]
{
    "blogs": [
        {
            "_id": "6891c85a9e9c9ac784cea3c1",
            "title": "INDIA WON THE LAST MATCH",
            "content": "<p>I am all well </p>",
            "description": "Cricket as u know is it",
            "author": {
                "_id": "6891aeecb59c03f3d9a27c54",
                "name": "JOHN CENA"
            },
            "tags": [
                "CRICKET",
                "SPORTS"
            ],
            "publishedDate": "2025-08-05T09:01:14.633Z"
        }
    ]
}
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
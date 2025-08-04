import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config/utils";
import axios from "axios";
import React from "react";


export const Auth = ({type}:{type:"signin" | "signup"}) => {
    const navigate = useNavigate();
    const [posts,setposts] = useState({
        "email":"",
        "password":"",
        "name":""
    })

    const sendRequest = async () => {
        // Send the request to the backend API.
        try {
            //@ts-ignore
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type=="signin"? "signin" : "signup"}`,posts);
            
            // Log the response and store the token in local storage.
            console.log("Response is , " , response);
            const token  = response.data.token;
            console.log("JWT TOKEN ", token)
            localStorage.setItem("token",token);

            // Redirect the user to the blogs page.
            navigate("/blogs")

        }
        catch(err)
        {
            console.log("Error is ", err);
        }
    }
    return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <div className="p-8 md:p-12 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md mx-4">
                <div className="text-center px-4">
                    <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                        {type === "signin" ? "Sign in to your account" : "Create an account"}
                    </div>
                    <div className="text-sm text-gray-500">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-1 text-indigo-600 underline hover:text-indigo-800 transition-colors" 
                              to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="mt-8 space-y-4">
                    <LabelledInput 
                        label="Email" 
                        placeholder="johndoe@gmail.com" 
                        onChange={(e)=>{
                            setposts({
                                ...posts,
                                email: e.target.value,
                            })
                        }}
                    />
                    {type === "signup" ? 
                        <LabelledInput 
                            label="Name" 
                            placeholder="John Doe" 
                            onChange={(e)=>{
                                setposts({
                                    ...posts,
                                    name: e.target.value,
                                })
                            }}
                        />
                    : null}
                    <LabelledInput 
                        label="Password" 
                        type="password" 
                        placeholder="john#123" 
                        onChange={(e)=>{
                            setposts({
                                ...posts,
                                password: e.target.value,
                            })
                        }}
                    />

                    <button 
                        onClick={sendRequest} 
                        type="button"
                        className="mt-6 w-full text-white bg-indigo-600 hover:bg-indigo-700 
                                   focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium
                                   rounded-lg text-sm px-5 py-2.5 transition-colors duration-200">
                        {type === "signup" ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Helper component for styled form inputs.
interface labelledinput {
    label:string,
    placeholder:string,
    type?: string,
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({label,placeholder,type,onChange}:labelledinput) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            <input 
                type={type || "text"} 
                placeholder={placeholder} 
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 
                           transition duration-200 ease-in-out"
            />
        </div>
    )
}

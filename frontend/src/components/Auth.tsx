import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config/utils";
import axios from "axios";
export const Auth = ({type}:{type:"signin" | "signup"}) => {
    const navigate = useNavigate();
    const [posts,setposts] = useState({
        "email":"",
        "password":"",
        "name":""
    })

    const sendRequest = async () => {
        // send the request to backend
        try {{
            //@ts-ignore
            const response = await axios.post(`${BACKEND_URL}/api/v1/${type=="signin"? "signin" : "signup"}`,posts);
            
            // check for the response
            console.log("Response is , " , response);
            const token  = response.data.token;
            // check if u have received the tokens or not
            console.log("JWT TOKEN ", token)
            localStorage.setItem("token",token);
            navigate("/blogs")

        }}
        catch(err)
        {
            console.log("Error is ", err);
        }
    }
    return (
        <>
         <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div >
                <div className="px-10">
                    <div className="text-3xl font-extrabold " >
                        Create an account  
                    </div>
                    <div className="text-slate-400">
                        {type==="signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type==="signin"?"/signup":"/signin"} >
                        {type === "signin"? "Sign up": "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="pt-5">
                    <LabelledInput label="Email" placeholder="johndoe@gmail.com" onChange={(e)=>{
                        setposts({
                            ...posts,
                            email: e.target.value,

                        })
                    }}/>
                    {type === "signup" ? <LabelledInput label="name" placeholder="John Doe" onChange={(e)=>{
                        setposts({
                            ...posts,
                            name: e.target.value,

                        })
                    }}/>:null}
                    <LabelledInput label="password" type="password" placeholder="john#123" onChange={(e)=>{
                        setposts({
                            ...posts,
                            password: e.target.value,
                        })
                    }}/>

                    <button onClick={sendRequest} type="button"
                     className="mt-8 text-white w-full bg-gray-800 hover:bg-gray-900 
                     focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium
                      rounded-lg text-sm px-5 py-2.5 ">{type === "signup" ? "Sign up": "Sign In"}</button>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}



interface labelledinput {
    label:string,
    placeholder:string,
    type? :string,
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({label,placeholder,type,onChange}:labelledinput) {
    return (
    <div className="mt-3">
        <label className="">{label}</label>
        <input type={type || "text"} placeholder={placeholder} onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900"/>

    </div>
    )
}
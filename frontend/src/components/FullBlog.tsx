
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

interface Blog{
    "content": string,
    "title":   string,
    "id":      number,
    "author": {
    "name":   string
    }
}
export const Fullblog = ({ blog } : { blog: Blog }) => {
  
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 pt-12 w-full max-w-screen-xl">
          <div className="col-span-8">
            <div className="text-5xl font-extrabold">
              {blog.title}
            </div>
            <div className="text-slate-400 pt-2">
              posted on 2nd Dec. 2023
            </div>
            <div className="pt-2">
              {blog.content}
            </div>
          </div>
          <div className="col-span-4">
            <div className="text-slate-600 text-lg">
              Author
            </div>
            <div className="flex ">
              <div className="pr-4 flex flex-col justify-center">
                <Avatar size="big" name={blog.author.name || "Anonymous"}/>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                    Random catch about the author's ability to grab the users attention 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
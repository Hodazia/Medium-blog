import express from 'express'
import { Request,Response } from 'express';
import { Express } from 'express';
import { createBlogInput,updateBlogInput } from '../config/validation';
import { blogmodel } from '../config/db';
import { authMiddleware } from '../config/middleware';
import { usermodel } from '../config/db';

//@ts-ignore
const JWT_SECRET : string = process.env.JWT_SECRET;
const router = express.Router();

// CORRECT
router.post("/create", authMiddleware, async (req:Request,res:Response) => {
    // create a blog router,
    //@ts-ignore
    const userID = req.userId; // it contains the USERID of the user
    // send the title, content, get the id from req.userId,

    console.log("User id ," ,userID);
    const {success,error} = createBlogInput.safeParse(req.body);
    if(!success)
    {
        return res.status(411).json({
            "message":"Invalid credentials"
        })
    }

    try {
        // Check if user already exists

        // the published Date is automatically handled as Date.now as default
        // publishedDate: Date.now(); //for every create POST request
        const blog = await blogmodel.create({
            title:req.body.title,
            content:req.body.content,
            description:req.body.description, // added the description a short one
            author:userID,
            tags:req.body.tags  // an array of strings,
        })

        // what is blog.id ?  it will be the id of the blogs
        return res.status(201).json({
            id: blog.id
        });

    }
    catch(e)
    {
        console.error("Error creating blog post:", e); 
        return res.status(500).json({
            "message":"Error sending the posts"
        })
    }

})

/*
update the content only, not the tags,
*/
//CORRECT
router.put('/update/:id', authMiddleware, async(req:Request, res:Response)=>{
	const id = req.params.id;   // the userid 
	const body = req.body;
	const {success}= updateBlogInput.safeParse(body);
    if(!success)
    {
        return res.status(411).json({
            "message":"Invalid credentials"
        })
    }
	try {
        // update the blogs
        const post = await blogmodel.findByIdAndUpdate(id, {
            title: body.title,
            content: body.content
        }, { new: true }); // 'new: true' returns the updated document

        if (!post) {
            return res.status(404).json({
                msg: "Post not found"
            });
        }
        
        return res.json({
            msg:"updated",
            post
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Error updating the post"
        });
    }
})

// here u can have two options
/*
either fetch all blogs from the DB, 
*/

//CORRECT ROUTE
router.get('/bulk', authMiddleware,  async(req:Request, res:Response)=>{
	// @ts-ignore
    const userID = req.userId;
    try {
        // 1. Get pagination parameters from query string with defaults.
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        // 2. Calculate the number of documents to skip.
        const skip = (page - 1) * limit;

        // 3. Fetch the total count of all blogs.
        const totalPosts = await blogmodel.countDocuments();

        // 4. Fetch the blogs for the current page.
        const blogs = await blogmodel.find({})
            .skip(skip) // Skip the documents that are on previous pages.
            .limit(limit) // Limit the number of documents to the page size.
            .populate('author', 'name')
            .select('title content description publishedDate tags author');

        return res.json({
            posts: blogs,
            totalPosts: totalPosts
        });

    }
    catch (error) {
        console.error("Error fetching all blog posts:", error);
        return res.status(411).json({
            msg: "Error while getting all posts"
        });
    }
	
})

/*
RESPONSE FOR THE BELOWE API
{
    "post": {
        "_id": "6891ca279e9c9ac784cea3ca",
        "title": "FOOTBALL UCL",
        "content": "<p>so Real madrid are champions once again as they usually are!</p>",
        "description": "REAL MADRID HALA MADRID",
        "author": {
            "_id": "6891aeecb59c03f3d9a27c54",
            "name": "JOHN CENA"
        },
        "tags": [
            "FOOTBALL",
            "SPORTS"
        ],
        "publishedDate": "2025-08-05T09:08:55.815Z",
        "__v": 0
    }
}

*/
router.get('/get/:id', async(req:Request, res:Response)=>{
	const id = req.params.id;
	try {
		const post = await blogmodel.findById(id).populate('author', 'name');
        
        if (!post) {
            return res.status(404).json({
                msg: "Post not found"
            });
        }

		return res.json({
			post
		});
	} catch (error) {
		return res.status(500).json({
			msg: "Error fetching the post"
		});
	}
})
// Fetch all blogs of a specific author
/*
RESPONSE 


    "posts": [
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
            "publishedDate": "2025-08-05T09:01:14.633Z",
            "__v": 0
        },
        {
            "_id": "6891ca279e9c9ac784cea3ca",
            "title": "FOOTBALL UCL",
            "content": "<p>so Real madrid are champions once again as they usually are!</p>",
            "description": "REAL MADRID HALA MADRID",
            "author": {
                "_id": "6891aeecb59c03f3d9a27c54",
                "name": "JOHN CENA"
            },
            "tags": [
                "FOOTBALL",
                "SPORTS"
            ],
            "publishedDate": "2025-08-05T09:08:55.815Z",
            "__v": 0
        },

*/
router.get('/user/:authorId', authMiddleware, async (req, res) => {
    // Extract the authorId from the URL parameters
    const authorId = req.params.authorId;

    try {
        // Find all blog posts where the 'author' field matches the authorId.
        // The .populate() method is crucial here; it replaces the author's
        // ID with the actual user object, so we can access their name.
        const posts = await blogmodel.find({ author: authorId })
                                     .populate('author', 'name');

        if (!posts || posts.length === 0) {
            // If no posts are found, return a 404 Not Found error
            return res.status(404).json({
                message: "No blogs found for this author."
            });
        }

        // Return the list of posts as a JSON response
        return res.status(200).json({
            posts: posts
        });
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        // Return a 500 Internal Server Error for any database or server issues
        return res.status(500).json({
            message: "Error fetching the author's blogs."
        });
    }
});
export default router;

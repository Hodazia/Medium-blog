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
            author:userID,
            tags:req.body.tags  // an array of strings,
        })

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
        const blogs = await blogmodel.find({})
            .populate('author', 'name') // Use Mongoose populate for efficiency
            .select('title content publishedDate tags author'); // Select all necessary fields

        return res.json({
            blogs
        });

    } catch (error) {
        console.error("Error fetching all blog posts:", error);
        return res.status(411).json({
            msg: "Error while getting all posts"
        });
    }
	
})


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

export default router;

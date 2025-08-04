import express from 'express'
import { Request,Response } from 'express';
import { Express } from 'express';
import { createBlogInput,updateBlogInput } from '../config/validation';
import { blogmodel } from '../config/db';
import { authMiddleware } from '../config/middleware';

//@ts-ignore
const JWT_SECRET : string = process.env.JWT_SECRET;
const router = express.Router();


router.post("/", authMiddleware, async (req:Request,res:Response) => {
    // create a blog router,
    //@ts-ignore
    const userID = req.userId; // it contains the USERID of the user
    // send the title, content, get the id from req.userId,

    const {success,error} = createBlogInput.safeParse(req.body);
    if(!success)
    {
        return res.status(411).json({
            "message":"Invalid credentials"
        })
    }

    try {
        // Check if user already exists
        const blog = await blogmodel.create({
            title:req.body.title,
            content:req.body.content,
            authorId:userID
        })

        return res.status(201).json({
            id: blog.id
        });

    }
    catch(e)
    {
        return res.status(500).json({
            "message":"Error sending the posts"
        })
    }

})


router.put('/:id', authMiddleware, async(req:Request, res:Response)=>{
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


router.get('/bulk', async(req:Request, res:Response)=>{
	
	try {
		const blogs = await blogmodel.find({}, {
            content: 1,
            title: 1,
            authorId: 1
        }).populate('author', 'name'); 
        // Populates the author field with just the 'name'
		return res.json({
			blogs
		})

	} catch (error) {
		 return res.status(411).json({
			msg: "error while getting all posts"
		})
	}
	
})

router.get('/:id', async(req:Request, res:Response)=>{
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

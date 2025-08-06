"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("../config/validation");
const db_1 = require("../config/db");
const middleware_1 = require("../config/middleware");
//@ts-ignore
const JWT_SECRET = process.env.JWT_SECRET;
const router = express_1.default.Router();
// CORRECT
router.post("/create", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // create a blog router,
    //@ts-ignore
    const userID = req.userId; // it contains the USERID of the user
    // send the title, content, get the id from req.userId,
    console.log("User id ,", userID);
    const { success, error } = validation_1.createBlogInput.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            "message": "Invalid credentials"
        });
    }
    try {
        // Check if user already exists
        // the published Date is automatically handled as Date.now as default
        // publishedDate: Date.now(); //for every create POST request
        const blog = yield db_1.blogmodel.create({
            title: req.body.title,
            content: req.body.content,
            description: req.body.description, // added the description a short one
            author: userID,
            tags: req.body.tags // an array of strings,
        });
        // what is blog.id ?  it will be the id of the blogs
        return res.status(201).json({
            id: blog.id
        });
    }
    catch (e) {
        console.error("Error creating blog post:", e);
        return res.status(500).json({
            "message": "Error sending the posts"
        });
    }
}));
/*
update the content only, not the tags,
*/
//CORRECT
router.put('/update/:id', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id; // the userid 
    const body = req.body;
    const { success } = validation_1.updateBlogInput.safeParse(body);
    if (!success) {
        return res.status(411).json({
            "message": "Invalid credentials"
        });
    }
    try {
        // update the blogs
        const post = yield db_1.blogmodel.findByIdAndUpdate(id, {
            title: body.title,
            content: body.content
        }, { new: true }); // 'new: true' returns the updated document
        if (!post) {
            return res.status(404).json({
                msg: "Post not found"
            });
        }
        return res.json({
            msg: "updated",
            post
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error updating the post"
        });
    }
}));
// here u can have two options
/*
either fetch all blogs from the DB,
*/
//CORRECT ROUTE
router.get('/bulk', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userID = req.userId;
    try {
        // 1. Get pagination parameters from query string with defaults.
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // 2. Calculate the number of documents to skip.
        const skip = (page - 1) * limit;
        // 3. Fetch the total count of all blogs.
        const totalPosts = yield db_1.blogmodel.countDocuments();
        // 4. Fetch the blogs for the current page.
        const blogs = yield db_1.blogmodel.find({})
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
}));
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
router.get('/get/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield db_1.blogmodel.findById(id).populate('author', 'name');
        if (!post) {
            return res.status(404).json({
                msg: "Post not found"
            });
        }
        return res.json({
            post
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error fetching the post"
        });
    }
}));
// Fetch all blogs of a specific author
/*
RESPONSE

*/
router.get('/user/:authorId', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the authorId from the URL parameters
    const authorId = req.params.authorId;
    try {
        // Find all blog posts where the 'author' field matches the authorId.
        // The .populate() method is crucial here; it replaces the author's
        // ID with the actual user object, so we can access their name.
        const posts = yield db_1.blogmodel.find({ author: authorId })
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
    }
    catch (error) {
        console.error("Error fetching user blogs:", error);
        // Return a 500 Internal Server Error for any database or server issues
        return res.status(500).json({
            message: "Error fetching the author's blogs."
        });
    }
}));
exports.default = router;

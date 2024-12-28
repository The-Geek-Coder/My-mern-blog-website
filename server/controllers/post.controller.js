const { Post } = require("../model/post.model");
const { errorHandler } = require("../utils/error.utils");

async function create(req, res, next) {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "Unauthorized access denied"));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all the required fields"));
    }
    const slug = req.body.title.split(' ').join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, ""); //replacing all special characters other than no and alphabets with ""

    const newPost = new Post({
        userId: req.user.id,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        category: req.body.category,
        slug
    })
    try {
        const savedPost = await newPost.save();
        return res.json({ msg: "Post created successfully", post: savedPost });
    } catch (err) {
        if (err.code == 11000)
            return next(errorHandler(400, "Title already exsists"));

        console.log(err.message, err.code);
        return next(errorHandler(500, "Something went wrong!!"));
    }
}

const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        console.log(startIndex);

        //Testing the result,
        console.log({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId })
        })
        
        console.log(req.query.searchTerm);
        
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);
        console.log(posts.length, "length of post");

        const totalPosts = await Post.countDocuments();
        //last month posts...
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthsPostCount = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });
        res.json({
            posts,
            totalPosts,
            lastMonthsPostCount
        })
    } catch (error) {
        console.log(error.message);
        
        next(errorHandler(500, "Cannot get posts"));
    }
}

const deletePost = async (req, res, next) => {
    const { postId, userId } = req.params;
    if (!req.user.isAdmin || req.user.id !== userId) {
        return next(errorHandler(403, "You are not allowed to delete this post"));
    }
    if (!req.body.postDeleteConsent || req.body.postDeleteConsent !== "I WanT To DeLeTe ThIS poSt") {
        return next(errorHandler(401, "Post deletion cancelled"));
    }
    try {
        await Post.findByIdAndDelete(postId);
        return res.json({ msg: "Post has been deleted successfully" });
    } catch (error) {
        return next(errorHandler(403, "Post deletion failed"));
    }
}

const updatePost = async (req, res, next) => {
    const { postId, userId } = req.params;
    if (!req.user.isAdmin || req.user.id !== userId) {
        //if not admin or not the owner of that post.
        return next(errorHandler(403, "You are not allowed to delete this post"));
    }
    const { title, content, category, image } = req.body;
    const slug = req.body.title.split(' ').join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, ""); //replacing all special characters other than no and alphabets with ""
    console.log("slug",slug);
    
    try {
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $set: {
                title,
                category,
                image,
                content,
                slug
            }
        }, { new: true });
        
        if (updatedPost)
           return res.json({ updatedPost })
        else {
            // Document not found
            return res.status(404).json({ message: 'Post not found' });
          }
    } catch (error) {
        next(errorHandler(401, "Error updating post"))
    }
}

module.exports = {
    create,
    getPosts,
    deletePost,
    updatePost
};
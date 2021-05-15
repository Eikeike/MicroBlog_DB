const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const ash = require('../middleware/asyncWrapper'); //Async wrapper for promise catching

exports.createPost = ash(
    async (req, res, next) => {
        console.log("Creating post");
        let post;
        let postObj = {
            author: req.requestingUser._id, //caught through middleware
            postText: req.body.postText,
            postType: [req.body.postType]
        };
        if(req.body.postType.includes('comment'))
        {
            postObj.kind = 'Comment';
            postObj.originalPost = req.body.originalPost;
        }
        post = await Post.create(postObj);
        
        if(req.body.originalPost)
        {
            await Post.findByIdAndUpdate(req.body.originalPost, {
                $push: {comments: post._id}
            })
        }

        await User.findByIdAndUpdate(req.requestingUser.id, 
            {
            $push: {posts: post._id}
        })

        res.status(201).json({success:true, post});

});

exports.feed = ash(
    async(req, res, next) => {
        const following = await User.find().where("_id").in(req.requestingUser.following.concat(req.requestingUser._id));
        const posts = following.flatMap(user => user.posts);

        const feed = await Post
        .find()
        .populate({path: 'author', select: 'name userName avatarURL'})
        //.populate({path: 'comments', populate: {path: 'author', select: 'name userName avatarURL'}, sort: {sort: { 'createdAt': -1 }}})
        .populate({path: 'originalPost', populate: {path: 'author', select: 'name userName avatarURL'}})
        .sort({'createdAt': -1})
        .where("_id")
        .in(posts)
        .limit(150)
        .lean()
        .exec();

        feed.forEach(post => {
            post.isLiked = (JSON.stringify(post.likedBy).includes(req.requestingUser._id) );
            post.isReposted = (JSON.stringify(post.repostedBy).includes(req.requestingUser._id) );
        })
        res.status(201).json({success: true, feed});
    }
);

exports.toggleLike = ash(
    async(req, res, next) => {
        const post = await Post.findById(req.params.id);
        if (!post)
        {
            return next({statusCode: 404, message: "Post not found"});
        };
        if (post.likedBy.indexOf(req.requestingUser._id) > -1)
        {
            const idx = post.likedBy.indexOf(req.requestingUser._id);
            post.likedBy.splice(idx, 1);
            post.likeCount -= 1;
            await post.save();
        }
        else{
            post.likedBy.push(req.requestingUser._id);
            post.likeCount += 1;
            await post.save();
        }
        res.status(201).json({success: true});
    }
)

exports.toggleRepost = ash(
    async(req, res, next) => {
        let post = await Post.findById(req.params.id);
        let repost = new Post(post.toObject());

        if (!post)
        {
            return next({statusCode: 404, message: "Post not found"});
        };
        if (post.repostedBy.indexOf(req.requestingUser._id) > -1)
        {
            return next({statusCode: 303, message: "This is already a repost"});
        }
        else{
            post.repostedBy.push(req.requestingUser._id);

            if (!repost.postType.includes("repost"))
            {
                repost.postType.push("repost");
            };
            repost._id = mongoose.Types.ObjectId();
            repost.isNew = true;
            post.repostCount += 1;

            await post.save();
            await repost.save({timestamps: false});

            await User.findByIdAndUpdate(req.requestingUser.id, 
                {
                $push: {posts: repost._id}
            })
        }
        res.status(201).json({success: true});

    }
)

exports.getComments = ash(
    async (req, res, next) => {
        const commentIds = req.body.comments;
        //user gives us an array of comment ids, we fill them. Simple as that
        const getPost = async (c) => {
            return await Post.findById(c).populate({path: 'author', select: 'name userName avatarURL'}).sort({ 'createdAt': -1 }).exec();
        }
        let comments = await Promise.all(commentIds.map(c => {return getPost(c)}));

    if (!commentIds)
    {
        return next({statusCode: 404, message: 'post not found!'});
    };
    console.log(comments);
    res.status(201).json({success: true, comments: comments})

    }
)

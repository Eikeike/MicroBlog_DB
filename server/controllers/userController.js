const User = require('../models/User');
const ash = require('../middleware/asyncWrapper'); //Async wrapper for promise catching

exports.follow = ash(
    async (req, res, next) => {

    if(req.params.id === req.requestingUser)
    {
        return next({
            statusCode: 403,
            message: "You cannot follow yourself"
        })
    }

    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next({
            statusCode: 403,
            message: "User not found"
        })
    };

    await User.findByIdAndUpdate(req.params.id, 
        {
        $push: {followers: req.requestingUser,
        $inc: {followersCount: 1}
        }
    })

    await User.findByIdAndUpdate(req.requestingUser.id, 
        {
        $push: {following: req.params.id,
        $inc: {followingCount: 1}
        }
    })

    res.status(201).json({success: true});
})

exports.unfollow = ash(
    async (req, res, next) => {

    if(req.params.id === req.requestingUser._id)
    {
        return next({
            statusCode: 403,
            message: "You cannot unfollow yourself"
        })
    }

    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next({
            statusCode: 403,
            message: "User not found"
        })
    };

    await User.findByIdAndUpdate(req.params.id, 
        {
        $pull: {followers: req.requestingUser._id,
        $inc: {followersCount: -1}
        }
    })

    await User.findByIdAndUpdate(req.requestingUser.id, 
        {
        $pull: {following: req.params.id,
        $inc: {followingCount: -1}
        }
    })

    res.status(201).json({success: true});
})

exports.getInfo = ash(
    async (req, res, next) => {

    const isMe = (req.params.userName === req.requestingUser.userName);

    let user = await User
    .findOne({userName: req.params.userName}, 'name userName avatarURL followers followersCount followingCount bioText posts')
    .populate({
        path: 'posts',
        populate: {path: 'author', select: 'name userName avatarURL', options: { sort: { 'createdAt': -1 } }} 
    })
    // .populate({
    //     path: 'comments',
    //     populate: {path: 'author', select: 'name userName avatarURL', options: { sort: { 'createdAt': -1 } }},
    //     populate: {path: 'originalPost'}
    // })
    .lean()
    .exec();

    if(!user)
    {
        return next({statusCode: 401, message: "User not found. Oops"});
    }

    user.isRequestingUser = isMe;
    user.isFollowed = JSON.stringify(user.followers).includes(req.requestingUser._id);
    user.posts.forEach(post => {post.isLiked = post.likedBy.includes(user._id); post.isReposted = post.repostedBy.includes(user._id);})
    res.status(201).json({success: true, user});
})

exports.search = ash(
    async (req, res, next) => {
        let users = await User.find(
            {$and: [
                {_id: {$ne: req.requestingUser._id}},
                {$or: [{userName: req.params.userName}, {name: req.params.userName}]}
            ]
        })
        .select('name userName avatarURL')
        .limit(100)
        .lean();
        res.status(201).json({success: true, users});
    }
)
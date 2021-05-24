const User = require('../models/User');
const Post = require('../models/Post');
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

    let user = await User.findById(req.params.id);

    if(!user)
    {
        return next({
            statusCode: 403,
            message: "User not found"
        })
    };

    user = await User.findByIdAndUpdate(req.params.id, 
        {
        $push: {followers: req.requestingUser},
        $inc: {followersCount: 1}
        }
    )

    let me = await User.findByIdAndUpdate(req.requestingUser.id, 
        {
        $push: {following: req.params.id},
        $inc: {followingCount: 1}
        }
    )
    
    await user.save();
    await me.save();
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

    let user = await User.findById(req.params.id);

    if(!user)
    {
        return next({
            statusCode: 404,
            message: "User not found"
        })
    };

    user = await User.findByIdAndUpdate(req.params.id, 
        {
        $pull: {followers: req.requestingUser._id},
        $inc: {followersCount: -1}
        }
    );

    let me = await User.findByIdAndUpdate(req.requestingUser.id, 
        {
        $pull: {following: req.params.id},
        $inc: {followingCount: -1}
        }
    )
    
    await me.save();
    await user.save();
    res.status(201).json({success: true});
})

exports.getInfo = ash(
    async (req, res, next) => {

    const isMe = (req.params.userName === req.requestingUser.userName);

    let user = await User
    .findOne({userName: req.params.userName}, 'name userName avatarURL followers following followersCount followingCount bioText posts')
    .populate({
        path: 'posts',
        match: { postType: {$not: {$elemMatch: {$eq:'comment'}}}},
        populate: {path: 'author originalPost', select: 'name userName avatarURL', populate: {path: 'author', select: 'name userName avatarURL'}},
        options: { sort: { 'createdAt': -1 } } 
    })
    .populate({path: 'followers', select: '-password'})
    .populate({path: 'following', select: '-password'})
    .lean()
    .exec();

    if(!user)
    {
        return next({statusCode: 401, message: "User not found. Oops"});
    }

    user.isRequestingUser = isMe;
    user.isFollowed = JSON.stringify(user.followers).includes(req.requestingUser._id);
    user.posts.forEach(post => {
        post.isLiked = (JSON.stringify(post.likedBy).includes(req.requestingUser._id) );
        post.isReposted = (JSON.stringify(post.repostedBy).includes(req.requestingUser._id) );
    });
    res.status(201).json({success: true, user});
})

exports.getComments = ash(
    async (req, res, next) => {

    let user = await User
    .findOne({userName: req.params.userName}, 'posts')
    .populate({
        path: 'posts',
        match: { postType: {$elemMatch: {$eq:'comment'}}},
        populate: 
            [
            {path: 'originalPost', populate: {path: 'author', select: 'name userName avatarURL'}},
            {path: 'author'}
            ],
        options: { sort: { 'createdAt': -1 } } 
    })
    .lean()
    .exec();

    if(!user)
    {
        return next({statusCode: 404, message: "Who is this"});
    }

    user.posts.forEach(post => {
        post.isLiked = (JSON.stringify(post.likedBy).includes(req.requestingUser._id) );
        post.isReposted = (JSON.stringify(post.repostedBy).includes(req.requestingUser._id) );
    });

    res.status(201).json({success: true, comments: user.posts});
    }
)

exports.getLikes = ash(
    async (req, res, next) => {

        let posts = await Post
        .find(
                {likedBy: {$elemMatch: {$eq:req.params.id}}}
        )
        .populate({path: 'author', select: 'name userName avatarURL'})
        .populate({path: 'originalPost', populate: {path: 'author', select: 'name userName avatarURL'}})
        .sort({'createdAt': -1})
        .limit(150)
        .lean()
        .exec();

    if(!posts)
    {
        return next({statusCode: 404, message: "Who is this"});
    }

    posts.forEach(post => {
        post.isLiked = (JSON.stringify(post.likedBy).includes(req.requestingUser._id));
        post.isReposted = (JSON.stringify(post.repostedBy).includes(req.requestingUser._id) );
    })

    res.status(201).json({success: true, likes: posts});
    }
)

exports.search = ash(
    async (req, res, next) => {
        let users = await User.find(
            {$and: [
                {_id: {$ne: req.requestingUser._id}}, //not the requesting user (Cant find yourself )
                {$or: [{userName: new RegExp('.*' + req.params.userName + '.*', 'i')}, {name: new RegExp(req.params.userName, 'i')}]} //and the username or the name
            ]
        })
        .select('name userName avatarURL')
        .limit(100)
        .lean();
        res.status(201).json({success: true, users});
    }
)

exports.edit= ash(
    async (req, res, next) => {
        if (!req.body)
        {
            return next({statusCode: 403, message: "Nothing to edit"});
        }
        let user = await User.findByIdAndUpdate(req.requestingUser._id, {
            name: req.body.name,
            bioText: req.body.bio
        }, {new: true});
        
        if(!user)
        {
            return next({statusCode: 404, message: "WHo is it"});
        }
        await user.save();

        res.status(201).json({success: true});
    }
)
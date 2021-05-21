const expect = require('chai').expect;
const supertest = require('supertest');
const config = require('../utils/config');
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = require('../app');
const request = supertest(app)
const mongoose = require('mongoose');

const {setupDB, createOneUser, createRefUser, getRefUser} = require('./setupDB');
setupDB();

//Sorry for duplicate code. It did not really work that well with external functions...

describe('Write and read works - Landing / Home-Page', () => {
    it('Create Post works', async () => 
    {
        let [user, userDB] = await createOneUser();
        let postReceived = null;
    return request.post(`/posts/create`)
    .send(
        {
            postText: "TestPosting",
            postType: 'post'
        }
    )
    .set("Authorization", "Bearer " + user.token.toString())
    .then(res => {
        expect(res.statusCode).to.equal(201);
        const response = res.body;
        expect(response.success).to.be.true;
        postReceived = response.post;

        expect(response.post.postText).to.include("TestPosting");
        return User.findOne({userName: user.userName})
    }
    )
        .then(user => 
            {
                expect(user.posts).to.be.a('array').that.is.not.empty;
                expect(user.posts[0]._id.toString()).to.equal(postReceived._id)
            }
        )
    })

    it('Create Comment works', async () => 
    {
        let [user, userDB] = await createOneUser();
        let postReceived = null;
    return request.post(`/posts/create`)
    .send(
        {
            postText: "TestPosting",
            postType: 'comment'
        }
    )
    .set("Authorization", "Bearer " + user.token.toString())
    .then(res => {
        expect(res.statusCode).to.equal(201);
        const response = res.body;
        expect(response.success).to.be.true;
        postReceived = response.post;

        expect(response.post.postText).to.include("TestPosting");
        return User.findOne({userName: user.userName})
    }
    )
        .then(user => 
            {
                expect(user.posts).to.be.a('array').that.is.not.empty;
                expect(user.posts[0]._id.toString()).to.equal(postReceived._id);
                expect(postReceived.kind).to.equal('Comment');
            }
        )
    })

    it('Getting Feed works', async () => 
    {
        let [user, userDB] = await createOneUser();
        const refUserDB = getRefUser();
        //Vorbedingung gegeben, kein Test an dieser Stelle
        let userUpdated = await User.findByIdAndUpdate(userDB._id, 
            {
            $push: {following: refUserDB._id},
            $inc: {followingCount: 1}
            }, {new: true});
        await userUpdated.save();

        let feedPost = await Post.create({
            postText: "Feed",
            postType: 'post'
        });

        let refUserUpdated = await User.findByIdAndUpdate(refUserDB._id, 
            {
            $push: {posts: feedPost._id}
            }, {new: true});

        await refUserUpdated.save();

        return request.get(`/posts/feed`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then( res =>
            {
                expect(res.statusCode).to.equal(201);
                const response = res.body;
                expect(response.feed).to.have.lengthOf(1);
                expect(response.feed[0]._id).to.equal(feedPost._id.toString());
            }
        )
    })
})

describe('Post interactions working', () =>
{
    it('liking a post', async () => 
    {
        let [user, userDB] = await createOneUser();
        let newPost = await Post.create(
            {
                postText: 'Like',
                postType: 'post'
            });
        
        return request.get(`/posts/toggleLike/${newPost._id}`)
            .set("Authorization", "Bearer " + user.token.toString())
            .then(res => { //like
                expect(res.statusCode).to.equal(201);
                const response = res.body;
                expect(response.success).to.be.true;
                return Post.findOne({_id: newPost._id})
            })
            .then(post => { //check if like worked and send next request
                expect(post.likeCount).to.equal(1);
                expect(post.likedBy).to.include(user._id)
                return request.get(`/posts/toggleLike/${newPost._id}`)
                .set("Authorization", "Bearer " + user.token.toString())
            })
            .then(res => { //check if request worked and return updated post
                expect(res.statusCode).to.equal(201);
                const response = res.body;
                expect(response.success).to.be.true;
                return Post.findOne({_id: newPost._id})
            })
            .then(post => { //check if reset like worked
                expect(post.likeCount).to.equal(0);
                expect(post.likedBy).not.to.include(user._id)
            }
            )
    })

    it('reposts work', async () => 
    {
        let [user, userDB] = await createOneUser();
        let newPost = await Post.create(
            {
                postText: 'IndividualRepostString',
                postType: 'post'
            });
        
        return request.get(`/posts/toggleRepost/${newPost._id}`)
            .set("Authorization", "Bearer " + user.token.toString())
            .then(res => {
                expect(res.statusCode).to.equal(201);
                const response = res.body;
                expect(response.success).to.be.true;
                return Post.findOne({_id: newPost._id}) //find post with same postText
            })
            .then(post => {
                expect(post.repostCount).to.equal(1);
                expect(post.repostedBy).to.include(user._id)
                return Post.find({postText: newPost.postText})
            })
            .then(posts => {
                expect(posts).to.have.lengthOf(2); //The post now exists twice
                expect(posts[1].postType).to.include('repost');
                expect(posts[1].repostingUser).to.equal(user.name);
                expect(posts[1]).to.have.property('createdAt');
            })
    })
})

describe('get Likes and Comments', () => {

    it('get Likes of one post', async () => {
        let [user] = await createOneUser();
        let newPost = await Post.create(
            {
                postText: 'IndividualRepostString',
                postType: 'post'
            });
        newPost.likedBy.push(user._id);
        await newPost.save();

        return request.get(`/posts/getLikes/${newPost._id}`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then( res => {
            const response = res.body;
            expect(response.success).to.be.true;
            expect(response.likedBy).to.be.an('array').that.has.lengthOf(1);
            expect(response.likedBy[0]._id).to.equal(user._id);
        })
    })

    it('get Comments of one post', async () => {
        let [user] = await createOneUser();
        let originalPost = await Post.create(
            {
                author: user,
                postText: 'Original Post',
                postType: 'post'
            });

        let newComment = await Post.create(
            {
                author: user,
                postText: 'Just a comment',
                postType: 'comment',
                kind: 'Comment',
                originalPost: originalPost._id
            });

        return request.post(`/posts/getComments`)
        .set("Authorization", "Bearer " + user.token.toString())
        .send({
            comments: [newComment._id]
        })
        .then( res => {
            const response = res.body;
            expect(response.success).to.be.true;
            expect(response.comments).to.be.an('array').that.has.lengthOf(1);
            expect(response.comments[0].author._id).to.equal(user._id);
            expect(response.comments[0].originalPost._id).to.equal(originalPost._id.toString());
            expect(response.comments[0].originalPost.author._id).to.equal(user._id.toString());
        })
    })
})

describe('wildcard search works', () => {
    it('searching withing postText works', async() => {
        let [user] = await createOneUser();
        let newPost = await Post.create(
            {
                postText: 'Testing the wildcard search of a post',
                postType: 'post'
            });

        return request.post(`/posts/search`)
        .set("Authorization", "Bearer " + user.token.toString())
        .send(
            {
                query: 'wildcard search'
            }
        )
        .then( res => {
            const response = res.body
            expect(response.success).to.be.true;
            expect(response.posts).to.be.an('array').that.has.lengthOf(1);
            expect(response.posts[0]._id).to.equal(newPost._id.toString());
        })
    })
})
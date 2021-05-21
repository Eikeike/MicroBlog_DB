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

describe('getting User information works//User-Screen fully accessible', () => {
    it('Get own information', async () => {
        let [user, userDB] = await createOneUser();
        return request.get(`/user/getInfo/${user.userName}`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then(res => {
            const response = res.body;
            expect(res.statusCode).to.equal(201);
            expect(response.success).to.be.true;
            expect(response.user).to.have.property('userName', user.userName);
            expect(response.user.isRequestingUser).to.be.true;
        });
    })

    it('Get user comments', async () => {
        
        let [user, userDB] = await createOneUser();

        let postObj = {
            author: userDB._id, //caught through middleware
            postText: "TestComment",
            postType: ['post', 'comment'],
            kind: 'Comment',
            originalPost: null //Mockup, normally this is wrong but we do not care about this atm
        };
        let post = await Post.create(postObj);
        let userToUpdate = await User.findOne({userName: user.userName});
        userToUpdate.posts.push(post._id);
        await userToUpdate.save();

        return request.get(`/user/getUserComments/${user.userName}`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then(res => {
            const response = res.body;
            expect(res.statusCode).to.equal(201);
            expect(response.success).to.be.true;
            expect(response.comments[0]._id).to.equal(post._id.toString());
            expect(response.comments[0].kind).to.equal('Comment');
        });
    })

    it('Get user likes', async () => {
        
        let [user, userDB] = await createOneUser();
        let postObj = {
            author: userDB._id, //caught through middleware
            postText: "TestPost",
            postType: ['post'],
            likedBy: [userDB._id]
        };
        let post = await Post.create(postObj);

        return request.get(`/user/getUserLikes/${userDB._id}`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then(res => {
            const response = res.body;
            expect(res.statusCode).to.equal(201);
            expect(response.success).to.be.true;
            expect(response.likes[0]._id).to.equal(post._id.toString());
            expect(response.likes[0].isLiked).to.be.true;
        });
    })
})

describe('Following and unfollowing works', async () => {

    it('follow correct', async () => {
        let [user, userDB] = await createOneUser();
        const refUserDB = getRefUser();
        return request.get(`/user/follow/${refUserDB._id}`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then(res => {
            const response = res.body;
            expect(response.success).to.be.true;
            //return user because it should have been updated now
            return User.findOne({userName: user.userName});
        })
        .then(updatedUser => {
            expect(updatedUser.followingCount).to.equal(1);
            expect(updatedUser.following).to.include(refUserDB._id.toString());
            return User.findOne({userName: refUserDB.userName});
        }
        )
        .then(refUser => {
            expect(refUser.followers).to.include(user._id.toString());
        })

    })

    it('unfollow correct', async () => {
        let [user, userDB] = await createOneUser();
        const refUserDB = getRefUser();
        //Vorbedingung gegeben, kein Test an dieser Stelle
        let userUpdated = await User.findByIdAndUpdate(userDB._id, 
            {
            $push: {following: refUserDB._id},
            $inc: {followingCount: 1}
            }, {new: true});
        //Vorbedinung auch für anderen Nutzer erfüllt
        let refUserUpdated = await User.findByIdAndUpdate(refUserDB._id, 
            {
            $push: {followers: userDB._id},
            $inc: {followersCount: 1}
            }, {new: true});
        //check vorbedinung
        expect(userUpdated.followingCount).to.equal(1);
        expect(refUserUpdated.followersCount).to.equal(1);

        return request.get(`/user/unfollow/${refUserDB._id}`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then(res => {
            const response = res.body;
            expect(response.success).to.be.true;
            //return user because it should have been updated now
            return User.findOne({userName: user.userName});
        })
        .then(updatedUser => {
            expect(updatedUser.followingCount).to.equal(0);
            expect(updatedUser.following).not.to.include(refUserDB._id.toString());
            return User.findOne({userName: refUserDB.userName});
        }
        )
        .then(refUser => {
            expect(refUser.followers).not.to.include(user._id.toString());
        })

    })
})

describe('search and edit work (read and write operations)', async () => {

    it('search works', async () => {
        let [user] = await createOneUser();
        const refUserDB = getRefUser();
        return request.get(`/user/search/${refUserDB.userName}`)
        .set("Authorization", "Bearer " + user.token.toString())
        .then(res => {
            const response = res.body;
            expect(response.success).to.be.true;
            expect(response.users).to.be.a('array').that.is.not.empty; //Do not search own username
        })
    })

    it('edit works', async () => {
        let [user] = await createOneUser();
        return request.post(`/user/edit`)
        .send({
            name: "Changed",
            bio: "ChangedAsWell"
        })
        .set("Authorization", "Bearer " + user.token.toString())
        .then(res => {
            const response = res.body;
            expect(response.success).to.be.true;
            return User.findOne({userName: user.userName});
        })
        .then(user => {
            expect(user.name).to.equal("Changed");
            expect(user.bioText).to.equal("ChangedAsWell");
        })
    })
})
const expect = require('chai').expect;
const supertest = require('supertest');
const config = require('../utils/config');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const app = require('../app');
const request = supertest(app)
const mongoose = require('mongoose');

const {setupDB, createOneUser} = require('./setupDB');
setupDB();


describe('User authentication, all value combinations are parsed correctly', () => {

    it('Signup works', () => {
        const mockUser = {
            name: "Testing",
            userName: "testing",
            password: "a1b2c3d4e5"
          };
        return request.post('/auth/signup')
        .send(mockUser)
        .then(
            (res) => {
                const user = User.findOne({userName: testing}).lean();

                expect(res.status).to.equal(201);
                expect(bcrypt.compare(mockUser.password, user.password)).to.be.true;
                expect(mockUser.name).to.equal(user.name);
                expect(mockUser.userName).to.equal(user.userName);

        })
        .catch((err) => {return err});
    });

    it('Login works', async () => {
        
        const mockUser = await createOneUser();
        return request.post('/auth/login')
        .set("Authorization", "Bearer " + mockUser.token.toString())
        .send(mockUser)
        .then( (res) => {
            const {response} = JSON.parse(res.text);
            const {userName, id} = jwt.decode(mockUser.token);

            expect(res.status).to.equal(201);
            expect(userName).to.eql(mockUser.userName);
            expect(id).to.equal(mockUser._id.toString());

        });

    })

    it('Login works with user not registered', async () => {
        
        let mockUser = await createOneUser();
        mockUser.userName = 'notThere';
        return request.post('/auth/login')
        .set("Authorization", "Bearer " + mockUser.token.toString()) //Making the string invalid with random letter
        .send(mockUser)
        .then( (res) => {
            const response = res.body
            expect(res.status).to.equal(400);
            expect(response.success).to.be.false;
            expect(response.message).to.include("User is not registered yet");
        });
    });

    it('Login works with E-mail and password not given', async () => {
        
            let mockUser = await createOneUser();
            mockUser.userName = null;
            return request.post('/auth/login')
            .set("Authorization", "Bearer " + mockUser.token.toString()) //Making the string invalid with random letter
            .send(mockUser)
            .then( (res) => {
                const response = res.body
                expect(res.status).to.equal(400);
                expect(response.success).to.be.false;
                expect(response.message).to.include("E-Mail and Password are both needed to sign in");
            });
        })

        it('Login works with wrong password', async () => {
        
            let mockUser = await createOneUser();
            mockUser.password = 'wrongValue';
            return request.post('/auth/login')
            .set("Authorization", "Bearer " + mockUser.token.toString()) //Making the string invalid with random letter
            .send(mockUser)
            .then( (res) => {
                const response = res.body
                expect(res.status).to.equal(400);
                expect(response.success).to.be.false;
                expect(response.message).to.include("Wrong password");
            });
        })
})

describe('token validation working', () => {

    it('Correct token', async () => {

        let mockUser = await createOneUser();
        return request.get('/auth/validate')
        .set("Authorization", "Bearer " + mockUser.token.toString()) //Making the string invalid with random letter
        .then( (res) => {
            const response = res.body
            expect(res.status).to.equal(201);
            expect(response.success).to.be.true;
            });
    });

    it('Unverifiable token', async () => {
        
        let mockUser = await createOneUser();
        return request.get('/auth/validate')
        .set("Authorization", "Bearer " + mockUser.token.toString() + 'a') //Making the string invalid with random letter
        .then( (res) => {
            const response = res.body
            expect(res.status).to.equal(401);
            expect(response.success).to.be.false;
            expect(response.message).to.include("You need to be logged in");
            });
    });

    it('Expired login session', async () => {
        
        let mockUser = await createOneUser();
        mockToken = jwt.sign({ id: mockUser._id, userName: mockUser.userName }, config.TOKEN_SECRET, { expiresIn: '-10s' }); //token already expired
        return request.get('/auth/validate')
        .set("Authorization", "Bearer " + mockToken.toString())
        .then( (res) => {
            const response = res.body
            expect(res.status).to.equal(401);
            expect(response.success).to.be.false;
            expect(response.message).to.include("Your login session has expired");
            });
    })

    it('Account from token does not exist in database anymore', async () => {
        
        const mockUser = {name: "Testing",
                userName: "testing",
                password: "a12b3c4d"
        };
        const token = jwt.sign({ id: mongoose.Types.ObjectId(), userName: mockUser.userName }, config.TOKEN_SECRET, { expiresIn: config.TOKEN_EXPIRY });
        //Create a user but do not create him in the database
        return request.get('/auth/validate')
        .set("Authorization", "Bearer " + token.toString())
        .then( (res) => {
            const response = res.body
            expect(res.status).to.equal(401);
            expect(response.success).to.be.false;
            expect(response.message).to.include("This account has been deleted");
            });
    })
})
const expect = require('chai').expect;
const supertest = require('supertest');
const config = require('../utils/config');

const app = require('../app');
const request = supertest(app)
const mongoose = require('mongoose');
const User = require('../models/User')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.promise = global.Promise

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const c of collections) {
      const collection = mongoose.connection.collections[c]
      await collection.deleteMany()
    }
  }

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const c of collections) {
      const collection = mongoose.connection.collections[c]
      try {
        await collection.drop()
      } catch (error) {
        // Sometimes this error happens, but you can safely ignore it
        if (error.message === 'ns not found') return
        // This error occurs when you use it.todo. You can
        // safely ignore this error too
        if (error.message.includes('a background operation is currently running')) return
        console.log(error.message)
      }
    }
  }
let mockUser = {name: "Testing",
                userName: "testing",
                password: "a12b3c4d"
};

module.exports = {
     setupDB(){
        before(async () => {
            mongoose.connect(config.MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(error => {
                console.log(`Error: Cannot connect to database with URI ${config.MONGO_TEST_URI}`)
            });

            mongoose.connection.once('open', function() {
                console.log("Test-database connected successfully!");
                //create a mock user
            });

        after(async () => {
            await dropAllCollections();
        });

        afterEach(async () => {
            await removeAllCollections();
        })
    })
    },
    async createOneUser(){
        const user = await User.create(mockUser);
        const token = jwt.sign({ id: user._id, userName: mockUser.userName }, config.TOKEN_SECRET, { expiresIn: config.TOKEN_EXPIRY });
        mockUser._id = user._id.toString();
        mockUser.token = token;
        return {...mockUser};
    }
}
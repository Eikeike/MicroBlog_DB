require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dbAdmin:dbAdminPassword@microblog.7nc4g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGO_TEST_URI = process.env.MONGO_TEST_URI || 'mongodb://localhost/dbserver_test';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'pvpnCCZfwOF85pBjbOebZiYIDhZ3w9LZrKwBZ7152K89mPCOHtbRlmr5Z91ci4L';
const LISTEN_PORT = process.env.PORT || 80;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '30d';

module.exports = { TOKEN_SECRET, LISTEN_PORT, TOKEN_EXPIRY, MONGO_TEST_URI, MONGO_URI}
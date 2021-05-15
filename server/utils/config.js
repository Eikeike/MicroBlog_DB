require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/dbserver';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'pvpnCCZfwOF85pBjbOebZiYIDhZ3w9LZrKwBZ7152K89mPCOHtbRlmr5Z91ci4L';
const LISTEN_PORT = process.env.LISTEN_PORT || 3000;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '30d';

module.exports = {MONGO_URI, TOKEN_SECRET, LISTEN_PORT, TOKEN_EXPIRY}
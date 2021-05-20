var config = require('../utils/config');
var moment = require('moment')
var User = require('../models/User');
var ash = require('./asyncWrapper');
var jwt = require('jsonwebtoken');

exports.authenticate = ash(
  async (req, res, next) => {
    if (!req.headers.authorization) {
      return next({statusCode: 401, message: "MissingToken"});
    }
    var token = req.headers.authorization.split(' ')[1];
    //Authorization looks like this: "Bearer: <someToken>". Split at ' ' to get <someToken>, in this case JWT

    var payload = null;
    try {
      payload = jwt.verify(token, config.TOKEN_SECRET);
    }
    catch (err) {
      if (err.message.includes('expired'))
      {
        return next({statusCode: 401, message: "Your login session has expired"});
      }
      return next({statusCode: 401, message: "You need to be logged in to access this route"});
    }

    // if (payload.exp <= moment().unix()) {

    // }
    const user = await User.findById(payload.id).select('-password').exec();
    if(!user)
    {
      return next({
        statusCode: 401, message: "This account has been deleted"
      })
    }
    else
    {
      req.requestingUser = user;
      next();
    }
    //payload.id contains the userName

    //req.requestingUser now contains the user that is making a request

  });
const User = require('../models/User');
const ash = require('../middleware/asyncWrapper'); //Async wrapper for promise catching

exports.signup = ash(
    async (req, res, next) => {
        console.log("attempting to sign up!");
        console.log(req.body);
        const {name, userName, password} = await req.body;
        const newUser = await User.create(
            {name: name,
            userName: userName,
            password: password}
            );
        res.status(201).json({success: true});
    }
)

exports.login = ash(
    async (req, res, next) => {
        console.log("attempting to log in!");
        const {userName, password} = req.body;

        if(!userName || !password)
        {
            return next({
                message: "E-Mail and Password are both needed to sign in",
                statusCode: 400
            })
        }

        const user = await User.findOne({userName});

        if(!user)
        {
            return next({
                message: "User is not registered yet!",
                statusCode: 400
            })
        }
        const correctPassword = await user.checkPassword(password);
        if(!correctPassword)
        {
            return next({
                message: "Wrong password",
                statusCode: 400
            })
        }

        const token = await user.generateToken();
        res.status(201).json({success: true, token: token});
    }
)
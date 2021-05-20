
const errorHandler = (err, req, res, next) => {
    
    let status = err.statusCode || 500; //statusCode defined by me
    let message = err.message || "Internal Server Error - Sorry bro"; //message defined by me

    console.log(message);
    if(err.code === 11000) //code and keyValue are given properties of the Error-Object
    {
        if(err.keyValue.userName)
        {
            message = "Username already taken"
        }
        status = 409;
    }

    res.status(status).json({success: false, message: message});
}

module.exports = errorHandler;
//This wrapper exists to prevent always calling catch on all async functions or worse,
//wrapping all of them in a try/catch block. next() is the error handler defined in errorHandler.js
function asyncWrapper(funcToExecute)
{
    return function(req, res, next)
    {
        funcToExecute(req, res, next).catch(next); //On promise rejection, call next()
    }
}

module.exports = asyncWrapper;
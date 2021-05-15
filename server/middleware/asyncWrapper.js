function asyncWrapper(funcToExecute)
{
    return function(req, res, next)
    {
        funcToExecute(req, res, next).catch(next);
    }
}

module.exports = asyncWrapper;
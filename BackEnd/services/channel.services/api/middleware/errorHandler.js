const errorHandler = (err,req,res,next)=>{
    const messageError = err.message;
    console.error('Error caught:', err.message);
    //format error
    const error = {
        status:"Error",
        message:messageError
    }
    const status=404
    return res.status(status).json(error)
    
};
module.exports = errorHandler
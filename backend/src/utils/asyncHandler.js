
const asyncHandler=(requesthandler)=>{ // Means Create a function called asyncHandler which accepts another function called requesthandler.
    return (req,res,next)=>{ //This is an Express middleware function.
        Promise.resolve( //Promise.resolve() says Whatever this function returns, treat it as a Promise.
            requesthandler(req,res,next) //This actually executes your controller.
        ).catch(
            (err)=>next(err) //passes the error to Express's error-handling middleware.
        )
    }
}

export default asyncHandler;
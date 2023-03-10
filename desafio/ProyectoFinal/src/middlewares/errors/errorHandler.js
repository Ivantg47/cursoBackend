let errorHandler = (error,req,res,next) => {
    res.status(500).json({
        successs: false,
        error: error.message
    })
}

export default errorHandler
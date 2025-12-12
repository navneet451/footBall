export const errorHandler = (statusCode, message)=>{
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    // error.success = success;
    return error;
}


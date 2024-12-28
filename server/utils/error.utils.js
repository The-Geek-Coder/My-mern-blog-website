//Handle the errors creates the error if no error is thrown due to code.

const errorHandler=(statusCode,message)=>{
    const error=new Error();
    error.statusCode=statusCode;
    error.message=message;
    return error;
}

module.exports={errorHandler}
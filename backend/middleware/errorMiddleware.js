const ErrorHandler=require('../../utils/ErrorHandler')
const errorHandle = (err, req, res, next) => {
  let error={...err};
  error.message=err.message;
  if(err.code===11000){
    const message='Duplicate field value entered';
    error=new ErrorHandler(message,400);
  }
  if(err.name==='ValidationError'){
    const message=Object.values(err.errors).map((val)=>val.message);
    error=new ErrorHandler(message,400);
  }
  console.log(error.message);
  res.status(error.statusCode||500).json({
    success:false,
    error:error.message||"Server Error"
  })

};

module.exports = {
  errorHandle
};

//middleware =functions that execute during the request response cycle

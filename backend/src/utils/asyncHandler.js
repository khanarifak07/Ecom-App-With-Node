//higher order function that receives argument as another fucntion and returns a function
//const func = ()=> {} -- normal function
//const func = ()=> {()=>{}} -- higher order fucntion with curly braces
//const funct = ()=> ()=> {} -- higher order fucntion without curly braces

const asyncHandler = (requesthandler) => {
  return (req, res, next) => {
    Promise.resolve(requesthandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

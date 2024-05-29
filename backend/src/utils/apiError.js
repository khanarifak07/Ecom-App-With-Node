class ApiError extends Error {
  constructor(
    statusCode,
    message = "somethig went wrong",
    error = [],
    stack = ""
  ) {
    //calls the constructor of the parent class (Error) with the provided message
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.success = false;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

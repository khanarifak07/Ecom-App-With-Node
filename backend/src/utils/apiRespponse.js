class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };

//100-199 (Informational Response)
//200-299 (Success Response)
//300-399 (Redirectional Message Response)
//400-499 (Client Side Error Response)
//500-599 (Server Side Error Response)

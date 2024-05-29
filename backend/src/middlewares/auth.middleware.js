import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  //here res is not in use for that we can use _ (production level code)
  //req.cookies --> from app.use(cookieParser())
  // req.header() -- > if user is login via mobile then maybe he is sending via header
  //synax of sending via header key:Authorization value:Bearer <token_name> (Authorization: Bearer <token>)
  //But we dont want full bearer token we just want its value so we are using js replace method
  try {
    //1. get the token from cookies or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //2. check the token
    if (!token) {
      throw new ApiError(400, "Unauthorized Access");
    }

    //3. we need to verify token from jwt and decode it via ACCESS_TOKEN
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    //4. Extract the user id  from decoded token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    //5. check for user
    if (!user) {
      throw new ApiError(400, "Invalid Access Token");
    }

    //6. Now we can inject user to req.user
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(410, error?.message || "Invalid Access Token");
  }
});

export { verifyJWT };

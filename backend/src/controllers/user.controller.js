import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRespponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFilesOnCloudinary } from "../utils/cloudinary.js";

//register user
const registerUser = asyncHandler(async (req, res) => {
  //get the details of the user (req.body)
  //validate the details
  //check user is already registered or not
  //check for avatar
  //upload avatar to cloudinary
  //create user in database (.create)
  //check for created user
  //remove password and token fields
  //return response

  //1.
  const { fullName, email, password } = req.body;
  //2.
  if (!fullName && !email && !password) {
    throw new ApiError(400, "Please fill all details");
  }
  //3.
  const existedUser = await User.findOne({ $or: [{ fullName }, { email }] });
  if (existedUser) {
    throw new ApiError(
      400,
      "User is already registered with this email or fullName"
    );
  }
  4;
  // const avatarLocalPath = req.files?.avatar[0]?.path;  // req.files --> for multiple files from multer
  const avatarLocalPath = req.file?.path; //req.file for single image (from multer)
  //5.
  const avatar = await uploadFilesOnCloudinary(avatarLocalPath);
  //6.
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatar?.url || "",
  });
  //7.
  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError(400, "Something went wrong while registering user");
  }

  //8.
  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

//generate access and refresh token
const generateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};
//login user
const loginUser = asyncHandler(async (req, res) => {
  //get the data form user -> req.body
  //validate the data
  //check the user is registered or not
  //check password
  //generate access and refresh token
  //check for logged in User
  //set options to send cookies
  //send response

  //1.
  const { email, password } = req.body;
  //2.
  if (!email && !password) {
    throw new ApiError(400, "email and password is required");
  }
  //3.
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(409, "email is not registered with this email");
  }
  //4.
  const isPasswordMatch = await user.isPasswordMatch(password);
  console.log("IsPasswordMatch", isPasswordMatch);

  if (!isPasswordMatch) {
    throw new ApiError(400, "Invalid Password");
  }
  //5.
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  //6.
  const loggedInUser = await User.findById(user._id);

  //7.
  const options = {
    httpOnly: true,
    secure: true,
  };
  //8.
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export { loginUser, registerUser };

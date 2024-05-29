import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRespponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
  //4.
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // //5.
  // const avatar = UploadToCloudinary(avatarLocalPath);
  //6.
  const user = await User.create({
    fullName,
    email,
    password,
    // avatar,
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

export { registerUser };

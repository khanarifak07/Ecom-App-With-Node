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

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  //only logged In user can logout so we need to verify the user with access token from cookies
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1, //unset removes the given field
      },
    },
    {
      new: true, // new return the updated value
    }
  );
  //set the options and to clear the cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  //return res with clearCookie
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  //check for confirm password
  if (newPassword != confirmPassword) {
    throw new ApiError(400, "Confirm Password Mismatch");
  }

  //get the current user
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  //check for old Password
  const isPassMatch = await user.isPasswordMatch(oldPassword);
  console.log("IsPassMatch", isPassMatch);

  if (!isPassMatch) {
    throw new ApiError(400, "Old Password is incorrect");
  }
  //if old password match then update password
  user.password = newPassword;
  //save the updated user to databse
  await user.save({ validateBeforeSave: false });

  //return res
  return res.json(new ApiResponse(200, "Password Changed Successfully"));
});
//update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;
  //fields that needs to update
  const updateFields = {
    email,
    fullName,
  };

  //check for avatar and upload
  if (req.file) {
    const avatarLocalPath = req.file.path;
    const avatar = await uploadFilesOnCloudinary(avatarLocalPath);
    updateFields.avatar = avatar?.url || avatar;
  }

  //get the user and update fields
  const user = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: updateFields,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  //retunr res
  return res.json(
    new ApiResponse(200, user, "Account detials updated successfully")
  );
});
//remove avatar
const removeAvatar = asyncHandler(async (req, res) => {
  //get the current user and remove avatar
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        avatar: 1,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  //return res
  return res.json(new ApiResponse(200, user, "Avatar removed sucessfully"));
});

export {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  registerUser,
  removeAvatar,
  updateAccountDetails,
};

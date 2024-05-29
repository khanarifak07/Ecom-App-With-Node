import { ApiResponse } from "../utils/apiRespponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//register user
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Success"));
});

export { registerUser };

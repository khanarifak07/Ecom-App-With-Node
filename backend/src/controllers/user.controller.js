import { asyncHandler } from "../utils/asyncHandler.js";

//register user
const registerUser = asyncHandler(async (req, res) => {
  return res.json({ message: "Working" });
});

export { registerUser };

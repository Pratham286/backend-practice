import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, fullname, email } = req.body;
  if (
    [fullname, password, username, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exist with given email/username");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImgLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "User can not be created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Register"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Username / email required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "User Not Found");
  }

  const valid = await user.isPasswordCorrect(password);
  if (!valid) {
    throw new ApiError(400, "Wrong Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const user1 = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: user1,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set : {
      refreshToken : undefined,
    },
  },
  {
    new : true,
  },
)
const options = {
    httpOnly: true,
    secure: true,
  };
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
      new ApiResponse(
        200,
        {},
        "User logout successfully"
      )
    )
});

export const refreshAccessToken = asyncHandler(async (req, res) =>{
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if(!token)
    {
      throw new ApiError(401, "token is missing");
    }

   try {
     const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
 
     if(!decodedToken){
       throw new ApiError(401, "token is invalid");
     }
     
     const user = await User.findById(decodedToken._id);
     
     if(!user)
       {
       throw new ApiError(401, "token is invalid");
     }
     
     if(token !== user?.refreshToken)
       {
       throw new ApiError(401, "token is invalid");
     }
     const options = {
     httpOnly: true,
     secure: true,
   };
 
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
 
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("accessToken", refreshToken, options)
   .json(
       new ApiResponse(
         200,
         {accessToken, refreshToken},
         "Access token refreshed"
       )
     )
   } catch (error) {
      throw new ApiError(401, error?.message || "Something went wrong");
      
   }
})

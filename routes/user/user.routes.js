const express = require("express");
const {
  requestOtp,
  verifyOtp,
  saveSelectedBrand,
  saveSelectedCar,
  getAllUser,
  saveAdditionalInfo,deleteSelectedCar,
  getUserCars,
  getUserInfo,
  switchCar
} = require("../../controller/userControllers/user.controller");
const { auth } = require("../../middleware/middleware");
 

const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.post("/send-otp", requestOtp);
userRouter.patch("/add-info", saveAdditionalInfo);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/select-brand", saveSelectedBrand);
userRouter.post("/select-car", saveSelectedCar);
userRouter.post("/switch-car", switchCar);
userRouter.delete('/delete-car', deleteSelectedCar);
userRouter.get('/:userId/cars', getUserCars);
userRouter.get('/user/me', auth, getUserInfo);

module.exports = {
  userRouter,
};

const mongoose = require("mongoose");

const carPriceSchema = new mongoose.Schema({
 productId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
  required: true,
 },
 carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
 variant: {
  type: String,
  enum: ["Petrol", "Diesel", "CNG", "Electric"],
  required: true,
 },
 transmission: { type: String, enum: ["Manual", "Automatic"], required: true },
 mrp: Number,
 givenPrice: Number,
});

const CarPrice = mongoose.model("CarPrice", carPriceSchema);
module.exports = CarPrice;

/*
I want to create price according to car so take the previous example
example i have a maruti suxuki brand and it has 100 cars and each car has different transmission type and fule type
if there is a car swift in maruti suzuki it has 2 transmision type and 4 fule type so there is 8 different swift car 
same for  swift desire there is 2 transmission and 4 fule type so it has also 8 cars
same for brezza 
so if i calcilate total cars there is 24 cars but i want when i hit the api get car by brand it shows only 3 cars breza, swift, swift desire 
because transmission and fule is what type of the cat swift is or desire is or the brzza is

In this i want to create price for a product if i am setting the price of swift all 8 car price has been set my be if i dont want to change the price for swift desil manual  i am able to do for 7 cars 
so how can i achive this


*/

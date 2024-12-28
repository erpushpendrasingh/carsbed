const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
 {
  name: String,
  email: {
   type: String,
   unique: true,
   sparse: true,
  },
  mobile: {
   type: String,
   unique: true,
   required: true,
  },
  verify: {
   type: Boolean,
   default: false,
  },
  role: {
   type: String,
   enum: ["user", "vendor", "admin"],
   default: "user",
  },
  password: String,
  status: {
   type: String,
   enum: ["pending", "approved", "rejected"],
   default: "pending",
  },
  referralCode: {
   type: String,
   unique: true,
  },
  referredBy: {
   type: Schema.Types.ObjectId,
   ref: "User",
  },
  coins: {
   type: Number,
   default: 0,
  },
  documents: {
   aadhaar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
   },
   panCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
   },
   gstCertificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
   },
   storePhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
   },
  },
  documentStatus: {
   type: String,
   enum: ["n/a", "submitted", "approved", "rejected"],
   default: "n/a",
  },
  cars: [
   {
    type: Schema.Types.ObjectId,
    ref: "Car",
   },
  ],
  currentCar: {
   type: Schema.Types.ObjectId,
   ref: "Car",
  },
  dailyBookingCap: {
   type: Number,
   default: 0,
  },
  monthlyBookingCap: {
   type: Number,
   default: 0,
  },
 },
 {
  timestamps: true,
 }
);

// Add pre-save hook for password hashing, if required
userSchema.pre("save", async function (next) {
 if (this.isModified("password") && this.password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
 }
 next();
});

const NewUser = mongoose.model("NewUser", userSchema);

module.exports = NewUser;

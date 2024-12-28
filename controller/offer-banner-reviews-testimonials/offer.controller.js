const Offer = require("../../model/offer-banner-reviews-testimonials/offerSchema.model"); // Adjust the path as necessary

const createOffer = async (req, res) => {
 const {
  title,
  description,
  startDate,
  endDate,
  subCategory,
  imageUrl,
  discountPercent,
 } = req.body;
 console.log(
  "data",
  title,
  description,
  startDate,
  endDate,
  subCategory,
  imageUrl,
  discountPercent
 );
 try {
  const newOffer = new Offer({
   title,
   description,
   imageUrl,
   startDate,
   endDate,
   subCategory,
   discountPercent, // Add discountPercent
  });

  await newOffer.save();
  res.status(201).json(newOffer);
 } catch (error) {
  console.error("Error saving the offer:", error);
  res.status(500).json({ error: "Error saving the offer" });
 }
};

const getOffers = async (req, res) => {
 try {
  const offers = await Offer.find()
   .populate({
    path: "subCategory",
    select: "subCategoryName _id",
   })
   .sort({ createdAt: -1, title: 1 }); // Ensure categoryName is a valid field in your Offer model
  res
   .status(200)
   .json({ offers: offers, message: "Successfully retrieved offers" });
 } catch (error) {
  console.error("Error retrieving offers:", error);
  res.status(500).json({ error: "Error retrieving offers" });
 }
};

const getOfferById = async (req, res) => {
 try {
  const offer = await Offer.findById(req.params.id).populate({
   path: "subCategory",
   select: "subCategoryName _id",
  });
  if (!offer) return res.status(404).json({ message: "Offer not found" });
  res.status(200).json(offer);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

const updateOffer = async (req, res) => {
 const {
  title,
  description,
  startDate,
  endDate,
  subCategory,
  imageUrl,
  discountPercent,
 } = req.body;

 try {
  const updatedOffer = await Offer.findByIdAndUpdate(
   req.params.id,
   {
    title,
    description,
    startDate,
    endDate,
    subCategory,
    imageUrl,
    discountPercent,
   }, // Add discountPercent
   { new: true, runValidators: true }
  ).populate({
   path: "subCategory",
   select: "subCategoryName _id",
  });
  if (!updatedOffer)
   return res.status(404).json({ message: "Offer not found" });
  res.status(200).json(updatedOffer);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

const deleteOffer = async (req, res) => {
 try {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  await Offer.findByIdAndDelete(req.params.id);
  res.status(204).json({ message: "Offer deleted" });
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

module.exports = {
 createOffer,
 getOffers,
 getOfferById,
 updateOffer,
 deleteOffer,
};

// const Offer = require("../../model/offer-banner-reviews-testimonials/offerSchema.model"); // Adjust the path as necessary

// const createOffer = async (req, res) => {
//   const { title, description, startDate, endDate, subCategory, imageUrl } = req.body;

//   try {
//     const newOffer = new Offer({
//       title,
//       description,
//       imageUrl,
//       startDate,
//       endDate,
//       subCategory,
//     });

//     await newOffer.save();
//     res.status(201).json(newOffer);
//   } catch (error) {
//     console.error("Error saving the offer:", error);
//     res.status(500).json({ error: "Error saving the offer" });
//   }
// };

// const getOffers = async (req, res) => {
//   try {
//     const offers = await Offer.find();
//     res
//       .status(200)
//       .json({ offers: offers, message: "Successfully getting offers" });
//   } catch (error) {
//     res.status(500).json({ error: "Error retrieving offers" });
//   }
// };

// const getOfferById = async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id);
//     if (!offer) return res.status(404).json({ message: "Offer not found" });
//     res.status(200).json(offer);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateOffer = async (req, res) => {
//   const { title, description, startDate, endDate, subCategory, imageUrl } = req.body;

//   try {
//     const updatedOffer = await Offer.findByIdAndUpdate(
//       req.params.id,
//       { title, description, startDate, endDate, subCategory, imageUrl },
//       { new: true, runValidators: true }
//     );
//     if (!updatedOffer)
//       return res.status(404).json({ message: "Offer not found" });
//     res.status(200).json(updatedOffer);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteOffer = async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id);
//     if (!offer) return res.status(404).json({ message: "Offer not found" });

//     await Offer.findByIdAndDelete(req.params.id);
//     res.status(204).json({ message: "Offer deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createOffer,
//   getOffers,
//   getOfferById,
//   updateOffer,
//   deleteOffer,
// };

// // const upload = require("../../middleware/upload");
// // const Offer = require("../../model/offer-banner-reviews-testimonials/offerSchema.model"); // Adjust the path as necessary
// // const createOffer = async (req, res) => {
// //  upload.single("image")(req, res, async (err) => {
// //   if (err) {
// //    console.error("Error uploading image:", err);
// //    return res.status(400).json({ error: "Error uploading image" });
// //   }

// //   const { title, description, startDate, endDate, link } = req.body;
// //   const imageUrl = req.file.location; // The URL of the uploaded image

// //   try {
// //    const newOffer = new Offer({
// //     title,
// //     description,
// //     imageUrl,
// //     startDate,
// //     endDate,
// //     link,
// //    });

// //    await newOffer.save();
// //    res.status(201).json(newOffer);
// //   } catch (error) {
// //    console.error("Error saving the offer:", error);
// //    res.status(500).json({ error: "Error saving the offer" });
// //   }
// //  });
// // };

// // const getOffers = async (req, res) => {
// //  try {
// //   const offers = await Offer.find();
// //   res
// //    .status(200)
// //    .json({ offers: offers, message: "Successfully getting offers" });
// //  } catch (error) {
// //   res.status(500).json({ error: "Error retrieving offers" });
// //  }
// // };

// // const getOfferById = async (req, res) => {
// //  try {
// //   const offer = await Offer.findById(req.params.id);
// //   if (!offer) return res.status(404).json({ message: "Offer not found" });
// //   res.status(200).json(offer);
// //  } catch (error) {
// //   res.status(500).json({ message: error.message });
// //  }
// // };

// // const updateOffer = async (req, res) => {
// //  const { title, description, startDate, endDate, link } = req.body;

// //  try {
// //   const updatedOffer = await Offer.findByIdAndUpdate(
// //    req.params.id,
// //    { title, description, startDate, endDate, link },
// //    { new: true, runValidators: true }
// //   );
// //   if (!updatedOffer)
// //    return res.status(404).json({ message: "Offer not found" });
// //   res.status(200).json(updatedOffer);
// //  } catch (error) {
// //   res.status(500).json({ message: error.message });
// //  }
// // };

// // const deleteOffer = async (req, res) => {
// //  try {
// //   const offer = await Offer.findById(req.params.id);
// //   if (!offer) return res.status(404).json({ message: "Offer not found" });

// //   await Offer.findByIdAndDelete(req.params.id);
// //   res.status(204).json({ message: "Offer deleted" });
// //  } catch (error) {
// //   res.status(500).json({ message: error.message });
// //  }
// // };

// // module.exports = {
// //  createOffer,
// //  getOffers,
// //  getOfferById,
// //  updateOffer,
// //  deleteOffer,
// // };
// // // const createOffer = async (req, res) => {
// // //  upload.single("image")(req, res, async (err) => {
// // //   if (err) {
// // //    console.error("Error uploading image:", err);
// // //    return res.status(400).json({ error: "Error uploading image" });
// // //   }

// // //   const { title, description, startDate, endDate, link } = req.body;
// // //   const imageUrl = req.file.location; // The URL of the uploaded image

// // //   try {
// // //    const newOffer = new Offer({
// // //     title,
// // //     description,
// // //     imageUrl,
// // //     startDate,
// // //     endDate,
// // //     link,
// // //    });

// // //    await newOffer.save();
// // //    res.status(201).json(newOffer);
// // //   } catch (error) {
// // //    console.error("Error saving the offer:", error);
// // //    res.status(500).json({ error: "Error saving the offer" });
// // //   }
// // //  });
// // // };

// // // const getOffers = async (req, res) => {
// // //  try {
// // //   const offers = await Offer.find();
// // //   res
// // //    .status(200)
// // //    .json({ offers: offers, message: "successfully getting offers" });
// // //  } catch (error) {
// // //   res.status(500).json({ error: "Error retrieving offers" });
// // //  }
// // // };

// // // module.exports = {
// // //  createOffer,
// // //  getOffers,
// // // };

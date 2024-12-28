const upload = require("../../middleware/upload");
const About = require("../../model/company_profile/about.model");
// const About = require("../../model/About-PrivacyPolicy-TermsConditions/about.model");

exports.createAbout = (req, res) => {
 upload.single("image")(req, res, async (err) => {
  if (err) {
   console.error("Error uploading image:", err);
   return res.status(400).json({ error: "Error uploading image" });
  }

  const { visionAndMission, story, services, socialProof } = req.body;
  const image = req.file ? req.file.location : req.body.image; // Use uploaded image or reference URL

  try {
   const newAbout = new About({
    visionAndMission,
    story,
    services,
    socialProof,
    image,
   });

   await newAbout.save();
   res.status(201).json(newAbout);
  } catch (err) {
   console.error("Error creating about page content:", err);
   res.status(500).json({ error: err.message });
  }
 });
};

exports.updateAbout = (req, res) => {
 upload.single("image")(req, res, async (err) => {
  if (err) {
   console.error("Error uploading image:", err);
   return res.status(400).json({ error: "Error uploading image" });
  }

  const { id } = req.params;
  const { visionAndMission, story, services, socialProof } = req.body;
  const image = req.file ? req.file.location : req.body.image; // Use uploaded image or reference URL

  try {
   const updateData = { visionAndMission, story, services, socialProof };
   if (image) updateData.image = image;

   const updatedAbout = await About.findByIdAndUpdate(id, updateData, {
    new: true,
   });

   res.status(200).json(updatedAbout);
  } catch (err) {
   console.error("Error updating about page content:", err);
   res.status(500).json({ error: err.message });
  }
 });
};

exports.deleteAbout = async (req, res) => {
 try {
  const { id } = req.params;
  await About.findByIdAndDelete(id);
  res.status(200).json({ message: "About page content deleted successfully" });
 } catch (err) {
  console.error("Error deleting about page content:", err);
  res.status(500).json({ error: err.message });
 }
};

exports.getAbout = async (req, res) => {
 try {
  const about = await About.find();
  res.status(200).json(about);
 } catch (err) {
  console.error("Error fetching about page content:", err);
  res.status(500).json({ error: err.message });
 }
};

exports.getAboutById = async (req, res) => {
 try {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
   return res.status(404).json({ message: "About page content not found" });
  }
  res.status(200).json(about);
 } catch (err) {
  console.error("Error fetching about page content:", err);
  res.status(500).json({ error: err.message });
 }
};

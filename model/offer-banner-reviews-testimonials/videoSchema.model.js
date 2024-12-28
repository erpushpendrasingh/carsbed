const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
 title: { type: String, required: true },
 description: { type: String },
 videoUrl: { type: String, required: true },
 thumbnailUrl: { type: String },
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;

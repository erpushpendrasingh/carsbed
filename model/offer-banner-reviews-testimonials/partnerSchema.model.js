const partnerSchema = new Schema({
 companyName: { type: String, required: true },
 logoUrl: { type: String },
 websiteUrl: { type: String },
});

const Partner = mongoose.model("Partner", partnerSchema);
module.exports = Partner;

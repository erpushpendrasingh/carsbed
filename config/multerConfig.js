const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Initialize the S3 client with AWS credentials and region
const s3 = new S3Client({
 region: process.env.AWS_REGION,
 credentials: {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
 },
});

// Function to upload file to S3
const uploadFileToS3 = async (file) => {
 const params = {
  Bucket: process.env.S3_BUCKET_NAME,
  Key: `${Date.now()}-${file.originalname}`, // Unique key for each file
  Body: file.buffer,
  ContentType: file.mimetype,
 };

 try {
  const command = new PutObjectCommand(params);
  await s3.send(command); // Upload the file
  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`; // Return the S3 file URL
 } catch (error) {
  throw new Error("Failed to upload file to S3: " + error.message);
 }
};

module.exports = { uploadFileToS3 };

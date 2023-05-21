"use strict";
const firebase = require("./firebaseService");
const productController = require("../controllers/productCotroller");

function FileService() {
  const SELF = {};
  return {
    uploadFile: (req, res) => {
      console.log("Uploading", req.body.data);
      try {
        if (!req.body) {
          return res.json({ s: 404, msg: "File not found" });
        }
        const blob = firebase.bucket.file(req.body.originalname);
        const blobWriter = blob.createWriteStream({
          metadata: {
            contentType: req.body.mimetype,
          },
        });
        blobWriter.on("error", (err) => {
          console.log("upload image error 0: ", err);
        });
        blobWriter.on("finish", () => {
          console.log("Uploaded");
          const options = {
            action: "read",
            expires: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 ngay
          };
          blob.getSignedUrl(options).then(async (urls) => {
            return res.json({
              urlUploaded: urls[0],
            });
          });
        });
        blobWriter.end(req.body.buffer);
      } catch (error) {
        console.log("upload image error 1: ", error);
      }
    },
  };
}

module.exports = new FileService();

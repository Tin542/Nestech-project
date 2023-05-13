"use strict";
const firebase = require("./firebaseService");
const productController = require("../controllers/productCotroller")

function FileService() {
  const SELF = {};
  return {
    uploadFile: (req, res) => {
      try {
        console.log(req.file);
        if (!req.file) {
          return res.json({ s: 404, msg: "File not found" });
        }
        const blob = firebase.bucket.file(req.file.originalname);
        const blobWriter = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
        blobWriter.on("error", (err) => {
          console.log(err);
        });
        blobWriter.on("finish", () => {
          console.log("Uploaded");
          const options = {
            action: "read",
            expires: Date.now() + 1000 * 60 * 60,
          };
          blob.getSignedUrl(options).then(async (urls) => {
            let productList = await productController.getListDB();
            return res.render("pages/productList", {
              urlUploaded: urls[0],
              products: productList
            });
          });
        });
        blobWriter.end(req.file.buffer);
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = new FileService();
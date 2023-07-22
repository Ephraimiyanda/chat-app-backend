const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dg0kdnwt1",
    api_key:"743174149656362",
    api_secret: "NT0lp3G44g26b2jYH8BX5Ju0UsY",
  });
  
  exports.uploads = (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(
        file,
        (result) => {
          resolve({ url: result.url, id: result.public_id });
        },
        { resource_type: "auto" }
      );
    });
  };
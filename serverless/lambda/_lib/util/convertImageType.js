const Jimp = require('jimp');
const fs = require('fs');

exports.convertImage = async function (orginalImageBody, imageId, imageType) {
  return Jimp.read(Buffer.from(orginalImageBody, 'base64'))
    .then((imageLoaded) => {
      return (
        imageLoaded
          .resize(256, 256) // resize
          // .quality(60) // set JPEG quality
          // .greyscale() // set greyscale
          .write(`/tmp/${imageId}.${imageType}`)
      ); // save
    })
    .catch((err) => {
      console.error(err);
    });
};

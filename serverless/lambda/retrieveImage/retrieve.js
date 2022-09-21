const helper = require('../_lib/util/helper.js');
const ProgImageTools = require('progimage-tools');

const Jimp = require('jimp');

exports.handler = async (event, context) => {
  try {
    // (1) Retrieve the imageId & imageType from URL
    const imageId = event.pathParameters.imageId;
    const imageType = event.pathParameters.imageType;
    const greyscale = event.queryStringParameters?.greyscale;

    // (2) Use NPM library - Extract the file from AWS DynamoDB and AWS S3
    let progImageTools = new ProgImageTools();
    let image;
    try {
      image = await progImageTools.retrieve(
        process.env.ImagesBucketName,
        process.env.ImagesTableName,
        imageId,
      );
    } catch (error) {
      console.log('error (retrieve):', error);
      return helper.generateResponse(404, {}, 'Not found', false);
    }

    // console.log('image:', image);

    // (3) Check if the imageType is same as what we store in S3
    let imageFile;
    if (image.ContentType === `image/${imageType}` && greyscale !== 'true') {
      // (3a) Check if it's requesting for same file - do nothing
      console.log(`The imageType is same as requested (${imageType}).`);
      imageFile = image.Body.toString('base64');
    } else {
      // (3b) Other file type or greyscale - Running Jimp image processing
      console.log(
        `The imageType requested is (${imageType}) or with greyscale. Converting image...`,
      );

      // (3b-i) Check MIME type
      let mimiTypeForJimp = Jimp.MIME_PNG;
      if (imageType.toLowerCase() === 'png') {
        mimiTypeForJimp = Jimp.MIME_PNG;
      } else if (imageType.toLowerCase() === 'jpeg') {
        mimiTypeForJimp = Jimp.MIME_JPEG;
      } else if (imageType.toLowerCase() === 'bmp') {
        mimiTypeForJimp = Jimp.MIME_BMP;
      }

      // (3b-ii) Jimp processing
      let JimpResult = await Jimp.read(image.Body)
        .then((jimpImage) => {
          if (greyscale === 'true') {
            jimpImage.greyscale(); // set greyscale
          }
          return jimpImage.getBufferAsync(mimiTypeForJimp); // save to buffer
        })
        .catch((err) => {
          console.error(err);
        });
      imageFile = JimpResult.toString('base64');
    }

    // (4) Response the image
    return helper.generateResponse(
      200,
      {
        'content-type': `image/${imageType}`,
      },
      imageFile,
      true,
    );
  } catch (error) {
    console.log('Encountered error:', error);
    return helper.generateResponse(500, {}, 'Internal Server Error', false);
  }
};

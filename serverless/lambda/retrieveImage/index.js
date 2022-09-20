const helper = require('../_lib/util/helper.js');
const convertImageType = require('../_lib/util/convertImageType.js');
const ImagesRepository = require('../_lib/repository/ImagesRepository.js');
const fs = require('fs');

exports.handler = async (event, context) => {
  try {
    // (1) Retrieve the imageId & imageType from URL
    const imageId = event.pathParameters.imageId;
    const imageType = event.pathParameters.imageType;

    // (2) Extract the file from AWS DynamoDB and AWS S3
    let imagesRepository = new ImagesRepository(
      process.env.ImagesBucketName,
      process.env.ImagesTableName,
    );
    let image = await imagesRepository.get(imageId);
    console.log('image:', image);

    // (3) Check if the imageType is same as what we store in S3
    // let imageFile;
    if (image.ContentType === `image/${imageType}`) {
      console.log(`The imageType is same as requested (${imageType}).`);
      // imageFile = image.Body.toString('base64');
    } else {
      // console.log(`The imageType requested is (${imageType}). Converting image...`);
      // // let resultzzz = await convertImageType.convertImage(imageFile, imageId, imageType);
      // // console.log('resultzzz:', resultzzz);
      // await convertImageType.convertImage(image.Body, imageId, imageType);
      // imageFile = fs.readFileSync(`/tmp/${imageId}.${imageType}`);
    }
    return helper.generateResponse(
      200,
      {
        'content-type': 'image/jpeg',
      },
      image.Body.toString('base64'),
      true,
    );
  } catch (error) {
    console.log('Encountered error:', error);
    return helper.generateResponse(500, {}, 'Internal Server Error', false);
  }
};

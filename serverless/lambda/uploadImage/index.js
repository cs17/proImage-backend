var bodySchema = require('./_schema/bodySchema.json');
const helper = require('../_lib/util/helper.js');
const ImagesTableName = 'Images';
const ImagesBucketName = 'images-bucket';
const ImagesRepository = require('../_lib/repository/ImagesRepository.js');
const axios = require('axios').default;

exports.handler = async (event, context) => {
  try {
    // (1) Extract payload body
    let payload;
    if (event.isBase64Encoded) {
      console.log('isBase64Encoded:' + event.isBase64Encoded);
      let pb = Buffer.from(event.body, 'Base64').toString();
      payload = JSON.parse(pb);
    } else {
      payload = JSON.parse(event.body);
    }
    console.log('Body (JSON):', payload);

    // (2) validate Schema
    if (!helper.validateAJV(payload, bodySchema)) {
      throw 'Schema Check failed';
    }

    // (3) Assign an unique ID for ImageID (unique per invoke)
    const imageId = context.awsRequestId;
    console.log('uniqueID for (imageId):', imageId);

    // (4) Assign the correct imageFileBase64, either from user provided base64 image (primary) or URL
    if (payload.base64) {
      // Respect: If user provided the base64 Image
      imageFileBase64 = payload.base64;
    } else {
      // If user didn't provide the base64 Image.
      let image = await axios.get(payload.url, { responseType: 'arraybuffer' });
      let raw = Buffer.from(image.data).toString('base64');
      imageFileBase64 = 'data:' + image.headers['content-type'] + ';base64,' + raw;
    }

    // (5) Upload to S3 and store imageInfo in DynamoDb
    let imagesRepository = new ImagesRepository(ImagesBucketName, ImagesTableName);
    await imagesRepository.uploadImage(imageId, imageFileBase64, payload.desc);

    // (6) Response unique imageID for identifier later
    return generateResponse(200, { imageId: imageId });
  } catch (error) {
    console.log('Encountered error:', error);
    return generateResponse(500, 'Internal Server Error');
  }
};

const generateResponse = (statusCode, body) => {
  let response = {
    statusCode: parseInt(statusCode),
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  };
  return response;
};
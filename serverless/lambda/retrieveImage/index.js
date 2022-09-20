const helper = require('../_lib/util/helper.js');
const ImagesRepository = require('../_lib/repository/ImagesRepository.js');

exports.handler = async (event, context) => {
  try {
    // (1) Retrieve the imageId from URL
    const imageId = event.pathParameters.imageId;

    // (2) Extract the file from AWS DynamoDB and AWS S3
    let imagesRepository = new ImagesRepository(
      process.env.ImagesBucketName,
      process.env.ImagesTableName,
    );
    let image = await imagesRepository.get(imageId);
    console.log('image:', image);

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

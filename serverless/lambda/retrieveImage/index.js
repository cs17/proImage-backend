const fs = require('fs');
const ImagesTableName = 'Images';
const ImagesRepository = require('../_lib/repository/ImagesRepository.js');

exports.handler = async (event, context) => {
  try {
    // console.log('unique ID:', context.awsRequestId);
    const imageId = event.pathParameters.imageId;
    let imagesRepository = new ImagesRepository(ImagesTableName);
    let imageInfo = await imagesRepository.get(imageId);

    /* data: {
      path: '_localImages/cl89w67ll0002t3xpgx0zh80x.png',
      Desc: 'Testing uploaded image for test 001',
      imageId: 'cl89w67ll0002t3xpgx0zh80x'
    }*/
    let imageFile = fs.readFileSync(`../${imageInfo.path}`);
    console.log('imageFile:', imageFile);

    return generateResponse(200, data);
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

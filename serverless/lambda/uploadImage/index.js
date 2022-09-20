exports.handler = async (event, context) => {
  try {
    console.log('Start Applcation...')
    return generateResponse(200, 'Hello World');
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

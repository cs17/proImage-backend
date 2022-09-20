let AWS;
if (process.env._X_AMZN_TRACE_ID || process.env.AWS_XRAY_CONTEXT_MISSING) {
  AWS = require('aws-xray-sdk-core').captureAWS(require('aws-sdk'));
} else {
  console.log('Serverless Offline detected; skipping AWS X-Ray setup');
  AWS = require('aws-sdk');
}

const s3 = new AWS.S3({
  s3ForcePathStyle: true,
  accessKeyId: 'S3RVER', // This specific key is required when working offline
  secretAccessKey: 'S3RVER',
  endpoint: new AWS.Endpoint('http://localhost:4569'),
});

exports.listObject = async (params) => {
  try {
    /*
    let params = {
        Bucket: bucketName,
        Delimiter: delimiter, // A delimiter is a character you use to group keys, such as slash (/)
        Prefix: 'STRING_VALUE' // Limits the response to keys that begin with the specified prefix.
    };
    */
    return s3.listObjectsV2(params).promise();
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

exports.getObject = async (params) => {
  try {
    /*
    let params = {
        Bucket: bucketName,
        Key: objectKey
    };
    */
    return s3.getObject(params).promise();
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

exports.getObjectStream = async (params) => {
  try {
    /*
    let params = {
        Bucket: bucketName,
        Key: objectKey
    };
    */
    return await s3.getObject(params).createReadStream();
  } catch (error) {
    log.error(error);
    throw error;
  }
};

exports.putObject = async (params) => {
  try {
    /*
    var params = {
        Bucket: bucketName,
        Key: objectKey,
        Body: <Binary String>,
        ContentType: "application/zip",
        Tagging: "key1=value1&key2=value2" (Optional)
    };
    */
    return s3.putObject(params).promise();
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

// Delete Object
exports.deleteObject = async (params) => {
  try {
    /*
    var params = {
        Bucket: bucketName,
        Key: objectKey,
    };
    */
    return s3.deleteObject(params).promise();
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

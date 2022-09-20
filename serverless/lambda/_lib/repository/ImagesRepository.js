const path = require('path');
const dynamoDb = require('../aws/dynamoDb.js');
const s3 = require('../aws/s3.js');

class ImagesRepository {
  constructor(bucketName, tableName) {
    this.bucketName = bucketName;
    this.tableName = tableName;
  }

  async get(imageId) {
    try {
      let dynamoDb_get_params = {
        TableName: this.tableName,
        Key: {
          imageId: imageId,
        },
      };

      console.log('dynamoDb_get_params:', dynamoDb_get_params);
      let record = await dynamoDb.get(dynamoDb_get_params);
      console.log('record (from DynamoDB):', record);

      if (record.Item?.s3Bucket && record.Item?.s3Key) {
        let s3_get_params = {
          Bucket: record.Item.s3Bucket,
          Key: record.Item.s3Key,
        };
        // console.log('s3_get_params:', s3_get_params);
        // return s3.getObjectStream(s3_get_params);
        return s3.getObject(s3_get_params);
      } else {
        throw 'imageId not found.';
      }
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(imagesHostURL, imageId, imageFileBase64, desc) {
    try {
      const base64Data = new Buffer.from(
        imageFileBase64.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
      const type = imageFileBase64.split(';')[0].split('/')[1];
      let s3_put_params = {
        Bucket: this.bucketName,
        Key: `${imageId}.${type}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`, // required. Notice the back ticks
      };
      // console.log('s3_put_params:', s3_put_params);
      await s3.putObject(s3_put_params);

      let dynamoDb_put_params = {
        TableName: this.tableName,
        Item: {
          imageId: imageId,
          s3Bucket: this.bucketName,
          s3Key: `${imageId}.${type}`,
          desc: desc,
        },
      };
      // console.log('dynamoDb_put_params:', dynamoDb_put_params);
      await dynamoDb.put(dynamoDb_put_params);
      return `${imagesHostURL}/${imageId}.${type}`;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ImagesRepository;

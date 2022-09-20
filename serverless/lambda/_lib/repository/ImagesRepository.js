const path = require('path');
const dynamoDb = require('../aws/dynamoDb.js');
const s3 = require('../aws/s3.js');

class ImagesRepository {
  constructor(bucketName, tableName) {
    this.bucketName = bucketName;
    this.tableName = tableName;
  }

  // async get(imageId) {
  //   try {
  //     let params = {
  //       TableName: this.tableName,
  //       Key: {
  //         imageId: imageId,
  //       },
  //     };

  //     console.log('get', { params });
  //     let result = await dynamoDb.get(params);
  //     return result.Item ? result.Item : {};
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async uploadImage(imageId, imageFileBase64, desc) {
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
      console.log('s3_put_params:', s3_put_params);
      await s3.putObject(s3_put_params);

      let dynamoDb_put_params = {
        TableName: this.tableName,
        Item: {
          imageId: imageId,
          bucket: this.bucketName,
          key: `${imageId}.${type}`,
          desc: desc,
        },
      };
      console.log('dynamoDb_put_params:', dynamoDb_put_params);
      return dynamoDb.put(dynamoDb_put_params);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ImagesRepository;

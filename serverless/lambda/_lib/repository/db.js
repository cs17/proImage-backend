const log = require('../util/log.js'); // For structured logging
const dynamoDb = require('../aws/dynamoDb.js');

class FileRouteRecordRepository {
  constructor(tableName) {
    this.table = tableName;
  }

  async query(routeId) {
    try {
      let params = {
        TableName: this.table,
        KeyConditionExpression: '#routeId = :routeId',
        ExpressionAttributeNames: {
          '#routeId': 'routeId',
        },
        ExpressionAttributeValues: {
          ':routeId': routeId,
        },
      };
      log.debug('query', { params });

      return dynamoDb.query(params);
    } catch (error) {
      log.error(error);
      throw `File Routing Rules (${routeId}) query failed`;
    }
  }
}

module.exports = FileRouteRecordRepository;

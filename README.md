# proImage-backend

## (Pre) Setup Docker For AWS DynamoDb

1. Download Docker Destop (Ref: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html#docker)
2. Go to file `docker-compose.yml` located in `proImage-backend/local-dynamoDb-docker`, run this command in the same directory:
   ```
   docker-compose up
   ```
3. Test the connection to AWS DynamoDB, run this command in your CLI:
   ```
   aws dynamodb list-tables --endpoint-url http://localhost:8000
   ```
4. Create table for Images info, run this command in your CLI:

   ```
   aws dynamodb create-table --endpoint-url http://localhost:8000 \
   --table-name Images \
   --attribute-definitions \
       AttributeName=imageId,AttributeType=S \
   --key-schema AttributeName=imageId,KeyType=HASH \
   --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
   ```

5. Create two(2) records in Images table, run this command in your CLI:

   ```
   aws dynamodb put-item --endpoint-url http://localhost:8000 \
   --table-name Images \
   --item \
       '{"imageId": {"S": "001"}, "desc": {"S": "Testing uploaded image for test 001"}}' \
   --return-consumed-capacity TOTAL
   ```

   and,

   ```
   aws dynamodb put-item --endpoint-url http://localhost:8000 \
   --table-name Images \
   --item \
       '{"imageId": {"S": "002"}, "desc": {"S": "Testing uploaded image for test 002"}}' \
   --return-consumed-capacity TOTAL
   ```

6. Scan entire table.

   ```
   aws dynamodb scan --endpoint-url http://localhost:8000 --table-name Images
   ```

7. (Do not execute) Delete the entire table.
   ```
    aws dynamodb delete-table --endpoint-url http://localhost:8000 \
        --table-name Images
   ```

---

## Run Serverless Offline

1. Open your CLI, go to `proImage-backend/serverless/lambda`, run this command to start serverless offline:

   ```
   serverless offline --stage dev
   ```

2. Make sure AWS S3 started locally by accessing this url: `http://127.0.0.1:4569/`, you should see a bucket name `images-bucket`

3. Go to your postman, try hit this url `(GET) http://localhost:3000/dev/retrieve/cl89w67ll0002t3xpgx0zh80x`

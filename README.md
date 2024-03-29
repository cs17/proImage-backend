# proImage-backend

## Description:

This demo application illustrate 2 APIs (/upload and /retrieve) that allow our client to perform these actions:

- **Upload** - It allows our client to upload an image via a **remote URL** or an **image directly**. The API will store the image file into **AWS S3** and a record of the entry into **AWS DynamoDB**. A **unique identifier** (URL) will return in the API response to allow our client to retrieve the image at a later stage.

- **Retrieve** - It allows our client to retrieve an image that our client uploaded earlier and **transform the image type** formats (e.g. PNG, JPEG or BMP), **resize** and **greyscale** the image if needed.

The underlying APIs are developed using:

- AWS Lambda, API Gateway, S3 and DynamoDB.
- NodeJS / NPM
- Serverless Framework (https://www.serverless.com/). It allows us to quickly deploy to AWS or other CSPs (Cloud Service Providers) using a single framework.
- Jest automated tests.

---

## Usage:

### A. (Pre - One time setup) Setup Docker For AWS DynamoDb

1. Download Docker Destop (Ref: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html#docker)
2. Go to file `docker-compose.yml` located in `proImage-backend/local-dynamoDb-docker`, run this command in the same directory:
   ```
   docker-compose up
   ```
3. Test the connection to AWS DynamoDB, run this command in your CLI:

   ```
   aws dynamodb list-tables --endpoint-url http://localhost:8000
   ```

   You should be see the result as this,

   ```
   {
    "TableNames": [
        "Images"
    ]
   }
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

7. (Do not execute) Delete the entire table in AWS DynamoDB if needed.
   ```
    aws dynamodb delete-table --endpoint-url http://localhost:8000 \
        --table-name Images
   ```

### B. Run Serverless Offline

1. Setup local Docker for AWS DynamoDB, please refer to _Step A. (Pre - One time setup) Setup Docker For AWS DynamoDb_ below.

2. Go to `proImage-backend/serverless`, run npm install

   ```
   npm install
   ```

3. Open your CLI, go to `proImage-backend/serverless/lambda`, run this command to start serverless offline:

   ```
   serverless offline --stage dev
   ```

4. Make sure AWS S3 started locally by accessing this url: `http://127.0.0.1:4569/images-bucket`.

---

### C. Test the APIs

1. Go to your postman, try hit this url with this **JSON** body:

   `(POST) http://localhost:3000/dev/upload/`

   - With Image URL

   ```
   {
      "desc" : "demo upload for image URL",
      "url": "https://frederikboving.com/wp-content/uploads/2021/11/weight5.jpg",
   }
   ```

   - With Image provided

   ```
   {
      "desc" : "demo upload for image provided",
      "base64": "data:image/jpeg;base64,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"
   }
   ```

2. You should see your postman response with **200** and the response as below:

   ```
   {
      "url": "http://localhost:3000/dev/retrieve/cl8bk38zb000bkyxp97wofjp0.jpeg"
   }
   ```

3. Go to your postman again, try hit this url. {imageId} can get from Step2 (e.g. cl8bi7fao0002vbxp947k6kjw.jpeg)

   `(GET) http://localhost:3000/dev/retrieve/{imageId}`.

   You should be seeing the image that you uploaded just now.

4. Try repeat Step 3 again with query param **greyscale** and **resize** features.

   `(GET) http://localhost:3000/dev/retrieve/cl8bif8ss000bvbxpbt4p3h3r.jpeg?greyscale=true&resizeH=100&resizeW=200`

---

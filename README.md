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
        AttributeName=id,AttributeType=S \
        AttributeName=path,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH AttributeName=path,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
    ```

5. Create two(2) records in Images table, run this command in your CLI:
    ```
    aws dynamodb put-item --endpoint-url http://localhost:8000 \
    --table-name Images \
    --item \
        '{"id": {"S": "test001"}, "path": {"S": "folder_A/folder_B/image001.png"}, "Desc": {"S": "Testing uploaded image for test 001"}}' \
    --return-consumed-capacity TOTAL  
    ```

    ```
    aws dynamodb put-item --endpoint-url http://localhost:8000 \
    --table-name Images \
    --item \
        '{"id": {"S": "test002"}, "path": {"S": "folder_A/folder_B/image002.png"}, "Desc": {"S": "Testing uploaded image for test 002"}}' \
    --return-consumed-capacity TOTAL  
    ```


6. Query the record that you just created, run this command in your CLI:
    ```
    aws dynamodb query --endpoint-url http://localhost:8000 --table-name Images --key-conditions \
        '{"id": {"AttributeValueList": [{"S": "test002"}],"ComparisonOperator": "EQ"},"path": {"AttributeValueList": [{"S": "folder_A/folder_B/image002.png"}],"ComparisonOperator": "EQ"}}'
    ```

7. Scan entire table.
    ```
    aws dynamodb scan --endpoint-url http://localhost:8000 --table-name Images
    ```

---

## Run Serverless Offline

1. sfdf


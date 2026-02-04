docker run -d \
  --name product-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=prod \
  -e MONGO_INITDB_ROOT_PASSWORD=prod \
  -e MONGO_INITDB_DATABASE=proddb \
  -p 27019:27017 \
  -v product-mongo-data:/data/db \
  mongo:6

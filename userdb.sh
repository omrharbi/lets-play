docker run -d \
  --name user-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=user \
  -e MONGO_INITDB_ROOT_PASSWORD=user \
  -e MONGO_INITDB_DATABASE=userdb \
  -p 27018:27017 \
  -v user-mongo-data:/data/db \
  mongo:6

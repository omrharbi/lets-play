docker run -d \
  --name auth-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=auth \
  -e MONGO_INITDB_ROOT_PASSWORD=auth \
  -e MONGO_INITDB_DATABASE=authdb \
  -p 27019:27017 \
  -v auth-mongo-data:/data/db \
  mongo:6

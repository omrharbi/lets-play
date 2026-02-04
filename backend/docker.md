for show logs
docker logs auth-db

for  show ps 
docker ps 

✅ 3. Test connection from inside the container

docker exec -it auth-db mongosh
stop all container
docker stop $(docker ps -aq)   

remove all container 
docker rm $(docker ps -aq)   
remove all images 
docker rmi -f $(docker images -aq)   


stop compose with remove all 
docker-compose down -v


start compose and build

docker-compose up --build


🌍 What is a Docker Network?
A Docker network is like a private LAN (local network) for containers.
networks:
  app-network: 


Error response from daemon: cannot stop container: 330febb3d0e8: permission denied

sudo systemctl restart docker
Then try:
sudo docker ps   # check if containers are still there
sudo docker stop $(sudo docker ps -q)  # stop any remaining containers


./authdb.sh 
docker: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

Run 'docker run --help' for more information
omar@omar-Latitude-E7270:~/lets-play$ sudo systemctl daemon-reload
sudo systemctl start docker
sudo systemctl start containerd 




test> show dbs
MongoServerError[Unauthorized]: command listDatabases requires authentication
test> show collections
... 
MongoServerError[Unauthorized]: command listCollections requires authentication
test> 
docker exec -it auth-mongo  mongosh -u auth -p auth --authenticationDatabase admin


to create document
use authdb
to switch 
show collections //  this is collections 

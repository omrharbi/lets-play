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

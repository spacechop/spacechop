# /f/fd/ANGELO_Saison_1.png
# /e/e8/Kalidasa_lanata-Kadavoor-2017-05-23-003.jpg
docker pull williamyeh/wrk
docker pull nginx

# Start container and store hash of container
sc_hash=$(docker run -d -p 8080:3000 -v $(pwd)/benchmarking-config.yml:/config.yml spacechop node dist/index.js)
nginx_hash=$(docker run -d -p 8081:80 -v $(pwd)/assets:/usr/share/nginx/html nginx)
sleep 2
docker run --rm --net=host williamyeh/wrk -t 20 -c 40 -d 30 http://localhost:8080/t_720/wallet.jpg

# docker cp 
docker kill ${sc_hash}
docker kill ${nginx_hash}
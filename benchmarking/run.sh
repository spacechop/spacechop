docker pull williamyeh/wrk > /dev/null
docker pull nginx > /dev/null
docker build $(pwd)/../. -t spacechop-production

docker network create sc-benchmark

# Start container and store hash of container
sc_hash=$(docker run --net=sc-benchmark --name spacechop-benched -d -v $(pwd)/benchmarking-config.yml:/config.yml spacechop-production node dist/index.js)
nginx_hash=$(docker run --net=sc-benchmark --name nginx -d -v $(pwd)/assets:/usr/share/nginx/html nginx)
sleep 5

for image in $(ls ./assets)
do
  for preset in t_720 t_thumb
  do
    echo "Running ${preset} ${image}..."
    docker run --rm --net=sc-benchmark williamyeh/wrk -t 1 -c 1 -d 5 http://spacechop-benched:3000/${preset}/${image}
    echo ""
  done
done

docker kill ${sc_hash} ${nginx_hash} > /dev/null
docker rm ${sc_hash} ${nginx_hash} > /dev/null
docker network rm sc-benchmark > /dev/null

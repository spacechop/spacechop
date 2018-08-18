docker-compose up -d --build
docker-compose exec spacechop sh -c "npm run test:watch"

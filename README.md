build:
docker build -t chesscolate-web .
docker tag chesscolate-web jsonfront/chesscolate-web
docker push jsonfront/chesscolate-web
this is quick and simple so if you need any other help join the support server

<hr>

make sure nodejs is installed

download the files

cd to MC-status-bot

do `npm i`

copy the env example file and fill it in

`cp .env.example .env`

now you want to build the frontend

go to that folder `cd website-frontend`

install modules `npm i` then build it `npm run build`

when that is done you need to move it so do `mv dist ../website`

now you need to make some additional html files do this by copy paste the index.html file from dist and re name them to the following

- dashboard.html
- bug.html
- server.html

now you can make sure your in the root folder and then do `docker-compose up`

or manually install mongodb and redis start them then run it with `node .`
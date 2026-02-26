FROM ubuntu:focal

RUN apt-get update && \
	apt-get install -y curl git && \
	curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
	apt-get update -y && \
	apt-get install -y nodejs

WORKDIR /home/app


COPY main.sh main.sh
COPY server.js server.js
COPY package*.json .

RUN npm install

RUN chmod +x main.sh
RUN chmod +x server.js

ENTRYPOINT [ "/home/app/main.sh" ]
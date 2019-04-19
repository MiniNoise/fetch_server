FROM node:lts-jessie

LABEL author="Arnaud (Martient) Leherpeur"
LABEL version="1.0.0"

EXPOSE 3000 9229

RUN mkdir /app
WORKDIR /app
COPY . .

RUN npm install

CMD ./run.sh
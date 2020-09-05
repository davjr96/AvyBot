From node
WORKDIR /code

COPY . /code

RUN npm install

CMD node AvyBot.js


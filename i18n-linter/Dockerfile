FROM node:10-slim

LABEL "com.github.actions.name"="I18n Linter"
LABEL "com.github.actions.description"="Checks for missing translation keys"
LABEL "com.github.actions.icon"="code"
LABEL "com.github.actions.color"="gray-dark"

LABEL "repository"="https://github.com/vas-dev/vas-actions"
LABEL "homepage"="https://github.com/vas-dev/vas-actions"
LABEL "maintainer"="Marcelo Alves <marcelo.alves@vas.com>, Jason Soares <jason.soares@vas.com>"

ADD package.json /package.json
ADD package-lock.json /package-lock.json
WORKDIR /
COPY . /

RUN npm ci

ENTRYPOINT ["node", "/index.js"]

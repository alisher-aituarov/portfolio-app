FROM node:14

RUN mkdir -p /var/www
WORKDIR /var/www/

# Installing dependencies
COPY ./package.json /var/www
COPY ./package-lock.json /var/www
RUN npm install

# Copying source files
COPY . /var/www

# Building app
#RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

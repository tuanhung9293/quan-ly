FROM node:boron

# Install dependencies: mongo, redis and nginx
RUN apt-get update && apt-get install -y mongodb-server redis-server nginx nano apt-transport-https

# Configure mongodb and redis
RUN mkdir -p /data/redis && chown redis:redis /data/redis
RUN mkdir -p /data/mongo && chown mongodb:mongodb /data/mongo

VOLUME /data

ADD ./mongo.conf /etc/mongodb.conf
ADD ./redis.conf /etc/redis/redis.conf

# Make ssh dir
RUN mkdir /root/.ssh/

# Copy over private key, and set permissions
ADD ./quanly /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

RUN mkdir /code
WORKDIR /code

# Source code
RUN npm update && npm install -g nodemon lab wait-for-mongo wait-for-redis

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

RUN mkdir /quanly-based
WORKDIR /quanly-based
ADD ./cache-node-modules/yarn.lock    /quanly-based
ADD ./cache-node-modules/package.json /quanly-based
RUN yarn install
RUN rm -rf /quanly-based
WORKDIR /code

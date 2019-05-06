#start from node base image
FROM node 

# specifies production or testing mode API URL
ENV API_URL = "localhost"

# less messages during Docker build
ENV NPM_CONFIG_LOGLEVEL warn 

# Allows app_env to be set during build (defaults to empty string)
ARG app_env                  

# sets an environment variable to app_env argument, so that variable will persist in container for use in node
ENV APP_ENV $app_env         

# creates folder to add code into
RUN mkdir -p /app   

# all commands will be run from this folder now
WORKDIR /app          

# copy code in local frontend directory into container's working directory
COPY . /app    
WORKDIR /app 

# install dependencies
RUN npm install
RUN npm install --save reactstrap react react-dom 
RUN npm install --save bootstrap react-router-dom react-select
RUN npm install --save-dev mocha
 
# If the arg_env was set as production, then this will install http-server and build/service optimized static files
# Otherwise, uses create-react-app's hot reloading tool

RUN npm install -g react-scripts
# RUN npm run start
CMD if [ ${APP_ENV} = production ]; \
	then \
	npm install -g http-server && \
	npm run build && \
	cd build && \
	hs -p 3000; \
	else \
	npm run start; \
	fi

# app runs on port 3000 by default
EXPOSE 3000

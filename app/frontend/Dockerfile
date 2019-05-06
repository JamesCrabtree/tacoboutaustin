#start from node base image
FROM node

# less messages during Docker build
ENV NPM_CONFIG_LOGLEVEL warn 

# creates folder to add code into
RUN mkdir -p /app      

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

# RUN npm install -g react-scripts
# # RUN npm run start
# CMD if [ ${APP_ENV} = production ]; \
# 	then \
# 	npm install -g http-server && \
# 	npm run build && \
# 	cd build && \
# 	hs -p 3000; \
# 	else \
# 	npm run start; \
# 	fi

# # app runs on port 3000 by default
# EXPOSE 3000


RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
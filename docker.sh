#!/bin/bash

docker kill taco
docker rm taco
docker build -t tacoboutaustin .
docker run -d --name taco --restart=always -p 80:80 -t -v `pwd`/app:/app tacoboutaustin

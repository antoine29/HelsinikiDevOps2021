#!/bin/sh

if [ ! -d "./material-applications/example-backend/" ] 
then
    echo "Repo directory doesn't exists. Pulling repository." 
    git clone https://github.com/docker-hy/material-applications.git
else
    echo "Repo directory already exists" 
fi
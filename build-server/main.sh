#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL";


mkdir -p /home/app/output
git clone "$GIT_REPOSITORY_URL" /home/app/output


exec node server.js

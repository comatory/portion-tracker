#!/bin/bash
WHITE='\033[1;37m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'
NORMAL='\033[0m'

# NOTE: When passing argument "screen" it will attach the processes to screen session
SCREEN=0
if [[ "$@" == "screen" ]]
then
  SCREEN=1
fi

if [ "$SCREEN" -eq "1" ]
then
  screen -d -m -S pt_backend_log npm run start:dev 
  cd frontend
  screen -d -m -S pt_frontend_log npm run start 
  cd ..
else
  # NOTE: Because we're storing PID, I can't run NPM script -> this has to reflect npm run start:dev
  ./node_modules/.bin/nodemon index.js > ./logs/backend.log 2> /dev/null &
  export PT_BACKEND_PROCESS=$!
  cd frontend
  # NOTE: Because we're storing PID, I can't run NPM script -> this has to reflect npm run start
  ./node_modules/.bin/webpack-dev-server --progress --colors --port 3001 --config webpack.config.babel.js --env.dev > ../logs/frontend.log 2> /dev/null &
  export PT_FRONTEND_PROCESS=$!
  cd .. 
fi


if [ "$SCREEN" -eq "1" ]
then
  screen -ls

  echo -e "\n${YELLOW}Attach to any of these screens to see output:${NC} ${BOLD}screen -x SCREEN_ID${NORMAL}"
else
  echo -e "\n${WHITE}--- SERVER PROCESSES --${NC}\n"
  echo -e "${GREEN}* backend process PID: ${PT_BACKEND_PROCESS}${NC}"
  echo -e "${GREEN}* frontend process PID: ${PT_FRONTEND_PROCESS}${NC}"

  for (( ; ; ));do echo -e "\n${RED}${BOLD}DON'T FORGET!${NORMAL}${NC} Press ^C and type \"./kill.sh\" to kill servers." && sleep 60; done
fi

echo -e "${YELLOW}Backend is served on:${NC} ${WHITE}http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend is served on:${NC} ${WHITE}http://localhost:3001${NC}"

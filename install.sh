#!/bin/bash
WHITE='\033[1;37m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${WHITE}--- INSTALLATION ---${NC}\n"
sleep 1

echo -e "${WHITE}✗ BACKEND ➾ installing${NC}"
echo -e "${RED}✗ FRONTEND${NC}\n"
npm i
echo -e "${GREEN}✓ BACKEND ➾ finished${NC}"
echo -e "${RED}✗ FRONTEND${NC}\n"

cd frontend

echo -e "${GREEN}✓ BACKEND ➾ finished${NC}"
echo -e "${WHITE}✗ FRONTEND ➾ installing${NC}\n"

npm i

cd ..

sleep 1 

echo -e "\n${WHITE}--- INSTALLATION RESULTS ---${NC}\n"
echo -e "${GREEN}✓ BACKEND ➾ finished${NC}"
echo -e "${GREEN}✓ FRONTEND ➾ finished${NC}\n"

DEV_DATABASE=$(node -pe "require('./config/config.json')['development']['database']")
echo -e "\n${WHITE}--- SETUP BACKEND DATABASE ---${NC}\n"
echo -e "${RED}WARNING! This will delete all data in the table you specified in \`config/config.json\`${NC}: ${DEV_DATABASE}"

while true; do
    read -p "Do you want to set up database? (y/n) " yn
    case $yn in
        [Yy]* ) npm run db:recreate; break;;
        [Nn]* ) break;;
        * ) echo "Please answer yes or no.";;
    esac
done


echo -e "${YELLOW} * NPM has finished installing. Now to start up both apps in development mode, launch _run.sh_."
echo -e "* Preferably if you have *screen* installed on your system launch _run.sh screen_."
echo -e "* Good luck!${NC}\n"

exit
